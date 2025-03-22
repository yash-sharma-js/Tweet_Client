
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

export type BlacklistedTweet = {
  id: string;
  username: string;
  tweet: string;
  score: number;
  timestamp: string;
};

interface BlacklistContextType {
  blacklist: BlacklistedTweet[];
  addToBlacklist: (tweet: BlacklistedTweet) => void;
  removeFromBlacklist: (id: string) => void;
  clearBlacklist: () => void;
}

const BlacklistContext = createContext<BlacklistContextType | undefined>(undefined);

export const BlacklistProvider = ({ children }: { children: ReactNode }) => {
  const [blacklist, setBlacklist] = useState<BlacklistedTweet[]>([]);

  // Load blacklist from localStorage on mount
  useEffect(() => {
    const savedBlacklist = localStorage.getItem("blacklistedTweets");
    if (savedBlacklist) {
      try {
        setBlacklist(JSON.parse(savedBlacklist));
      } catch (error) {
        console.error("Error parsing blacklist from localStorage:", error);
        localStorage.removeItem("blacklistedTweets");
      }
    }
  }, []);

  // Save blacklist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("blacklistedTweets", JSON.stringify(blacklist));
  }, [blacklist]);

  const addToBlacklist = (tweet: BlacklistedTweet) => {
    setBlacklist(prev => {
      // Check if tweet already exists in blacklist
      if (prev.some(item => item.id === tweet.id)) {
        return prev;
      }
      return [tweet, ...prev];
    });
  };

  const removeFromBlacklist = (id: string) => {
    setBlacklist(prev => prev.filter(tweet => tweet.id !== id));
    toast.success("Tweet removed from blacklist");
  };

  const clearBlacklist = () => {
    setBlacklist([]);
    toast.success("Blacklist cleared");
  };

  return (
    <BlacklistContext.Provider
      value={{
        blacklist,
        addToBlacklist,
        removeFromBlacklist,
        clearBlacklist
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
