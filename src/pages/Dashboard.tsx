
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { TweetAnalyzer } from "@/components/TweetAnalyzer";
import { BlacklistSection } from "@/components/BlacklistSection";
import { Profile } from "@/components/Profile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      const displayName = user?.username || user?.email?.split('@')[0] || 'User';
      toast.success(`Welcome back, ${displayName}!`);
    }
  }, [user]);
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4 mx-auto space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, <span className="text-primary">{user?.username || user?.email?.split('@')[0] || 'User'}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Analyze tweet sentiment and manage your blacklisted content
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full lg:col-span-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <TweetAnalyzer />
            </div>
            
            <div className="col-span-full lg:col-span-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="space-y-6">
                <Profile />
                <BlacklistSection />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
