
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Key, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, googleLogin, isLoading } = useAuth();
  
  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(username, email, password);
    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
    }
  };
  
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your details to get started"
      backTo={{ path: "/login", label: "Already have an account? Sign in" }}
    >
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                className="pl-10"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
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
          
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            Create Account
          </Button>
        </form>
        
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative bg-card px-4 text-xs uppercase text-muted-foreground">
            Or continue with
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path d="m15 9-6 6"></path>
            <path d="m9 9 6 6"></path>
          </svg>
          Sign up with Google
        </Button>
      </div>
    </AuthLayout>
  );
}
