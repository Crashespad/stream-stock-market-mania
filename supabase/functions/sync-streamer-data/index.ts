
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TwitchUser {
  id: string
  login: string
  display_name: string
  profile_image_url: string
  view_count: number
  broadcaster_type: string
}

interface TwitchStream {
  user_id: string
  user_login: string
  user_name: string
  viewer_count: number
  started_at: string
  type: string
}

interface YouTubeChannel {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      default: { url: string }
    }
  }
  statistics: {
    subscriberCount: string
    viewCount: string
    videoCount: string
  }
}

interface YouTubeVideo {
  id: string
  snippet: {
    channelId: string
    title: string
    liveBroadcastContent: string
  }
  liveStreamingDetails?: {
    concurrentViewers: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get API configurations
    const { data: apiConfigs, error: configError } = await supabaseClient
      .from('api_configs')
      .select('*')

    if (configError) {
      console.error('Error fetching API configs:', configError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch API configurations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const twitchConfig = apiConfigs?.find(config => config.service === 'twitch')
    const youtubeConfig = apiConfigs?.find(config => config.service === 'youtube')

    // Get all streamers that need updating
    const { data: streamers, error: streamersError } = await supabaseClient
      .from('streamers')
      .select('*')
      .not('external_id', 'is', null)

    if (streamersError) {
      console.error('Error fetching streamers:', streamersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch streamers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const updates = []

    // Process Twitch streamers
    if (twitchConfig?.access_token) {
      const twitchStreamers = streamers?.filter(s => s.platform === 'twitch') || []
      
      if (twitchStreamers.length > 0) {
        try {
          // Get Twitch user data
          const userIds = twitchStreamers.map(s => s.external_id).join('&login=')
          const usersResponse = await fetch(`https://api.twitch.tv/helix/users?login=${userIds}`, {
            headers: {
              'Authorization': `Bearer ${twitchConfig.access_token}`,
              'Client-Id': twitchConfig.client_id!,
            },
          })

          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            const users: TwitchUser[] = usersData.data || []

            // Get stream data
            const streamIds = users.map(u => u.id).join('&user_id=')
            const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?user_id=${streamIds}`, {
              headers: {
                'Authorization': `Bearer ${twitchConfig.access_token}`,
                'Client-Id': twitchConfig.client_id!,
              },
            })

            let streams: TwitchStream[] = []
            if (streamsResponse.ok) {
              const streamsData = await streamsResponse.json()
              streams = streamsData.data || []
            }

            // Process updates
            for (const streamer of twitchStreamers) {
              const user = users.find(u => u.login.toLowerCase() === streamer.external_id?.toLowerCase())
              if (user) {
                const stream = streams.find(s => s.user_id === user.id)
                const followers = user.view_count || streamer.followers
                const avgViewers = stream?.viewer_count || streamer.avg_viewers
                const isLive = !!stream
                
                // Calculate price change (simple simulation)
                const oldPrice = streamer.price
                const priceFactor = 1 + ((followers / 1000000) * 0.1) + (isLive ? 0.05 : 0)
                const newPrice = Math.max(1, oldPrice * (0.95 + Math.random() * 0.1) * priceFactor)
                const change = newPrice - oldPrice
                const changePercent = (change / oldPrice) * 100

                updates.push({
                  id: streamer.id,
                  followers,
                  avg_viewers: avgViewers,
                  is_live: isLive,
                  price: Number(newPrice.toFixed(2)),
                  change: Number(change.toFixed(2)),
                  change_percent: Number(changePercent.toFixed(2)),
                  avatar: user.profile_image_url || streamer.avatar,
                  last_updated: new Date().toISOString(),
                })
              }
            }
          }
        } catch (error) {
          console.error('Error fetching Twitch data:', error)
        }
      }
    }

    // Process YouTube streamers
    if (youtubeConfig?.client_id) {
      const youtubeStreamers = streamers?.filter(s => s.platform === 'youtube') || []
      
      if (youtubeStreamers.length > 0) {
        try {
          // Note: This would require OAuth setup for full implementation
          // For now, we'll simulate some updates
          for (const streamer of youtubeStreamers) {
            const simulatedGrowth = 0.98 + Math.random() * 0.04 // -2% to +2%
            const newFollowers = Math.floor(streamer.followers * simulatedGrowth)
            const newAvgViewers = Math.floor(streamer.avg_viewers * simulatedGrowth)
            
            const oldPrice = streamer.price
            const newPrice = Math.max(1, oldPrice * simulatedGrowth)
            const change = newPrice - oldPrice
            const changePercent = (change / oldPrice) * 100

            updates.push({
              id: streamer.id,
              followers: newFollowers,
              avg_viewers: newAvgViewers,
              price: Number(newPrice.toFixed(2)),
              change: Number(change.toFixed(2)),
              change_percent: Number(changePercent.toFixed(2)),
              last_updated: new Date().toISOString(),
            })
          }
        } catch (error) {
          console.error('Error processing YouTube data:', error)
        }
      }
    }

    // Apply updates
    const updatePromises = updates.map(update => 
      supabaseClient
        .from('streamers')
        .update(update)
        .eq('id', update.id)
    )

    await Promise.all(updatePromises)

    console.log(`Updated ${updates.length} streamers`)

    return new Response(
      JSON.stringify({ 
        message: `Successfully updated ${updates.length} streamers`,
        updated: updates.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in sync-streamer-data:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
