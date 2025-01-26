import UploadService from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function DELETE() {
  const data = await UploadService.clearUserUploads();
  return NextResponse.json({
    data,
  });
}

export async function GET() {
  const { data, error } = await UploadService.getUserUploads();

  if (error) {
    return NextResponse.json({
      message: error.message,
    });
  }

  return NextResponse.json({
    data,
  });
}
