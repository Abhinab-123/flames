import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const flamesCalculations = pgTable("flames_calculations", {
  id: serial("id").primaryKey(),
  name1: text("name1").notNull(),
  name2: text("name2").notNull(),
  result: text("result").notNull(),
  compatibility: integer("compatibility").notNull(),
  timestamp: text("timestamp").notNull()
});

export const insertFlamesSchema = createInsertSchema(flamesCalculations).pick({
  name1: true,
  name2: true,
  result: true,
  compatibility: true,
  timestamp: true
});

export type InsertFlames = z.infer<typeof insertFlamesSchema>;
export type FlamesCalculation = typeof flamesCalculations.$inferSelect;

// Schema for the FLAMES api request
export const flamesRequestSchema = z.object({
  name1: z.string().min(1).max(30),
  name2: z.string().min(1).max(30)
});

export type FlamesRequest = z.infer<typeof flamesRequestSchema>;

// Schema for the FLAMES api response
export const flamesResponseSchema = z.object({
  name1: z.string(),
  name2: z.string(),
  result: z.enum(['F', 'L', 'A', 'M', 'E', 'S']),
  relationship: z.string(),
  compatibility: z.number().min(0).max(100),
  description: z.string()
});

export type FlamesResponse = z.infer<typeof flamesResponseSchema>;
