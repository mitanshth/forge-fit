import { useState, useEffect, useCallback } from "react";
import { getDailyQuests, getCompletions, completeQuest, getDailyXpEarned } from "@/lib/quests";
import { CheckCircle2, Circle, Zap, Lock } from "lucide-react";

export function DailyQuests() {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const quests = getDailyQuests();

  const refresh = useCallback(() => {
    setCompletions(getCompletions());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("quests_updated", refresh);
    return () => window.removeEventListener("quests_updated", refresh);
  }, [refresh]);

  const handleManualComplete = (id: string) => {
    completeQuest(id);
    setJustCompleted(id);
    setTimeout(() => setJustCompleted(null), 1500);
  };

  const earnedXp = getDailyXpEarned();
  const totalXp = quests.reduce((s, q) => s + q.xp, 0);
  const completedCount = quests.filter(q => completions[q.id]).length;

  return (
    <div className="bg-card/30 border border-primary/20 rounded-lg p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-[0.3em] text-foreground uppercase">Daily Quests</h2>
          <p className="text-xs text-muted-foreground tracking-widest mt-0.5">
            RESETS AT MIDNIGHT · {completedCount}/3 COMPLETE
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-primary/30 rounded bg-primary/10">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-primary font-bold tracking-widest text-xs">
            {earnedXp} / {totalXp} XP
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(completedCount / 3) * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)/0.7), hsl(var(--primary)))",
            boxShadow: "0 0 8px rgba(139,92,246,0.6)",
          }}
        />
      </div>

      {/* Quests */}
      <div className="space-y-2">
        {quests.map(q => {
          const done = !!completions[q.id];
          const popped = justCompleted === q.id;

          return (
            <div
              key={q.id}
              data-testid={`quest-${q.id}`}
              className={`flex items-center gap-3 p-3 rounded border transition-all duration-300 ${
                done
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card/30 border-primary/10 hover:border-primary/20"
              } ${popped ? "scale-[1.02]" : ""}`}
            >
              {/* Status icon */}
              <div className={`shrink-0 ${done ? "text-primary" : "text-muted-foreground/30"}`}>
                {done
                  ? <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                  : q.manual
                  ? <Circle className="w-5 h-5" />
                  : <Lock className="w-5 h-5 w-4 h-4" />
                }
              </div>

              {/* Quest info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold tracking-wider ${done ? "text-foreground" : "text-foreground/70"}`}>
                  {q.title}
                </p>
                <p className="text-xs text-muted-foreground/60 tracking-wide truncate">{q.description}</p>
              </div>

              {/* XP + action */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold tracking-widest ${done ? "text-primary" : "text-muted-foreground/40"}`}>
                  +{q.xp} XP
                </span>
                {!done && q.manual && (
                  <button
                    onClick={() => handleManualComplete(q.id)}
                    className="text-xs text-muted-foreground/50 hover:text-primary border border-primary/20 hover:border-primary/50 rounded px-2 py-0.5 tracking-wider transition-all"
                    data-testid={`button-complete-quest-${q.id}`}
                  >
                    DONE
                  </button>
                )}
                {!done && !q.manual && (
                  <span className="text-xs text-muted-foreground/30 tracking-wider">AUTO</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === 3 && (
        <div className="text-center py-2 border border-primary/30 rounded bg-primary/10">
          <p className="text-primary font-bold tracking-[0.3em] text-xs animate-pulse">
            ALL QUESTS CLEARED — SHADOW MONARCH IS PLEASED
          </p>
        </div>
      )}
    </div>
  );
}
