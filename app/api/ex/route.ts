import UploadService from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  await UploadService.removeExpiredUploads();

  return NextResponse.json({});
}
