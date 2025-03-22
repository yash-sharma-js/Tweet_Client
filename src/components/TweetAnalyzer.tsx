
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSentiment } from "@/hooks/useSentiment";
import { AnalysisResult } from "./AnalysisResult";

export function TweetAnalyzer() {
  const [username, setUsername] = useState("");
  const [tweet, setTweet] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { analyzeSentiment, result, isAnalyzing, resetResult } = useSentiment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyzeSentiment(username, tweet);
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setUsername("");
    setTweet("");
    resetResult();
    setHasSubmitted(false);
  };

  return (
    <Card className="w-full overflow-hidden border border-border/50 bg-card shadow-xl transition-all hover:border-border/80">
      <CardHeader className="px-6">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Analyze Tweet Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="username">
              Twitter Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isAnalyzing}
              className="glass transition-all focus:border-primary/50"
              autoComplete="off"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="tweet">
              Tweet Content
            </label>
            <Textarea
              id="tweet"
              name="tweet"
              placeholder="Enter the tweet you want to analyze..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              required
              disabled={isAnalyzing}
              className="min-h-[120px] glass transition-all focus:border-primary/50"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {hasSubmitted && !isAnalyzing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isAnalyzing}
              >
                Analyze Another
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isAnalyzing || !username || !tweet}
              className="bg-primary hover:bg-primary/90 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyze Sentiment
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      {hasSubmitted && result && (
        <CardFooter className="border-t border-border/30 bg-card/50 p-6">
          <AnalysisResult result={result} tweet={tweet} username={username} />
        </CardFooter>
      )}
    </Card>
  );
}
