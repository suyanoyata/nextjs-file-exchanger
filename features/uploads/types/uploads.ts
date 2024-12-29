import { uploadTable } from "@/db/schema/uploads";

export type UploadCreatePayload = typeof uploadTable.$inferInsert;
export type SelectUploadItem = typeof uploadTable.$inferSelect;

// generatedFileName and name are same
export type UploadItem = SelectUploadItem & {
  name?: string;
  metadata?: Record<string, any>;
};
