import { Router } from "express";
import { db } from "@workspace/db";
import { weightLogs } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateWeightLogBody } from "@workspace/api-zod";

const router = Router();

router.get("/weight-logs", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const logs = await db.select().from(weightLogs)
    .where(eq(weightLogs.userId, req.user.id))
    .orderBy(desc(weightLogs.date));
  res.json(logs);
});

router.post("/weight-logs", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateWeightLogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [log] = await db.insert(weightLogs).values({
    userId: req.user.id,
    weight: parsed.data.weight,
    date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
  }).returning();
  res.status(201).json(log);
});

export default router;
