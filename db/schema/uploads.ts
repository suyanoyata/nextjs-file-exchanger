import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "@/db/schema/users";
import { sql } from "drizzle-orm";

export const uploadTable = pgTable("uploads", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  generatedFileName: varchar({ length: 255 }).notNull().unique(),
  originalFileName: varchar({ length: 255 }).notNull(),
  uploadedAt: timestamp()
    .notNull()
    .default(sql`now()`),
});
