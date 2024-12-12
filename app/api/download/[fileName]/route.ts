import { storage } from "@/features/uploads/db/storage";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const fileName = (await params).fileName;

  const { data, error } = await storage.api.downloadFile("Alice", fileName);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const fileType = data.type || "application/octet-stream";
  const contentDisposition =
    fileType.startsWith("image/") ||
    fileType.startsWith("video/") ||
    fileType.startsWith("audio/")
      ? "inline"
      : `attachment; filename="${fileName}"`;

  return new NextResponse(data, {
    headers: {
      "Content-Type": fileType,
      "Content-Disposition": contentDisposition,
    },
  });
}
