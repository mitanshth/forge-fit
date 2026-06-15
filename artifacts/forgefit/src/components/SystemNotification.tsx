import { useEffect, useState } from "react";
import { getRankColor, RANKS } from "@/lib/rank";

interface Props {
  rank: string;
  title: string;
  xp: number;
  onDismiss: () => void;
}

export function SystemNotification({ rank, title, xp, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const rankInfo = RANKS.find(r => r.name === rank);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 600);
    }, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => { setVisible(false); setTimeout(onDismiss, 600); }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Notification box */}
      <div
        className={`relative z-10 border-2 bg-black/90 rounded-lg p-10 text-center max-w-lg w-full mx-4 transition-all duration-700 ${
          visible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
        style={{ borderColor: "hsl(var(--primary) / 0.8)", boxShadow: "0 0 60px rgba(139,92,246,0.4), inset 0 0 60px rgba(139,92,246,0.05)" }}
      >
        {/* Scan line animation */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="w-full h-px bg-primary/40 animate-[scan_2s_linear_infinite]" />
        </div>

        <p className="text-primary text-xs tracking-[0.4em] font-bold mb-6 animate-pulse">
          ══ SYSTEM NOTIFICATION ══
        </p>

        <p className="text-muted-foreground tracking-[0.3em] text-sm mb-4">
          RANK ADVANCEMENT CONFIRMED
        </p>

        <h2 className={`text-6xl font-black tracking-widest mb-2 ${getRankColor(rank)} ${rankInfo?.glow ?? ""}`}>
          {rank.replace("-Rank", "")}
        </h2>
        <p className={`text-xl font-bold tracking-widest mb-6 ${getRankColor(rank)}`}>
          {rank}
        </p>

        <div className="border-t border-primary/20 pt-6 mt-2 space-y-2">
          <p className="text-foreground font-bold tracking-widest text-lg">
            [{title}]
          </p>
          <p className="text-muted-foreground text-sm tracking-widest">
            TITLE UNLOCKED
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-primary/30 rounded bg-primary/10">
          <span className="text-primary font-bold tracking-widest text-sm">TOTAL XP: {xp.toLocaleString()}</span>
        </div>

        <p className="text-muted-foreground/50 text-xs tracking-widest mt-8">
          TAP ANYWHERE TO CONTINUE
        </p>
      </div>
    </div>
  );
}
