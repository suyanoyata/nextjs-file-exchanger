import { users } from "@/features/users/db/users";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await users.api.getCurrentUser();

  if (user.error) {
    return NextResponse.json({ error: "Couldn't read token" }, { status: 500 });
  }

  return NextResponse.json({ data: user.data });
}
