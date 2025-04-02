
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type BlacklistedTweet = {
  id: string;
  username: string;
  negative_tweet_count: number;
  blacklisted: boolean;
  updated_at: string;
};

interface BlacklistContextType {
  blacklist: BlacklistedTweet[];
  removeFromBlacklist: (id: string) => Promise<void>;
  clearBlacklist: () => Promise<void>;
  isLoading: boolean;
  refreshBlacklist: () => Promise<void>;
}

const BlacklistContext = createContext<BlacklistContextType | undefined>(undefined);

export const BlacklistProvider = ({ children }: { children: ReactNode }) => {
  const [blacklist, setBlacklist] = useState<BlacklistedTweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load blacklist from Supabase when user changes
  useEffect(() => {
    if (user) {
      refreshBlacklist();
    } else {
      setBlacklist([]);
    }
  }, [user]);

  // Function to refresh blacklist from Supabase
  const refreshBlacklist = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('blacklisted_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('blacklisted', true)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching blacklist:", error);
        return;
      }
      
      const formattedData = data.map(item => ({
        id: item.id,
        username: item.twitter_username,
        negative_tweet_count: item.negative_tweet_count,
        blacklisted: item.blacklisted,
        updated_at: item.updated_at
      }));
      
      setBlacklist(formattedData);
    } catch (error) {
      console.error("Error refreshing blacklist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove from blacklist
  const removeFromBlacklist = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('blacklisted_users')
        .update({ blacklisted: false })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error removing from blacklist:", error);
        toast.error("Failed to remove from blacklist");
        return;
      }
      
      setBlacklist(prev => prev.filter(item => item.id !== id));
      toast.success("Removed from blacklist");
    } catch (error) {
      console.error("Error removing from blacklist:", error);
      toast.error("Failed to remove from blacklist");
    }
  };

  // Function to clear blacklist
  const clearBlacklist = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('blacklisted_users')
        .update({ blacklisted: false })
        .eq('user_id', user.id)
        .eq('blacklisted', true);
      
      if (error) {
        console.error("Error clearing blacklist:", error);
        toast.error("Failed to clear blacklist");
        return;
      }
      
      setBlacklist([]);
      toast.success("Blacklist cleared");
    } catch (error) {
      console.error("Error clearing blacklist:", error);
      toast.error("Failed to clear blacklist");
    }
  };

  return (
    <BlacklistContext.Provider
      value={{
        blacklist,
        removeFromBlacklist,
        clearBlacklist,
        isLoading,
        refreshBlacklist
      }}
    >
      {children}
    </BlacklistContext.Provider>
  );
};

export const useBlacklist = () => {
  const context = useContext(BlacklistContext);
  
  if (context === undefined) {
    throw new Error("useBlacklist must be used within a BlacklistProvider");
  }
  
  return context;
};
