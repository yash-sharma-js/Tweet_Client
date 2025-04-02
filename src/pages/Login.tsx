
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Key, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };
  
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      backTo={{ path: "/register", label: "Don't have an account? Sign up" }}
    >
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="pl-10"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="pl-10"
              />
              <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm flex items-center text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Sign In
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
