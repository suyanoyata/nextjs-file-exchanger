import { NextRequest, NextResponse } from "next/server";

import UploadService from "@/features/uploads/db/uploads";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const minutes = request.nextUrl.searchParams.get("minutes");
  const fromCurrentTime = request.nextUrl.searchParams.get("fromCurrent");

  const req = await UploadService.changeUploadExpirationTime(
    (await params).fileName,
    Number(minutes),
    fromCurrentTime === "true"
  );

  return NextResponse.json(req);
}
