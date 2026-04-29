import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for Next.js internals and proxy routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.has("access_token");
  const hasRefreshToken = request.cookies.has("refresh_token");
  const hasAnyToken = hasAccessToken || hasRefreshToken;

  // redirect to dashboard if already authenticated
  if (pathname === "/") {
    if (hasAnyToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // require at least one valid token
  if (!hasAnyToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
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
