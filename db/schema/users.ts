import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { uploadTable } from "@/db/schema/uploads";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 16 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp()
    .notNull()
    .default(sql`now()`),
  expirationMinutes: integer().notNull().default(5),
  apiKey: varchar({ length: 255 }).unique().notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  uploadTable: one(uploadTable),
}));
