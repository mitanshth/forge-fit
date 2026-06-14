import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useListWeightLogs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHunterRank, getRankColor } from "@/lib/rank";

export default function Progress() {
  const { data: weightLogs, isLoading } = useListWeightLogs();
  
  // Fake rank progress for UI demo
  const currentWorkouts = 42; 
  const rank = getHunterRank(currentWorkouts);

  const chartData = weightLogs?.map(log => ({
    date: new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: log.weight
  })).reverse() || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Ascension
        </h1>
        <p className="text-muted-foreground tracking-widest mt-2">
          HUNTER METRICS & RANK PROGRESSION
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase">Current Rank</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className={`text-7xl font-black ${getRankColor(rank)}`}>
              {rank.split('-')[0]}
            </div>
            <div className="text-xl tracking-widest font-bold text-muted-foreground mt-2">RANK</div>
            
            <div className="w-full max-w-md mt-12 space-y-2">
              <div className="flex justify-between text-xs font-bold tracking-widest text-muted-foreground">
                <span>{currentWorkouts} CLEARS</span>
                <span>NEXT: 50 CLEARS</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-primary/20">
                <div className="bg-primary h-full shadow-[0_0_10px_rgba(139,92,246,0.8)] transition-all duration-1000" style={{ width: '84%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase">Mass Evaluation (Weight)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center text-primary animate-pulse tracking-widest">
                CALIBRATING...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickMargin={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickMargin={10} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--primary) / 0.3)', color: 'white' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6, fill: 'white' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono">
                NO DATA LOGGED YET
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
