
import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBlacklist, BlacklistedTweet } from "@/hooks/useBlacklist";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function BlacklistSection() {
  const { blacklist, removeFromBlacklist, clearBlacklist } = useBlacklist();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  
  const paginatedBlacklist = blacklist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(blacklist.length / itemsPerPage);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  
  return (
    <Card className="w-full overflow-hidden border border-border/50 bg-card shadow-xl transition-all hover:border-border/80">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-negative" />
          Blacklisted Tweets
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="blacklist-toggle" className="text-sm">
            {isVisible ? "Hide" : "Show"}
          </Label>
          <Switch
            id="blacklist-toggle"
            checked={isVisible}
            onCheckedChange={setIsVisible}
          />
        </div>
      </CardHeader>
      
      {isVisible && (
        <>
          <CardContent className="px-6">
            {blacklist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-accent/30 p-3">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No blacklisted tweets</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tweets with high negative sentiment will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedBlacklist.map((tweet: BlacklistedTweet) => (
                  <BlacklistedTweetCard
                    key={tweet.id}
                    tweet={tweet}
                    onRemove={() => removeFromBlacklist(tweet.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
          
          {blacklist.length > 0 && (
            <CardFooter className="flex justify-between border-t border-border/30 bg-card/50 px-6 py-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <span className="text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-negative">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all tweets from the blacklist. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearBlacklist}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}

interface BlacklistedTweetCardProps {
  tweet: BlacklistedTweet;
  onRemove: () => void;
}

function BlacklistedTweetCard({ tweet, onRemove }: BlacklistedTweetCardProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-negative/10 flex items-center justify-center">
            <span className="text-xs font-medium text-negative">
              {tweet.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">@{tweet.username}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(tweet.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-8 w-8 text-muted-foreground hover:text-negative"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove from blacklist</span>
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-1">{tweet.tweet}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div 
            className={cn(
              "h-2 w-2 rounded-full",
              tweet.score < -0.7 
                ? "bg-negative" 
                : tweet.score < -0.3 
                ? "bg-negative/70" 
                : "bg-negative/40"
            )}
          />
          <span className="text-xs font-medium text-negative">
            {Math.abs(tweet.score) > 0.7 
              ? "Highly Negative" 
              : Math.abs(tweet.score) > 0.3 
              ? "Moderately Negative" 
              : "Slightly Negative"
            }
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Score: {tweet.score.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
