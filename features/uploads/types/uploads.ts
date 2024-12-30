import { uploadTable } from "@/db/schema/uploads";

export type UploadCreatePayload = typeof uploadTable.$inferInsert;
export type SelectUploadItem = typeof uploadTable.$inferSelect;

export type UploadItem = SelectUploadItem & {
  name: string;
  metadata?: Record<string, any>;
};

export type UploadProperties = {
  expireAfterMinutes: number;
  newExpireFromCurrentTime: boolean;
};
