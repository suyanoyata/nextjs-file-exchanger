import { uploads } from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function DELETE() {
  const data = await uploads.api.clearUserUploads();
  return NextResponse.json({
    data,
  });
}

export async function GET() {
  const { data, error } = await uploads.api.getUserUploads();

  if (error) {
    return NextResponse.json({
      message: error.message,
    });
  }

  return NextResponse.json({
    data,
  });
}
