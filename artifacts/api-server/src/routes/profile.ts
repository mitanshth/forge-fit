import { Router } from "express";
import { db } from "@workspace/db";
import { userProfiles } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpsertProfileBody } from "@workspace/api-zod";

const router = Router();

router.get("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
  if (profiles.length === 0) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(profiles[0]);
});

router.put("/profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = UpsertProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const userId = req.user.id;
  const data = parsed.data;
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
  if (existing.length === 0) {
    const [created] = await db.insert(userProfiles).values({
      userId,
      ...data,
      updatedAt: new Date(),
    }).returning();
    res.json(created);
  } else {
    const [updated] = await db.update(userProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    res.json(updated);
  }
});

export default router;
