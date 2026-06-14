import { Router } from "express";
import { db } from "@workspace/db";
import { workoutLogs } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateWorkoutLogBody, DeleteWorkoutLogParams } from "@workspace/api-zod";

const router = Router();

router.get("/logs", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const logs = await db.select().from(workoutLogs)
    .where(eq(workoutLogs.userId, req.user.id))
    .orderBy(desc(workoutLogs.date));
  res.json(logs);
});

router.post("/logs", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateWorkoutLogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [log] = await db.insert(workoutLogs).values({
    userId: req.user.id,
    ...parsed.data,
    date: new Date(),
  }).returning();
  res.status(201).json(log);
});

router.delete("/logs/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = DeleteWorkoutLogParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(workoutLogs).where(
    and(eq(workoutLogs.id, parsed.data.id), eq(workoutLogs.userId, req.user.id))
  );
  res.status(204).send();
});

export default router;
