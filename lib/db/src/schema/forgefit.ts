import { pgTable, serial, text, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  name: text("name").notNull().default(""),
  age: integer("age").notNull().default(25),
  gender: text("gender").notNull().default("male"),
  height: real("height").notNull().default(170),
  currentWeight: real("current_weight").notNull().default(75),
  targetWeight: real("target_weight").notNull().default(70),
  goals: jsonb("goals").$type<string[]>().notNull().default(["fat-loss"]),
  experience: text("experience").notNull().default("beginner"),
  daysPerWeek: integer("days_per_week").notNull().default(4),
  sessionLength: integer("session_length").notNull().default(45),
  equipment: jsonb("equipment").$type<string[]>().notNull().default(["bodyweight"]),
  diet: text("diet").notNull().default("balanced"),
  foodCulture: text("food_culture").notNull().default("indian"),
  activityLevel: text("activity_level").notNull().default("moderate"),
  injuries: text("injuries").notNull().default(""),
  avoidFoods: text("avoid_foods").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workoutLogs = pgTable("workout_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  day: text("day").notNull(),
  exercises: jsonb("exercises").$type<string[]>().notNull().default([]),
  completed: boolean("completed").notNull().default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const weightLogs = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  weight: real("weight").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, updatedAt: true });
export const insertWorkoutLogSchema = createInsertSchema(workoutLogs).omit({ id: true, createdAt: true });
export const insertWeightLogSchema = createInsertSchema(weightLogs).omit({ id: true, createdAt: true });

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type InsertWorkoutLog = z.infer<typeof insertWorkoutLogSchema>;
export type WeightLog = typeof weightLogs.$inferSelect;
export type InsertWeightLog = z.infer<typeof insertWeightLogSchema>;
