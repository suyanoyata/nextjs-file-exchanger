import { NextRequest, NextResponse } from "next/server";

import TokenService from "@/features/users/utils/token";
import { api } from "@/lib/api";

let timestamp = Date.now();

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const existingRoutes = [
    "/auth",
    "/uploads",
    "/api-key",
    "/",
    "/settings",
    "/create-account",
  ];
  const protectedRoutes = ["/uploads", "/api-key"];
  const newUrl = request.nextUrl.clone();

  if (Date.now() - timestamp > 0.1 * 60 * 1000) {
    timestamp = Date.now();
    api.patch("/api/ex");
  }

  if (protectedRoutes.includes(`${pathname}`)) {
    const payload = await TokenService.readToken();

    newUrl.pathname = "/";

    if (payload.error) {
      return NextResponse.redirect(newUrl);
    }
  }

  if (!existingRoutes.includes(`${pathname}`)) {
    newUrl.pathname = `/api/download${pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
