import { uploads } from "@/features/uploads/db/uploads";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const file = (await req.formData()).get("file") as File;

  const newFile = await uploads.api.createUpload(
    {
      userId: 1,
      originalFileName: file.name,
    },
    file
  );

  if (newFile.error) {
    return NextResponse.json(newFile.error, {
      status: 500,
    });
  }

  return NextResponse.json({ data: newFile.data });
}
