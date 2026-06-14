import { Router } from "express";
import { db } from "@workspace/db";
import { workoutLogs, weightLogs, userProfiles } from "@workspace/db";
import { eq, gte, desc } from "drizzle-orm";

const router = Router();

router.get("/dashboard", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [allLogs, weeklyLogs, latestWeights, profiles] = await Promise.all([
    db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)),
    db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).then(logs =>
      logs.filter(l => new Date(l.date) >= weekAgo && l.completed)
    ),
    db.select().from(weightLogs).where(eq(weightLogs.userId, userId)).orderBy(desc(weightLogs.date)).limit(1),
    db.select().from(userProfiles).where(eq(userProfiles.userId, userId)),
  ]);

  const profile = profiles[0];
  const weeklyGoal = profile?.daysPerWeek ?? 4;

  const totalWorkouts = allLogs.filter(l => l.completed).length;
  const weeklyWorkouts = weeklyLogs.length;
  const disciplineScore = totalWorkouts > 0
    ? Math.min(100, Math.round((weeklyWorkouts / weeklyGoal) * 100))
    : 0;

  let streakDays = 0;
  const sortedLogs = allLogs
    .filter(l => l.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedLogs.length > 0) {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const diff = Math.round((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 1) {
        streakDays++;
        currentDate = logDate;
      } else {
        break;
      }
    }
  }

  res.json({
    weeklyWorkouts,
    weeklyGoal,
    streakDays,
    disciplineScore,
    totalWorkouts,
    latestWeight: latestWeights[0]?.weight ?? null,
    targetWeight: profile?.targetWeight ?? null,
  });
});

export default router;
