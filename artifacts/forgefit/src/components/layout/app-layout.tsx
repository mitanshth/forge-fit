import { Sidebar } from "./sidebar";
import { ReactNode, useEffect } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  // Ensure dark mode is active
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
