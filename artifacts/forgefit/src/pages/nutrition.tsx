import { useState, useEffect } from "react";
import { triggerQuestCompletion } from "@/lib/quests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MealLog = {
  id: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
};

export default function Nutrition() {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  
  useEffect(() => {
    const saved = localStorage.getItem("forgefit_nutrition");
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  }, []);

  const handleAdd = () => {
    if (!meal || !calories) return;
    const newLog: MealLog = {
      id: Math.random().toString(36).substring(7),
      meal,
      calories: parseInt(calories) || 0,
      protein: 0, carbs: 0, fat: 0,
      date: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("forgefit_nutrition", JSON.stringify(updated));
    triggerQuestCompletion("meal_logged");
    setMeal("");
    setCalories("");
  };

  const todayLogs = logs.filter(l => new Date(l.date).toDateString() === new Date().toDateString());
  const totalCalories = todayLogs.reduce((acc, l) => acc + l.calories, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Rations
        </h1>
        <p className="text-muted-foreground tracking-widest mt-2">
          FUEL FOR THE HUNTER
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase">Daily Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-black tracking-tighter text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              {totalCalories}
            </div>
            <div className="text-sm font-bold tracking-widest text-muted-foreground mt-2">KCAL CONSUMED</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card/40 border-primary/20">
          <CardHeader>
            <CardTitle className="tracking-widest uppercase">Log Ration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Item Name</label>
                <Input value={meal} onChange={e => setMeal(e.target.value)} placeholder="e.g. Magic Beast Meat" className="bg-background/50 border-primary/30 focus-visible:ring-primary/50" />
              </div>
              <div className="w-32 space-y-2">
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Calories</label>
                <Input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="0" className="bg-background/50 border-primary/30 focus-visible:ring-primary/50" />
              </div>
              <Button onClick={handleAdd} className="bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-wider">
                CONSUME
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase border-b border-primary/20 pb-2">Today's Logs</h3>
              {todayLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground font-mono">No rations consumed today.</p>
              ) : (
                todayLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-3 bg-background/30 rounded border border-primary/10">
                    <span className="font-bold tracking-wider">{log.meal}</span>
                    <span className="text-primary font-mono">{log.calories} kcal</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
