import { uploads } from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  await uploads.api.removeExpiredUploads();

  return NextResponse.json({});
}
