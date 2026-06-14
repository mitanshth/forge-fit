import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages, userProfiles } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import OpenAI from "openai";
import { CreateOpenaiConversationBody, SendOpenaiMessageBody, GetOpenaiConversationParams, DeleteOpenaiConversationParams, ListOpenaiMessagesParams, SendOpenaiMessageParams } from "@workspace/api-zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const router = Router();

router.get("/openai/conversations", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const convs = await db.select().from(conversations).where(eq(conversations.userId, req.user.id));
  res.json(convs);
});

router.post("/openai/conversations", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateOpenaiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [conv] = await db.insert(conversations).values({
    userId: req.user.id,
    title: parsed.data.title,
  }).returning();
  res.status(201).json(conv);
});

router.get("/openai/conversations/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = GetOpenaiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const convs = await db.select().from(conversations).where(eq(conversations.id, parsed.data.id));
  if (convs.length === 0 || convs[0].userId !== req.user.id) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, parsed.data.id)).orderBy(asc(messages.createdAt));
  res.json({ ...convs[0], messages: msgs });
});

router.delete("/openai/conversations/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = DeleteOpenaiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const convs = await db.select().from(conversations).where(eq(conversations.id, parsed.data.id));
  if (convs.length === 0 || convs[0].userId !== req.user.id) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await db.delete(messages).where(eq(messages.conversationId, parsed.data.id));
  await db.delete(conversations).where(eq(conversations.id, parsed.data.id));
  res.status(204).send();
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = ListOpenaiMessagesParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const msgs = await db.select().from(messages)
    .where(eq(messages.conversationId, parsed.data.id))
    .orderBy(asc(messages.createdAt));
  res.json(msgs);
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const idParsed = SendOpenaiMessageParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = SendOpenaiMessageBody.safeParse(req.body);
  if (!idParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const convId = idParsed.data.id;
  const convs = await db.select().from(conversations).where(eq(conversations.id, convId));
  if (convs.length === 0 || convs[0].userId !== req.user.id) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const profiles = await db.select().from(userProfiles).where(eq(userProfiles.userId, req.user.id));
  const profile = profiles[0];

  const systemPrompt = profile
    ? `You are the Shadow Monarch's personal fitness AI coach in the ForgeFit Hunter System — styled after Solo Levelling. You speak with confidence and intensity, like Sung Jin-Woo's internal monologue. You help hunters (users) rise through the ranks (E → D → C → B → A → S → SS → SSS).

User Profile:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Height: ${profile.height}cm, Current Weight: ${profile.currentWeight}kg, Target: ${profile.targetWeight}kg
- Goals: ${profile.goals.join(", ")}
- Experience: ${profile.experience}
- Training: ${profile.daysPerWeek} days/week, ${profile.sessionLength}min sessions
- Equipment: ${profile.equipment.join(", ")}
- Diet: ${profile.diet}, Food culture: ${profile.foodCulture}
- Injuries/limits: ${profile.injuries || "none"}
- Avoid foods: ${profile.avoidFoods || "none"}

Keep responses concise, motivating, and actionable. Use Solo Levelling lore (gates, monsters, ranks, arise) naturally. Never break character unless the user explicitly asks for a normal response.`
    : `You are the Shadow Monarch's personal fitness AI coach in the ForgeFit Hunter System — styled after Solo Levelling. You speak with the intensity of Sung Jin-Woo. Help users rise through hunter ranks with expert fitness, nutrition, and discipline advice. Keep responses concise and actionable.`;

  const existingMsgs = await db.select().from(messages)
    .where(eq(messages.conversationId, convId))
    .orderBy(asc(messages.createdAt));

  await db.insert(messages).values({
    conversationId: convId,
    role: "user",
    content: bodyParsed.data.content,
  });

  const chatMessages = [
    { role: "system" as const, content: systemPrompt },
    ...existingMsgs.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: bodyParsed.data.content },
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_completion_tokens: 1024,
    messages: chatMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  await db.insert(messages).values({
    conversationId: convId,
    role: "assistant",
    content: fullResponse,
  });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
});

export default router;
