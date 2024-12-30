import { NextRequest, NextResponse } from "next/server";

import { uploads } from "@/features/uploads/db/uploads";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const minutes = request.nextUrl.searchParams.get("minutes");
  const fromCurrentTime = request.nextUrl.searchParams.get("fromCurrent");

  const req = await uploads.api.changeUploadExpirationTime(
    (
      await params
    ).fileName,
    Number(minutes),
    fromCurrentTime === "true"
  );

  return NextResponse.json(req);
}
