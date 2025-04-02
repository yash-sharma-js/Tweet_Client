
import { ThumbsUp, ThumbsDown, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultProps {
  result: {
    score: number;
    label: "positive" | "negative" | "neutral";
    confidence: number;
  };
  tweet: string;
  username: string;
}

export function AnalysisResult({ result, tweet, username }: AnalysisResultProps) {
  const { label, confidence } = result;
  
  const confidencePercentage = confidence * 100;
  
  return (
    <div className="w-full animate-fade-in space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-medium text-foreground">Analysis Result</h3>
        <p className="text-sm text-muted-foreground">
          Tweet by <span className="font-medium">@{username}</span>
        </p>
      </div>
      
      <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <div 
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-2",
              label === "positive" && "border-positive text-positive",
              label === "negative" && "border-negative text-negative",
              label === "neutral" && "border-muted-foreground text-muted-foreground"
            )}
          >
            {label === "positive" && <ThumbsUp className="h-8 w-8" />}
            {label === "negative" && <ThumbsDown className="h-8 w-8" />}
            {label === "neutral" && <ChevronsRight className="h-8 w-8" />}
          </div>
          
          <div className="ml-0 flex flex-col items-center sm:ml-4 sm:items-start">
            <h2 
              className={cn(
                "text-2xl font-bold",
                label === "positive" && "text-positive",
                label === "negative" && "text-negative",
                label === "neutral" && "text-muted-foreground"
              )}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)} Sentiment
            </h2>
            
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              {label === "positive" 
                ? "This tweet has a positive tone and sentiment." 
                : label === "negative"
                ? "This tweet has a negative tone and sentiment."
                : "This tweet has a neutral tone and sentiment."}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Confidence</span>
              <span>{confidencePercentage.toFixed(0)}%</span>
            </div>
            <Progress 
              value={confidencePercentage} 
              className={cn(
                "h-2",
                label === "positive" && "bg-muted [&>div]:bg-positive",
                label === "negative" && "bg-muted [&>div]:bg-negative",
                label === "neutral" && "bg-muted [&>div]:bg-muted-foreground"
              )}
            />
          </div>
        </div>
        
        <div className="rounded-md bg-accent/50 p-3">
          <p className="text-sm font-medium text-muted-foreground">{tweet}</p>
        </div>
      </div>
    </div>
  );
}
