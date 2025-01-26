import StorageService from "@/features/uploads/db/storage";
import UploadService from "@/features/uploads/db/uploads";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const fileName = (await params).fileName;

  const bucketName = await UploadService.getUploadBucketName(fileName);

  if (bucketName.error) {
    return NextResponse.json({ ...bucketName.error }, { status: 500 });
  }

  const { data, error } = await StorageService.downloadFile(bucketName.data, fileName);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const fileType = data.type || "application/octet-stream";
  const multimedia =
    fileType.startsWith("image/") ||
    fileType.startsWith("video/") ||
    fileType.startsWith("audio/");

  const contentDisposition =
    multimedia && !(request.nextUrl.searchParams.get("d") == "1")
      ? "inline"
      : `attachment; filename="${fileName}"`;

  return new NextResponse(data, {
    headers: {
      "Content-Type": fileType,
      "Content-Disposition": contentDisposition,
    },
  });
}
