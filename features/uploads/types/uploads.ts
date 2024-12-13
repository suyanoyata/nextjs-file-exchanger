import { uploadTable } from "@/db/schema/uploads";

export type UploadCreatePayload = typeof uploadTable.$inferInsert;

// generatedFileName and name are same
export type UploadItem = {
  id: number;
  // url: string;
  name?: string;
  generatedFileName: string;
  originalFileName: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
};
