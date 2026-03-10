import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGateProps {
  children: React.ReactNode;
  returnTo: string;
  warningMessage?: string;
}

/**
 * Wraps pages that require authentication.
 * Shows a spinner while loading, redirects to /auth with a warning if not logged in.
 */
export function AuthGate({ children, returnTo, warningMessage }: AuthGateProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', {
        replace: true,
        state: {
          returnTo,
          warning: warningMessage || "Bu sahifa avtomaktab o'quvchilari uchun. Iltimos, avval tizimga kiring.",
        },
      });
    }
  }, [user, isLoading, navigate, returnTo, warningMessage]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
