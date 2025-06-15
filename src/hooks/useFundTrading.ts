
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from '@supabase/supabase-js';

export const useFundTrading = (session: Session | null) => {
  const [isTrading, setIsTrading] = useState(false);
  const { toast } = useToast();

  const executeFundTrade = async (
    fundId: number,
    action: string,
    shares: number,
    price: number
  ) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to trade funds.",
        variant: "destructive",
      });
      return false;
    }

    setIsTrading(true);

    try {
      const totalCost = shares * price;

      if (action === "buy") {
        // Check user balance
        const { data: balance, error: balanceError } = await supabase
          .from('balances')
          .select('balance')
          .eq('user_id', session.user.id)
          .single();

        if (balanceError) {
          throw new Error('Failed to fetch balance');
        }

        if (balance.balance < totalCost) {
          toast({
            title: "Insufficient funds",
            description: `You need $${totalCost.toFixed(2)} but only have $${balance.balance.toFixed(2)}.`,
            variant: "destructive",
          });
          return false;
        }

        // Update balance
        const { error: updateBalanceError } = await supabase
          .from('balances')
          .update({ balance: balance.balance - totalCost })
          .eq('user_id', session.user.id);

        if (updateBalanceError) {
          throw new Error('Failed to update balance');
        }

        // Update or create fund portfolio entry
        const { data: existingPosition, error: positionError } = await supabase
          .from('fund_portfolio')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('fund_id', fundId)
          .maybeSingle();

        if (positionError) {
          throw new Error('Failed to fetch existing position');
        }

        if (existingPosition) {
          // Update existing position
          const newShares = existingPosition.shares + shares;
          const newAvgPrice = ((existingPosition.shares * existingPosition.avg_price) + totalCost) / newShares;

          const { error: updateError } = await supabase
            .from('fund_portfolio')
            .update({
              shares: newShares,
              avg_price: newAvgPrice,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPosition.id);

          if (updateError) {
            throw new Error('Failed to update portfolio');
          }
        } else {
          // Create new position
          const { error: insertError } = await supabase
            .from('fund_portfolio')
            .insert({
              user_id: session.user.id,
              fund_id: fundId,
              shares: shares,
              avg_price: price
            });

          if (insertError) {
            throw new Error('Failed to create portfolio entry');
          }
        }

        // Record transaction
        const { error: transactionError } = await supabase
          .from('fund_transactions')
          .insert({
            user_id: session.user.id,
            fund_id: fundId,
            type: 'buy',
            shares: shares,
            price: price
          });

        if (transactionError) {
          throw new Error('Failed to record transaction');
        }

        toast({
          title: "Purchase successful!",
          description: `You bought ${shares} shares for $${totalCost.toFixed(2)}.`,
        });

      } else if (action === "sell") {
        // Get current position
        const { data: position, error: positionError } = await supabase
          .from('fund_portfolio')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('fund_id', fundId)
          .single();

        if (positionError || !position) {
          toast({
            title: "No position found",
            description: "You don't own any shares of this fund.",
            variant: "destructive",
          });
          return false;
        }

        if (position.shares < shares) {
          toast({
            title: "Insufficient shares",
            description: `You only own ${position.shares} shares.`,
            variant: "destructive",
          });
          return false;
        }

        // Update portfolio
        const newShares = position.shares - shares;
        if (newShares === 0) {
          // Delete position if no shares left
          const { error: deleteError } = await supabase
            .from('fund_portfolio')
            .delete()
            .eq('id', position.id);

          if (deleteError) {
            throw new Error('Failed to update portfolio');
          }
        } else {
          // Update shares
          const { error: updateError } = await supabase
            .from('fund_portfolio')
            .update({
              shares: newShares,
              updated_at: new Date().toISOString()
            })
            .eq('id', position.id);

          if (updateError) {
            throw new Error('Failed to update portfolio');
          }
        }

        // Update balance
        const { data: balance, error: balanceError } = await supabase
          .from('balances')
          .select('balance')
          .eq('user_id', session.user.id)
          .single();

        if (balanceError) {
          throw new Error('Failed to fetch balance');
        }

        const { error: updateBalanceError } = await supabase
          .from('balances')
          .update({ balance: balance.balance + totalCost })
          .eq('user_id', session.user.id);

        if (updateBalanceError) {
          throw new Error('Failed to update balance');
        }

        // Record transaction
        const { error: transactionError } = await supabase
          .from('fund_transactions')
          .insert({
            user_id: session.user.id,
            fund_id: fundId,
            type: 'sell',
            shares: shares,
            price: price
          });

        if (transactionError) {
          throw new Error('Failed to record transaction');
        }

        toast({
          title: "Sale successful!",
          description: `You sold ${shares} shares for $${totalCost.toFixed(2)}.`,
        });
      }

      return true;
    } catch (error) {
      console.error('Trade execution error:', error);
      toast({
        title: "Trade failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTrading(false);
    }
  };

  return {
    executeFundTrade,
    isTrading
  };
};
