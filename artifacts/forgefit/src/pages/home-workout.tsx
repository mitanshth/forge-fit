import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TEMPLATES = [
  {
    level: "Beginner",
    title: "Awakening Protocol",
    description: "For newly awakened E-Rank Hunters. Build the foundation.",
    color: "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    glow: "group-hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]",
    exercises: [
      "Bodyweight Squats 3×15",
      "Push-ups 3×10",
      "Glute Bridges 3×15",
      "Plank 3×30s",
      "Mountain Climbers 3×20"
    ]
  },
  {
    level: "Intermediate",
    title: "Gate Breaker",
    description: "C-Rank level intensity. Break through your limits.",
    color: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    glow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    exercises: [
      "Jump Squats 4×12",
      "Diamond Push-ups 4×10",
      "Bulgarian Split Squats 3×12/leg",
      "Pike Push-ups 3×12",
      "Burpees 3×10",
      "Side Plank 3×30s"
    ]
  },
  {
    level: "Advanced",
    title: "Shadow Monarch Protocol",
    description: "S-Rank training. Only the strongest survive.",
    color: "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
    glow: "group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]",
    exercises: [
      "Pistol Squats 4×8/leg",
      "Clapping Push-ups 4×12",
      "Single-leg Romanian DL 4×10/leg",
      "Handstand Push-up Negatives 3×6",
      "Plyometric Lunges 4×12",
      "Dragon Flag 3×5"
    ]
  }
];

export default function HomeWorkout() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Shadow Training
        </h1>
        <p className="text-muted-foreground tracking-widest mt-2">
          SOLO LEVELING DAILY QUESTS
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(template => (
          <Card key={template.level} className={`bg-card/40 backdrop-blur group transition-all duration-300 ${template.color} ${template.glow} overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none z-0" />
            <CardHeader className="relative z-10">
              <div className="text-xs font-bold tracking-widest text-muted-foreground mb-1 uppercase">{template.level}</div>
              <CardTitle className="text-xl font-bold tracking-widest uppercase">{template.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
            </CardHeader>
            <CardContent className="relative z-10 mt-4">
              <ul className="space-y-2 mb-6">
                {template.exercises.map((ex, i) => (
                  <li key={i} className="text-sm font-mono text-foreground/80 flex items-start before:content-['>'] before:mr-2 before:text-primary before:font-bold">
                    {ex}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-wider">
                INITIATE PROTOCOL
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
