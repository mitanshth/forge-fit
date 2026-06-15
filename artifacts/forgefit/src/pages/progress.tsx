import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useListWeightLogs, useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHunterRank, getHunterTitle, getRankColor, getRankProgress, calcTotalXp, getAchievements, RANKS } from "@/lib/rank";
import { Lock, Trophy } from "lucide-react";

export default function Progress() {
  const { data: weightLogs, isLoading: weightLoading } = useListWeightLogs();
  const { data: dashboard, isLoading: dashLoading } = useGetDashboard();

  const totalWorkouts = dashboard?.totalWorkouts ?? 0;
  const streakDays = dashboard?.streakDays ?? 0;
  const weeklyWorkouts = dashboard?.weeklyWorkouts ?? 0;
  const weeklyGoal = dashboard?.weeklyGoal ?? 4;

  const rank = getHunterRank(totalWorkouts);
  const title = getHunterTitle(totalWorkouts);
  const rankColor = getRankColor(rank);
  const progress = getRankProgress(totalWorkouts);
  const totalXp = calcTotalXp(totalWorkouts, streakDays);
  const achievements = getAchievements({ totalWorkouts, streakDays, weeklyWorkouts, weeklyGoal });
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const chartData = weightLogs?.map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: log.weight,
  })).reverse() ?? [];

  if (dashLoading) {
    return <div className="text-primary text-xl tracking-widest animate-pulse flex h-full items-center justify-center">LOADING HUNTER DATA...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Ascension
        </h1>
        <p className="text-muted-foreground tracking-widest mt-1">
          HUNTER METRICS — [{title}] — {totalXp.toLocaleString()} XP
        </p>
      </header>

      {/* Rank + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase text-sm">Rank Progression</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 gap-6">
            <div className="text-center">
              <div className={`text-8xl font-black ${rankColor}`}>
                {rank.replace("-Rank", "")}
              </div>
              <div className="text-lg tracking-widest font-bold text-muted-foreground mt-1">RANK</div>
              <div className={`text-sm tracking-widest font-bold mt-2 ${rankColor}`}>[{title}]</div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs tracking-widest text-muted-foreground font-bold">
                <span>{totalWorkouts} CLEARS</span>
                {progress.nextName
                  ? <span>NEXT: {progress.next} → <span className={getRankColor(progress.nextName)}>{progress.nextName}</span></span>
                  : <span className="text-white">MAX RANK</span>
                }
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-primary/10">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${progress.pct}%`,
                    background: "linear-gradient(90deg, hsl(var(--primary)/0.7), hsl(var(--primary)))",
                    boxShadow: "0 0 12px rgba(139,92,246,0.7)",
                  }}
                />
              </div>
            </div>

            {/* All ranks ladder */}
            <div className="w-full grid grid-cols-4 gap-2 mt-2">
              {RANKS.map(r => {
                const isActive = r.name === rank;
                const isPassed = totalWorkouts >= r.minWorkouts;
                return (
                  <div
                    key={r.name}
                    className={`text-center py-2 rounded border text-xs font-bold tracking-wider transition-all ${
                      isActive
                        ? "border-primary bg-primary/20 " + r.color
                        : isPassed
                        ? "border-primary/20 bg-primary/5 " + r.color + " opacity-70"
                        : "border-primary/10 bg-card/20 text-muted-foreground/30"
                    }`}
                  >
                    {r.name.replace("-Rank", "")}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        <Card className="bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase text-sm">Mass Evaluation</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] w-full">
            {weightLoading ? (
              <div className="w-full h-full flex items-center justify-center text-primary animate-pulse tracking-widest">CALIBRATING...</div>
            ) : chartData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground font-mono opacity-50">
                <p className="tracking-widest">NO WEIGHT DATA LOGGED</p>
                <p className="text-xs">Log your weight in the Progress tab</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.08)" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={8} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.3)", color: "white", fontFamily: "monospace" }}
                    itemStyle={{ color: "hsl(var(--primary))" }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6, fill: "white" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-widest uppercase text-foreground">
            Shadow Titles
          </h2>
          <span className="text-sm text-muted-foreground tracking-wider">
            <span className="text-primary font-bold">{unlockedCount}</span> / {achievements.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(a => (
            <div
              key={a.id}
              data-testid={`achievement-${a.id}`}
              className={`relative p-4 rounded-lg border transition-all ${
                a.unlocked
                  ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "bg-card/20 border-primary/10 opacity-40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${a.unlocked ? "text-primary" : "text-muted-foreground/30"}`}>
                  {a.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <p className={`font-bold tracking-wider text-sm ${a.unlocked ? "text-foreground" : "text-muted-foreground/40"}`}>
                    {a.title}
                  </p>
                  <p className="text-xs text-muted-foreground/60 tracking-wide mt-0.5">{a.description}</p>
                </div>
              </div>
              {a.unlocked && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
