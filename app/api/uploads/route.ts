// TODO: implement getting user cookie

import { uploads } from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function DELETE() {
  const data = await uploads.api.clearUserUploads();
  return NextResponse.json({
    data,
  });
}

export async function GET() {
  const data = await uploads.api.getUserUploads();

  return NextResponse.json({
    data,
  });
}
