
import { useState } from "react";
import { toast } from "sonner";
import { useBlacklist } from "./useBlacklist";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type SentimentResult = {
  score: number;
  label: "positive" | "negative" | "neutral";
  confidence: number;
};

export function useSentiment() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const { user } = useAuth();
  
  // Function to analyze sentiment
  const analyzeSentiment = async (username: string, tweetText: string) => {
    if (!tweetText.trim()) {
      toast.error("Please enter a tweet to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      setResult(null);
      
      // Call Supabase edge function to analyze sentiment
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      const response = await fetch('https://netcarmsimamwzchhxkk.supabase.co/functions/v1/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ username, tweet: tweetText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze sentiment');
      }
      
      const data = await response.json();
      const finalResult = { 
        score: data.score, 
        label: data.label as "positive" | "negative" | "neutral", 
        confidence: data.confidence 
      };
      
      setResult(finalResult);
      
      // Store the tweet analysis in Supabase
      if (user) {
        await supabase.from('tweets').insert({
          user_id: user.id,
          twitter_username: username,
          content: tweetText,
          sentiment_score: finalResult.score,
          sentiment_label: finalResult.label
        });
        
        // Check if we need to update blacklist
        if (finalResult.label === "negative") {
          await updateBlacklist(username);
        }
      }
      
      return finalResult;
    } catch (error) {
      toast.error("Failed to analyze sentiment. Please try again.");
      console.error("Sentiment analysis error:", error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Function to update blacklist
  const updateBlacklist = async (twitterUsername: string) => {
    if (!user) return;
    
    try {
      // Check if user already exists in blacklisted_users
      const { data: existingUsers, error: queryError } = await supabase
        .from('blacklisted_users')
        .select('*')
        .eq('twitter_username', twitterUsername)
        .eq('user_id', user.id);
      
      if (queryError) {
        console.error("Error querying blacklist:", queryError);
        return;
      }
      
      const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
      
      if (existingUser) {
        // User exists, increment negative tweet count
        const newCount = existingUser.negative_tweet_count + 1;
        const shouldBlacklist = newCount >= 3;
        
        const { error: updateError } = await supabase
          .from('blacklisted_users')
          .update({ 
            negative_tweet_count: newCount,
            blacklisted: shouldBlacklist,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);
        
        if (updateError) {
          console.error("Error updating blacklist:", updateError);
          return;
        }
        
        if (shouldBlacklist && !existingUser.blacklisted) {
          toast.warning(`@${twitterUsername} has been blacklisted due to multiple negative tweets`);
        }
      } else {
        // User doesn't exist, create new record
        const { error: insertError } = await supabase
          .from('blacklisted_users')
          .insert({
            twitter_username: twitterUsername,
            negative_tweet_count: 1,
            blacklisted: false,
            user_id: user.id
          });
          
        if (insertError) {
          console.error("Error inserting to blacklist:", insertError);
        }
      }
    } catch (error) {
      console.error("Error updating blacklist:", error);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return {
    analyzeSentiment,
    resetResult,
    result,
    isAnalyzing
  };
}
