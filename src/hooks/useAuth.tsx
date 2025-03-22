
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (email === "demo@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          username: "demo_user",
          email: "demo@example.com"
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration
      const mockUser = {
        id: "2",
        username,
        email
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Google login function
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Google authentication
      const mockUser = {
        id: "3",
        username: "google_user",
        email: "google@example.com"
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Google login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        googleLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
