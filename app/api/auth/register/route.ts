import { NextResponse } from "next/server";

import TokenService from "@/features/users/utils/token";
import { users } from "@/features/users/db/users";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const cookie = await cookies();

  const result = await users.api.createUser(body);

  if (result.error || !result.data) {
    return NextResponse.json({ message: result.error }, { status: 500 });
  }

  const authToken = await TokenService.signToken(result.data);

  cookie.set("access-token", authToken);

  return NextResponse.json({ data: result.data });
}
