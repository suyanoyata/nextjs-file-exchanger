import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const existingRoutes = ["/auth", "/uploads", "/api-key"];

  if (!existingRoutes.includes(`${pathname}`)) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = `/api/download${pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
