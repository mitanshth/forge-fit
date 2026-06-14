export function getHunterRank(workouts: number) {
  if (workouts < 5) return "E-Rank";
  if (workouts < 15) return "D-Rank";
  if (workouts < 30) return "C-Rank";
  if (workouts < 50) return "B-Rank";
  if (workouts < 75) return "A-Rank";
  if (workouts < 100) return "S-Rank";
  if (workouts < 150) return "SS-Rank";
  return "SSS-Rank";
}

export function getRankColor(rank: string) {
  switch (rank) {
    case "E-Rank": return "text-gray-400";
    case "D-Rank": return "text-green-400";
    case "C-Rank": return "text-blue-400";
    case "B-Rank": return "text-purple-400";
    case "A-Rank": return "text-orange-400";
    case "S-Rank": return "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    case "SS-Rank": return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] font-bold";
    case "SSS-Rank": return "text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] font-black tracking-widest";
    default: return "text-primary";
  }
}
