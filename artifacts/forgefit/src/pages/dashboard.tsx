import { useState, useEffect, useCallback } from "react";
import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getHunterRank, getHunterTitle, getRankColor, getRankProgress, calcTotalXp, RANKS } from "@/lib/rank";
import { SystemNotification } from "@/components/SystemNotification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Activity, Target, Zap } from "lucide-react";

const RANK_KEY = "forgefit_last_rank";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetDashboard();
  const [rankUp, setRankUp] = useState<{ rank: string; title: string; xp: number } | null>(null);

  useEffect(() => {
    if (!dashboard) return;
    const currentRank = getHunterRank(dashboard.totalWorkouts);
    const stored = localStorage.getItem(RANK_KEY);
    if (!stored) {
      localStorage.setItem(RANK_KEY, currentRank);
      return;
    }
    const storedIdx = RANKS.findIndex(r => r.name === stored);
    const currentIdx = RANKS.findIndex(r => r.name === currentRank);
    if (currentIdx > storedIdx) {
      const xp = calcTotalXp(dashboard.totalWorkouts, dashboard.streakDays);
      setRankUp({ rank: currentRank, title: getHunterTitle(dashboard.totalWorkouts), xp });
      localStorage.setItem(RANK_KEY, currentRank);
    }
  }, [dashboard]);

  const dismissRankUp = useCallback(() => setRankUp(null), []);

  if (isLoading) {
    return (
      <div className="text-primary text-xl tracking-widest animate-pulse flex h-full items-center justify-center">
        GATHERING SYSTEM DATA...
      </div>
    );
  }

  const stats = dashboard ?? {
    weeklyWorkouts: 0, weeklyGoal: 3, streakDays: 0,
    disciplineScore: 0, totalWorkouts: 0, latestWeight: null, targetWeight: null,
  };

  const rank = getHunterRank(stats.totalWorkouts);
  const title = getHunterTitle(stats.totalWorkouts);
  const rankColor = getRankColor(rank);
  const progress = getRankProgress(stats.totalWorkouts);
  const totalXp = calcTotalXp(stats.totalWorkouts, stats.streakDays);
  const rankInfo = RANKS.find(r => r.name === rank);

  return (
    <>
      {rankUp && (
        <SystemNotification
          rank={rankUp.rank}
          title={rankUp.title}
          xp={rankUp.xp}
          onDismiss={dismissRankUp}
        />
      )}

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
              Command Center
            </h1>
            <p className="text-muted-foreground tracking-widest mt-1">
              CURRENT RANK:{" "}
              <span className={`font-bold ${rankColor}`}>{rank}</span>
              {" "}—{" "}
              <span className="text-foreground/60">[{title}]</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-primary/30 rounded bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-primary font-bold tracking-widest text-sm">{totalXp.toLocaleString()} XP</span>
          </div>
        </header>

        {/* Rank Progress Bar */}
        <div className="bg-card/40 border border-primary/20 rounded-lg p-5 space-y-3">
          <div className="flex justify-between items-center text-xs tracking-widest font-bold text-muted-foreground">
            <span className={rankColor}>{rank}</span>
            {progress.nextName
              ? <span>{stats.totalWorkouts} / {progress.next} GATES → <span className={getRankColor(progress.nextName)}>{progress.nextName}</span></span>
              : <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">MAXIMUM RANK ACHIEVED</span>
            }
          </div>
          <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-primary/10">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress.pct}%`,
                background: `linear-gradient(90deg, hsl(var(--primary) / 0.8), hsl(var(--primary)))`,
                boxShadow: "0 0 12px rgba(139,92,246,0.7)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground/60 tracking-wider text-right">{progress.pct}% TO NEXT RANK</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="bg-card/50 border-primary/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wider">TOTAL CLEARS</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalWorkouts}</div>
              <p className={`text-xs mt-1 tracking-wider font-bold ${rankColor}`}>{rank}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wider">STREAK</CardTitle>
              <Flame className="h-4 w-4 text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.streakDays} <span className="text-lg">DAYS</span></div>
              <p className="text-xs text-muted-foreground mt-1 tracking-wider">+25 XP / DAY</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wider">WEEKLY QUEST</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.weeklyWorkouts} <span className="text-lg text-muted-foreground">/ {stats.weeklyGoal}</span></div>
              <div className="w-full bg-secondary h-2 mt-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${Math.min(100, (stats.weeklyWorkouts / Math.max(1, stats.weeklyGoal)) * 100)}%`, boxShadow: "0 0 6px rgba(59,130,246,0.8)" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground tracking-wider">DISCIPLINE</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.disciplineScore}</div>
              <p className="text-xs text-muted-foreground mt-1 tracking-wider">SYSTEM EVALUATION</p>
            </CardContent>
          </Card>
        </div>

        {/* Shadow Army Banner */}
        <div className="bg-card/20 border border-primary/20 rounded-lg p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none" />
          <p className="text-muted-foreground/50 text-xs tracking-[0.4em] mb-3">THE SYSTEM SPEAKS</p>
          <p className="text-foreground/80 tracking-widest font-bold">
            {stats.totalWorkouts === 0
              ? "A new hunter has awakened. The gate demands entry."
              : stats.streakDays >= 7
              ? `${stats.streakDays} days without rest. The shadows grow stronger.`
              : stats.totalWorkouts < 5
              ? "The weak are culled. Rise, or be forgotten."
              : `[${title}] — the Shadow Monarch has taken notice.`
            }
          </p>
        </div>
      </div>
    </>
  );
}
