import { token } from "@/features/users/utils/token";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const existingRoutes = ["/auth", "/uploads", "/api-key", "/"];
  const protectedRoutes = ["/uploads", "/api-key"];
  const newUrl = request.nextUrl.clone();

  if (protectedRoutes.includes(`${pathname}`)) {
    const payload = await token.api.readToken();

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
