
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backTo?: {
    path: string;
    label: string;
  };
}

export function AuthLayout({ children, title, subtitle, backTo }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="animate-in w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex flex-col p-6 sm:p-8">
          <div className="mb-8 flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          
          {children}
          
          {backTo && (
            <div className="mt-6 text-center text-sm">
              <Link 
                to={backTo.path} 
                className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backTo.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
