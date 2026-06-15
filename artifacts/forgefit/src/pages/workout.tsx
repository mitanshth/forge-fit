import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListWorkoutLogs,
  useCreateWorkoutLog,
  useDeleteWorkoutLog,
  getListWorkoutLogsQueryKey,
  getGetDashboardQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle, Zap, X } from "lucide-react";
import { calcTotalXp, getHunterRank } from "@/lib/rank";
import { triggerQuestCompletion } from "@/lib/quests";

const WORKOUT_TYPES = ["Gym", "Cardio", "Home", "Custom"];

interface XpToast {
  xp: number;
  workout: string;
}

export default function Workout() {
  const queryClient = useQueryClient();
  const { data: logs, isLoading } = useListWorkoutLogs();
  const createLog = useCreateWorkoutLog();
  const deleteLog = useDeleteWorkoutLog();

  const [open, setOpen] = useState(false);
  const [xpToast, setXpToast] = useState<XpToast | null>(null);

  const [day, setDay] = useState("");
  const [workoutType, setWorkoutType] = useState("Gym");
  const [exercises, setExercises] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");

  const addExercise = () => setExercises(prev => [...prev, ""]);
  const updateExercise = (i: number, val: string) => setExercises(prev => prev.map((e, idx) => idx === i ? val : e));
  const removeExercise = (i: number) => setExercises(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!day.trim()) return;

    const filled = exercises.filter(ex => ex.trim());
    const xpEarned = 100 + filled.length * 10;

    await createLog.mutateAsync({
      data: {
        day: `${workoutType} — ${day}`,
        exercises: filled,
        completed: true,
        notes: notes.trim() || undefined,
      },
    });

    queryClient.invalidateQueries({ queryKey: getListWorkoutLogsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });

    const typeLower = workoutType.toLowerCase();
    triggerQuestCompletion("workout_logged");
    if (typeLower === "gym") triggerQuestCompletion("gym_logged");
    if (typeLower === "cardio") triggerQuestCompletion("cardio_logged");
    if (typeLower === "home") triggerQuestCompletion("home_logged");
    if (filled.length >= 5) triggerQuestCompletion("five_exercises");
    setXpToast({ xp: xpEarned, workout: `${workoutType} — ${day}` });
    setTimeout(() => setXpToast(null), 3500);

    setOpen(false);
    setDay("");
    setWorkoutType("Gym");
    setExercises([""]);
    setNotes("");
  };

  const handleDelete = async (id: number) => {
    await deleteLog.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListWorkoutLogsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
  };

  return (
    <>
      {/* XP Toast */}
      {xpToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 px-5 py-4 bg-black/90 border border-primary/60 rounded-lg shadow-[0_0_30px_rgba(139,92,246,0.4)]">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            <div>
              <p className="text-primary font-bold tracking-widest text-sm">+{xpToast.xp} XP EARNED</p>
              <p className="text-muted-foreground text-xs tracking-wider">GATE CLEARED: {xpToast.workout}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        </div>
      )}

      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
              Gates
            </h1>
            <p className="text-muted-foreground tracking-widest mt-1">DUNGEON HISTORY & NEW DEPLOYMENTS</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.3)]"
            data-testid="button-enter-gate"
          >
            <Plus className="w-4 h-4 mr-2" /> ENTER GATE
          </Button>
        </header>

        {isLoading ? (
          <div className="text-primary tracking-widest animate-pulse py-12 text-center">SCANNING FOR GATES...</div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-primary/20 rounded-lg bg-card/20">
            <p className="text-muted-foreground tracking-widest mb-6">NO COMPLETED DUNGEONS DETECTED.</p>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="border-primary/50 text-primary tracking-wider hover:bg-primary/10"
            >
              ARISE AND TRAIN
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {logs.map(log => (
              <Card
                key={log.id}
                className="bg-card/40 border-primary/20 hover:border-primary/40 transition-all"
                data-testid={`workout-log-${log.id}`}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <h3 className="font-bold tracking-wider text-foreground">{log.day}</h3>
                      <p className="text-xs text-muted-foreground tracking-wide mt-0.5">
                        {new Date(log.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                        {log.exercises && (log.exercises as string[]).length > 0 &&
                          ` · ${(log.exercises as string[]).length} exercise${(log.exercises as string[]).length !== 1 ? "s" : ""}`
                        }
                      </p>
                      {log.exercises && (log.exercises as string[]).length > 0 && (
                        <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                          {(log.exercises as string[]).slice(0, 3).join(" · ")}
                          {(log.exercises as string[]).length > 3 && ` +${(log.exercises as string[]).length - 3} more`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-primary text-xs font-bold tracking-widest">
                        +{100 + ((log.exercises as string[])?.length ?? 0) * 10} XP
                      </span>
                      <p className="text-xs text-green-400 tracking-wider font-bold">CLEARED</p>
                    </div>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-muted-foreground/30 hover:text-red-400 transition-colors"
                      data-testid={`button-delete-log-${log.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Log Gate Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black/95 border-primary/40 shadow-[0_0_40px_rgba(139,92,246,0.3)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary tracking-widest uppercase font-bold">Enter Gate</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Workout Type */}
            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted-foreground font-bold">GATE TYPE</label>
              <div className="grid grid-cols-4 gap-2">
                {WORKOUT_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setWorkoutType(t)}
                    className={`py-2 text-xs font-bold tracking-wider rounded border transition-all ${
                      workoutType === t
                        ? "bg-primary/30 border-primary text-primary"
                        : "bg-card/30 border-primary/20 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Name */}
            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted-foreground font-bold">SESSION NAME</label>
              <Input
                value={day}
                onChange={e => setDay(e.target.value)}
                placeholder="e.g. Push Day, Leg Day, 5K Run..."
                className="bg-background/60 border-primary/30 font-mono focus-visible:ring-primary/50"
                data-testid="input-session-name"
                required
              />
            </div>

            {/* Exercises */}
            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted-foreground font-bold">
                EXERCISES <span className="text-primary/60">(+10 XP EACH)</span>
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {exercises.map((ex, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={ex}
                      onChange={e => updateExercise(i, e.target.value)}
                      placeholder={`Exercise ${i + 1} (e.g. Bench Press 4×8)`}
                      className="bg-background/60 border-primary/20 font-mono text-sm focus-visible:ring-primary/50"
                      data-testid={`input-exercise-${i}`}
                    />
                    {exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(i)} className="text-muted-foreground/40 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addExercise}
                className="text-xs text-primary/60 hover:text-primary tracking-wider flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> ADD EXERCISE
              </button>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs tracking-widest text-muted-foreground font-bold">NOTES (OPTIONAL)</label>
              <Input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="How was the gate?"
                className="bg-background/60 border-primary/20 font-mono text-sm focus-visible:ring-primary/50"
                data-testid="input-notes"
              />
            </div>

            {/* XP Preview */}
            <div className="flex items-center justify-between text-sm border border-primary/20 rounded px-4 py-3 bg-primary/5">
              <span className="text-muted-foreground tracking-wider">XP FOR THIS GATE</span>
              <span className="text-primary font-bold tracking-widest">
                +{100 + exercises.filter(e => e.trim()).length * 10} XP
              </span>
            </div>

            <Button
              type="submit"
              disabled={createLog.isPending || !day.trim()}
              className="w-full bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-widest h-12 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              data-testid="button-submit-gate"
            >
              {createLog.isPending ? "CLEARING GATE..." : "GATE CLEARED"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
