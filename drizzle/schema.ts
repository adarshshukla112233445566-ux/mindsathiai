import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const appUsers = mysqlTable("app_users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["patient", "caregiver", "admin"]).notNull(),
  age: int("age"),
  language: varchar("language", { length: 8 }).default("en").notNull(),
  connectionCode: varchar("connectionCode", { length: 32 }),
  caregiverId: varchar("caregiverId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const activityResults = mysqlTable("activity_results", {
  id: varchar("id", { length: 64 }).primaryKey(),
  patientId: varchar("patientId", { length: 64 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  score: int("score").notNull(),
  accuracy: int("accuracy").notNull(),
  responseTime: int("responseTime").notNull(),
  difficulty: varchar("difficulty", { length: 32 }).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export const reminders = mysqlTable("reminders", {
  id: varchar("id", { length: 64 }).primaryKey(),
  patientId: varchar("patientId", { length: 64 }).notNull(),
  createdBy: varchar("createdBy", { length: 64 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  scheduledTime: timestamp("scheduledTime").notNull(),
  repeat: varchar("repeat", { length: 32 }).default("once").notNull(),
  status: varchar("status", { length: 32 }).default("upcoming").notNull(),
});

export const caregiverConnections = mysqlTable("caregiver_connections", {
  id: varchar("id", { length: 64 }).primaryKey(),
  patientId: varchar("patientId", { length: 64 }).notNull(),
  caregiverId: varchar("caregiverId", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type AppUser = typeof appUsers.$inferSelect;
export type ActivityResult = typeof activityResults.$inferSelect;
export type Reminder = typeof reminders.$inferSelect;
export type CaregiverConnection = typeof caregiverConnections.$inferSelect;

export type AppRole = "patient" | "caregiver" | "admin";
export type ActivityType = "memory" | "attention" | "pattern" | "recall";

export type ActivityRecord = {
  id: string;
  patientId: string;
  type: ActivityType;
  score: number;
  accuracy: number;
  responseTime: number;
  difficulty: string;
  completedAt: string;
};

export type ReminderRecord = {
  id: string;
  patientId: string;
  createdBy: string;
  title: string;
  description: string;
  scheduledTime: string;
  repeat: string;
  status: "upcoming" | "completed" | "missed";
};

export type ConnectionRecord = {
  id: string;
  patientId: string;
  caregiverId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type SeedAppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AppRole;
  age?: number;
  language: string;
  connectionCode?: string;
  caregiverId?: string;
  createdAt: string;
};
