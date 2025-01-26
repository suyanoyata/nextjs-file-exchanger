import { NextResponse } from "next/server";

import UploadService from "@/features/uploads/db/uploads";
import { token } from "@/features/users/utils/token";
import { users } from "@/features/users/db/users";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export async function POST(req: Request) {
  let userId = 0;
  let uploadFrom: "web" | "api" = "web";

  const body = await req.formData();
  const file = body.get("file") as File;
  const uploadToken = body.get("uploadToken") as string;
  let expirationTime = Number(body.get("expirationTime") as string);

  const user = await users.api.getCurrentUser();

  // check if token is provided within request, if not check for request body
  if (!user.error && user.data) {
    userId = user.data.id;
  } else {
    const tokenInfo = await token.api.readCustomToken(uploadToken);

    if (!tokenInfo.error && tokenInfo.data) {
      userId = tokenInfo.data.userId;
      uploadFrom = "api";
    } else {
      return NextResponse.json({ data: null, error: "Couldn't read token" });
    }
  }

  if (uploadFrom == "api") {
    const dbUser = await users.api.getUserById(userId);

    expirationTime = dbUser.expirationMinutes;
  }

  const newFile = await UploadService.createUpload(
    {
      userId,
      originalFileName: file.name,
    },
    file,
    expirationTime
  );

  if (newFile.error) {
    return NextResponse.json(
      {
        error: newFile.error,
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({ ...newFile.data });
}
