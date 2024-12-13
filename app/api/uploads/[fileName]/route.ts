import { uploads } from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const fileName = (await params).fileName;

  const { error } = await uploads.api.deleteUserUpload("Alice", fileName);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Upload deleted" });
}
