import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Login() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-xl tracking-widest animate-pulse">CONNECTING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg shadow-[0_0_50px_rgba(139,92,246,0.15)] text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-widest text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] uppercase">
            System
          </h1>
          <h2 className="text-2xl font-bold tracking-widest text-foreground mt-2 uppercase">
            Awakening
          </h2>
          <p className="mt-4 text-muted-foreground tracking-widest">
            A NEW GATE HAS OPENED. DO YOU WISH TO ENTER?
          </p>
        </div>

        <button
          onClick={login}
          className="w-full py-4 px-6 bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-[0.2em] rounded transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
        >
          ACCEPT QUEST
        </button>
      </div>
    </div>
  );
}
