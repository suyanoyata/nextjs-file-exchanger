import { uploads } from "@/features/uploads/db/uploads";
import { token } from "@/features/users/utils/token";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const fileName = (await params).fileName;

  const tokenPayload = await token.api.readToken();

  if (tokenPayload.error || !tokenPayload.data) {
    return NextResponse.json(tokenPayload.error, { status: 500 });
  }

  const { error } = await uploads.api.deleteUserUpload(
    tokenPayload.data.name,
    fileName
  );

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Upload deleted" });
}
