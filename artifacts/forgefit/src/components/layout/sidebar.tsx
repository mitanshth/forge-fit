import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { LogOut, LayoutDashboard, Dumbbell, Activity, Utensils, MessageSquare, User, TrendingUp } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const links = [
    { href: "/dashboard", label: "COMMAND CENTER", icon: LayoutDashboard },
    { href: "/workout", label: "GATES", icon: Dumbbell },
    { href: "/home-workout", label: "SHADOW TRAINING", icon: Activity },
    { href: "/nutrition", label: "RATIONS", icon: Utensils },
    { href: "/progress", label: "ASCENSION", icon: TrendingUp },
    { href: "/coach", label: "MONARCH'S VOICE", icon: MessageSquare },
    { href: "/profile", label: "HUNTER PROFILE", icon: User },
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed inset-y-0 left-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
          ForgeFit
        </h1>
        <div className="text-xs text-muted-foreground tracking-widest mt-1">THE SYSTEM</div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const active = location === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all cursor-pointer ${
                active 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
                <Icon className="w-5 h-5" />
                <span className="font-semibold tracking-wider text-sm">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold tracking-wider text-sm">EXIT SYSTEM</span>
        </button>
      </div>
    </div>
  );
}
