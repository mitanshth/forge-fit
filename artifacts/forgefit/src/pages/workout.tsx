import { useListWorkoutLogs } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Workout() {
  const { data: logs, isLoading } = useListWorkoutLogs();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
            Gates
          </h1>
          <p className="text-muted-foreground tracking-widest mt-2">
            DUNGEON HISTORY & NEW DEPLOYMENTS
          </p>
        </div>
        <Button className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.3)]">
          <Plus className="w-4 h-4 mr-2" /> ENTER GATE
        </Button>
      </header>

      {isLoading ? (
        <div className="text-primary tracking-widest animate-pulse py-12 text-center">SCANNING FOR GATES...</div>
      ) : !logs || logs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-primary/20 rounded-lg bg-card/20">
          <p className="text-muted-foreground tracking-widest mb-4">NO COMPLETED DUNGEONS DETECTED.</p>
          <Button variant="outline" className="border-primary/50 text-primary tracking-wider">
            ARISE AND TRAIN
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {logs.map(log => (
            <Card key={log.id} className="bg-card/40 border-primary/20 hover:border-primary/50 transition-all cursor-default">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg tracking-wider text-foreground">{log.day}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(log.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold tracking-wider rounded border border-primary/30">
                    {log.completed ? 'CLEARED' : 'FAILED'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
