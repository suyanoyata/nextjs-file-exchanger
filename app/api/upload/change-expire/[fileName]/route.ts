import { NextRequest, NextResponse } from "next/server";

import { uploads } from "@/features/uploads/db/uploads";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const minutes = request.nextUrl.searchParams.get("minutes");

  const req = await uploads.api.changeUploadExpirationTime(
    (
      await params
    ).fileName,
    Number(minutes)
  );

  return NextResponse.json(req);
}
