import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const hasToken =
      request.cookies.has("access_token") ||
      request.cookies.has("refresh_token");
    if (hasToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const hasAuth =
    request.cookies.has("access_token") || request.cookies.has("refresh_token");

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profiles/:path*",
    "/search/:path*",
    "/account/:path*",
  ],
};
