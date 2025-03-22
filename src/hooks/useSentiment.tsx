
import { useState } from "react";
import { toast } from "sonner";
import { useBlacklist } from "./useBlacklist";

type SentimentResult = {
  score: number;
  label: "positive" | "negative" | "neutral";
  confidence: number;
};

export function useSentiment() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const { addToBlacklist } = useBlacklist();

  // Function to analyze sentiment
  const analyzeSentiment = async (username: string, tweetText: string) => {
    if (!tweetText.trim()) {
      toast.error("Please enter a tweet to analyze");
      return;
    }

    try {
      setIsAnalyzing(true);
      setResult(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock sentiment analysis logic
      const containsOffensiveWords = 
        tweetText.toLowerCase().includes("hate") || 
        tweetText.toLowerCase().includes("stupid") ||
        tweetText.toLowerCase().includes("terrible");
      
      const score = containsOffensiveWords 
        ? -Math.random() * 0.8 - 0.2 // -0.2 to -1.0
        : Math.random() * 1.6 - 0.8;  // -0.8 to 0.8
      
      let label: "positive" | "negative" | "neutral";
      
      if (score > 0.2) {
        label = "positive";
      } else if (score < -0.2) {
        label = "negative";
      } else {
        label = "neutral";
      }
      
      const confidence = Math.abs(score) * 0.8 + 0.2; // 0.2 to 1.0
      
      const finalResult = { score, label, confidence };
      setResult(finalResult);
      
      // Check if tweet should be blacklisted (for demonstration)
      if (label === "negative" && confidence > 0.7) {
        addToBlacklist({
          id: Date.now().toString(),
          username,
          tweet: tweetText,
          score,
          timestamp: new Date().toISOString()
        });
        toast.info("Tweet has been added to the blacklist due to high negative sentiment");
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
