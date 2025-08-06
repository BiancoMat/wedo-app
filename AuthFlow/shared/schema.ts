import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  credits: integer("credits").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favors = pgTable("favors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'request' or 'offer'
  location: text("location").notNull(), // 'remote' or 'presential'
  credits: integer("credits").notNull(),
  status: text("status").default("active"), // 'active', 'suspended', 'completed', 'accepted'
  acceptedBy: varchar("accepted_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'public' or 'private'
  managementType: text("management_type").notNull(), // 'equal', 'founder', 'admin'
  founderId: varchar("founder_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").default("member"), // 'member', 'admin', 'founder'
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // 'group_request', 'favor_accepted', 'favor_completed'
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: varchar("related_id"), // group_id or favor_id
  status: text("status").default("unread"), // 'unread', 'read', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
});

export const insertFavorSchema = createInsertSchema(favors).pick({
  title: true,
  description: true,
  type: true,
  location: true,
  credits: true,
});

export const insertGroupSchema = createInsertSchema(groups).pick({
  name: true,
  description: true,
  type: true,
  managementType: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  type: true,
  title: true,
  message: true,
  relatedId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFavor = z.infer<typeof insertFavorSchema>;
export type Favor = typeof favors.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;
export type GroupMember = typeof groupMembers.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
