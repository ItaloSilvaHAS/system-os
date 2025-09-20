import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  totalXP: integer("total_xp").default(0).notNull(),
  availablePoints: integer("available_points").default(0).notNull(),
  stats: jsonb("stats").$type<{
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
  }>().default({ strength: 10, agility: 10, intelligence: 10, vitality: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'daily', 'side', 'main'
  xpReward: integer("xp_reward").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  resetDate: timestamp("reset_date"), // for daily missions
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const updateUserStatsSchema = z.object({
  stats: z.object({
    strength: z.number().min(0),
    agility: z.number().min(0),
    intelligence: z.number().min(0),
    vitality: z.number().min(0),
  }),
  availablePoints: z.number().min(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type UpdateUserStats = z.infer<typeof updateUserStatsSchema>;
