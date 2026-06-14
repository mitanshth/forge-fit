import { useGetDashboard } from "@workspace/api-client-react";
import { getHunterRank, getRankColor } from "@/lib/rank";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Activity, Target } from "lucide-react";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetDashboard();

  if (isLoading) {
    return <div className="text-primary text-xl tracking-widest animate-pulse flex h-full items-center justify-center">GATHERING SYSTEM DATA...</div>;
  }

  const stats = dashboard || {
    weeklyWorkouts: 0,
    weeklyGoal: 3,
    streakDays: 0,
    disciplineScore: 0,
    totalWorkouts: 0,
    latestWeight: null,
    targetWeight: null,
  };

  const rank = getHunterRank(stats.totalWorkouts);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Command Center
        </h1>
        <p className="text-muted-foreground tracking-widest mt-2">
          STATUS REPORT. CURRENT RANK: <span className={getRankColor(rank)}>{rank}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-primary/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">TOTAL CLEARS</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider">{rank}</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">CURRENT STREAK</CardTitle>
            <Flame className="h-4 w-4 text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{stats.streakDays} DAYS</div>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider">KEEP THE FIRE ALIVE</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">WEEKLY QUEST</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{stats.weeklyWorkouts} / {stats.weeklyGoal}</div>
            <div className="w-full bg-secondary h-2 mt-3 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" 
                style={{ width: `${Math.min(100, (stats.weeklyWorkouts / stats.weeklyGoal) * 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/30 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">DISCIPLINE SCORE</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{stats.disciplineScore}</div>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider">SYSTEM EVALUATION</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 bg-card/30 border border-primary/20 rounded-lg p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4 tracking-widest uppercase">The System Awaits</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          A new gate has been detected nearby. Prepare yourself, Hunter. The Shadow Monarch demands strength.
        </p>
      </div>
    </div>
  );
}
