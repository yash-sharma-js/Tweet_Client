
import { useState } from "react";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true); // Always dark mode for this app
  
  // Toggle function for future light mode support
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Get first letter of username for avatar
  const getInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  // Get display name
  const getDisplayName = () => {
    return user?.username || user?.email?.split('@')[0] || 'User';
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-content-width flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Tweet Sentiment</h3>
                <SheetClose className="rounded-full p-1 hover:bg-accent">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>
              
              <div className="grid gap-2">
                <h4 className="text-sm font-medium text-muted-foreground">Account</h4>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                    <div className="rounded-full bg-primary/10 p-1">
                      <span className="text-xs font-medium text-primary">{getInitial()}</span>
                    </div>
                    <div className="text-sm font-medium">{getDisplayName()}</div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" className="flex justify-start pl-2 text-sm text-muted-foreground hover:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll be redirected to the login page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Tweet</span>Sentiment
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* User menu - desktop */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {getInitial()}
                </span>
              </div>
              <span className="hidden text-sm font-medium md:inline-block">
                {getDisplayName()}
              </span>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You'll be redirected to the login page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>
  );
}
