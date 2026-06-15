export const RANKS = [
  { name: "E-Rank",   minWorkouts: 0,   xpPerWorkout: 100, title: "Weakling",         color: "text-gray-400",      glow: "" },
  { name: "D-Rank",   minWorkouts: 5,   xpPerWorkout: 120, title: "Iron Body",         color: "text-green-400",     glow: "drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]" },
  { name: "C-Rank",   minWorkouts: 15,  xpPerWorkout: 150, title: "Gate Challenger",   color: "text-blue-400",      glow: "drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]" },
  { name: "B-Rank",   minWorkouts: 30,  xpPerWorkout: 180, title: "Shadow Soldier",    color: "text-purple-400",    glow: "drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" },
  { name: "A-Rank",   minWorkouts: 50,  xpPerWorkout: 220, title: "Elite Hunter",      color: "text-orange-400",    glow: "drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]" },
  { name: "S-Rank",   minWorkouts: 75,  xpPerWorkout: 280, title: "Monarch's Chosen",  color: "text-red-500",       glow: "drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" },
  { name: "SS-Rank",  minWorkouts: 100, xpPerWorkout: 350, title: "Shadow Commander",  color: "text-yellow-400",    glow: "drop-shadow-[0_0_18px_rgba(250,204,21,1)]" },
  { name: "SSS-Rank", minWorkouts: 150, xpPerWorkout: 500, title: "Shadow Monarch",    color: "text-white",         glow: "drop-shadow-[0_0_25px_rgba(255,255,255,1)]" },
];

export function getRankInfo(workouts: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (workouts >= r.minWorkouts) rank = r;
  }
  return rank;
}

export function getHunterRank(workouts: number) {
  return getRankInfo(workouts).name;
}

export function getRankColor(rank: string) {
  return RANKS.find(r => r.name === rank)?.color ?? "text-primary";
}

export function getHunterTitle(workouts: number) {
  return getRankInfo(workouts).title;
}

export function getRankProgress(workouts: number) {
  const currentRank = getRankInfo(workouts);
  const currentIdx = RANKS.indexOf(currentRank);
  const nextRank = RANKS[currentIdx + 1];
  if (!nextRank) return { pct: 100, current: workouts, next: null, nextName: null };
  const pct = Math.round(((workouts - currentRank.minWorkouts) / (nextRank.minWorkouts - currentRank.minWorkouts)) * 100);
  return {
    pct: Math.min(100, Math.max(0, pct)),
    current: workouts,
    next: nextRank.minWorkouts,
    nextName: nextRank.name,
  };
}

export function calcTotalXp(workouts: number, streakDays: number) {
  return workouts * 100 + streakDays * 25;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function getAchievements(stats: {
  totalWorkouts: number;
  streakDays: number;
  weeklyWorkouts: number;
  weeklyGoal: number;
}): Achievement[] {
  const { totalWorkouts, streakDays, weeklyWorkouts, weeklyGoal } = stats;
  return [
    {
      id: "first_gate",
      title: "First Gate Cleared",
      description: "Complete your first workout",
      unlocked: totalWorkouts >= 1,
    },
    {
      id: "five_gates",
      title: "D-Rank Ascension",
      description: "Complete 5 workouts",
      unlocked: totalWorkouts >= 5,
    },
    {
      id: "iron_will",
      title: "Iron Will",
      description: "Maintain a 7-day streak",
      unlocked: streakDays >= 7,
    },
    {
      id: "ten_gates",
      title: "Gate Breaker",
      description: "Complete 10 workouts",
      unlocked: totalWorkouts >= 10,
    },
    {
      id: "weekly_quest",
      title: "Quest Complete",
      description: "Hit your weekly workout goal",
      unlocked: weeklyWorkouts >= weeklyGoal && weeklyGoal > 0,
    },
    {
      id: "twenty_five_gates",
      title: "Shadow Soldier",
      description: "Complete 25 workouts",
      unlocked: totalWorkouts >= 25,
    },
    {
      id: "dedicated",
      title: "The Grind Never Stops",
      description: "Maintain a 14-day streak",
      unlocked: streakDays >= 14,
    },
    {
      id: "fifty_gates",
      title: "B-Rank Hunter",
      description: "Complete 50 workouts",
      unlocked: totalWorkouts >= 50,
    },
    {
      id: "seventy_five_gates",
      title: "ARISE",
      description: "Reach S-Rank — 75 gates cleared",
      unlocked: totalWorkouts >= 75,
    },
    {
      id: "thirty_streak",
      title: "Unstoppable",
      description: "Maintain a 30-day streak",
      unlocked: streakDays >= 30,
    },
    {
      id: "hundred_gates",
      title: "Shadow Commander",
      description: "Complete 100 workouts",
      unlocked: totalWorkouts >= 100,
    },
    {
      id: "shadow_monarch",
      title: "Shadow Monarch",
      description: "Reach SSS-Rank — 150 gates cleared",
      unlocked: totalWorkouts >= 150,
    },
  ];
}
