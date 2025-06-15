export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json
          description: string
          icon: string | null
          id: string
          name: string
          reward_type: string | null
          reward_value: number | null
        }
        Insert: {
          created_at?: string
          criteria: Json
          description: string
          icon?: string | null
          id?: string
          name: string
          reward_type?: string | null
          reward_value?: number | null
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string
          icon?: string | null
          id?: string
          name?: string
          reward_type?: string | null
          reward_value?: number | null
        }
        Relationships: []
      }
      api_configs: {
        Row: {
          access_token: string | null
          client_id: string | null
          client_secret: string | null
          created_at: string
          expires_at: string | null
          id: string
          refresh_token: string | null
          service: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          service: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          client_id?: string | null
          client_secret?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          refresh_token?: string | null
          service?: string
          updated_at?: string
        }
        Relationships: []
      }
      balances: {
        Row: {
          balance: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
          submission_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
          submission_type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
          submission_type?: string
        }
        Relationships: []
      }
      educational_content: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          difficulty: string
          id: string
          published: boolean | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          difficulty: string
          id?: string
          published?: boolean | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          difficulty?: string
          id?: string
          published?: boolean | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          calculated_at: string
          id: string
          period: string
          profit_loss: number
          profit_loss_percentage: number
          rank: number | null
          total_portfolio_value: number
          user_id: string
        }
        Insert: {
          calculated_at?: string
          id?: string
          period: string
          profit_loss: number
          profit_loss_percentage: number
          rank?: number | null
          total_portfolio_value: number
          user_id: string
        }
        Update: {
          calculated_at?: string
          id?: string
          period?: string
          profit_loss?: number
          profit_loss_percentage?: number
          rank?: number | null
          total_portfolio_value?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          avg_price: number
          id: number
          shares: number
          streamer_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_price: number
          id?: number
          shares: number
          streamer_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_price?: number
          id?: number
          shares?: number
          streamer_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean | null
          streamer_id: number
          target_price: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          streamer_id: number
          target_price: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          streamer_id?: number
          target_price?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shared_trades: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          likes_count: number | null
          transaction_id: number
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          likes_count?: number | null
          transaction_id: number
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          likes_count?: number | null
          transaction_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_trades_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      streamers: {
        Row: {
          avatar: string | null
          avg_viewers: number
          change: number
          change_percent: number
          created_at: string
          external_id: string | null
          followers: number
          id: number
          is_live: boolean | null
          last_updated: string | null
          name: string
          platform: string
          price: number
          social_media_url: string | null
          streaming_url: string | null
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          avg_viewers: number
          change: number
          change_percent: number
          created_at?: string
          external_id?: string | null
          followers: number
          id?: number
          is_live?: boolean | null
          last_updated?: string | null
          name: string
          platform: string
          price: number
          social_media_url?: string | null
          streaming_url?: string | null
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          avg_viewers?: number
          change?: number
          change_percent?: number
          created_at?: string
          external_id?: string | null
          followers?: number
          id?: number
          is_live?: boolean | null
          last_updated?: string | null
          name?: string
          platform?: string
          price?: number
          social_media_url?: string | null
          streaming_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          id: number
          price: number
          shares: number
          streamer_id: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          price: number
          shares: number
          streamer_id: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          price?: number
          shares?: number
          streamer_id?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_analytics: {
        Row: {
          best_performing_streamer_id: number | null
          created_at: string
          id: string
          portfolio_growth_percentage: number | null
          risk_score: number | null
          total_profit_loss: number | null
          total_trades: number | null
          trading_streak: number | null
          updated_at: string
          user_id: string
          worst_performing_streamer_id: number | null
        }
        Insert: {
          best_performing_streamer_id?: number | null
          created_at?: string
          id?: string
          portfolio_growth_percentage?: number | null
          risk_score?: number | null
          total_profit_loss?: number | null
          total_trades?: number | null
          trading_streak?: number | null
          updated_at?: string
          user_id: string
          worst_performing_streamer_id?: number | null
        }
        Update: {
          best_performing_streamer_id?: number | null
          created_at?: string
          id?: string
          portfolio_growth_percentage?: number | null
          risk_score?: number | null
          total_profit_loss?: number | null
          total_trades?: number | null
          trading_streak?: number | null
          updated_at?: string
          user_id?: string
          worst_performing_streamer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_analytics_best_performing_streamer_id_fkey"
            columns: ["best_performing_streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_analytics_worst_performing_streamer_id_fkey"
            columns: ["worst_performing_streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string
          id: string
          streamer_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          streamer_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          streamer_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_streamer_id_fkey"
            columns: ["streamer_id"]
            isOneToOne: false
            referencedRelation: "streamers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
