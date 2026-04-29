import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  // Exchange one-time code for tokens server-side
  let tokens: { access_token: string; refresh_token: string };
  try {
    const apiRes = await fetch(`${API_URL}/auth/exchange-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!apiRes.ok) throw new Error("Exchange failed");
    tokens = await apiRes.json();
  } catch {
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  const res = NextResponse.redirect(new URL("/dashboard", request.url));

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOpts = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
  };

  res.cookies.set("access_token", tokens.access_token, {
    ...cookieOpts,
    maxAge: 180,
  });
  res.cookies.set("refresh_token", tokens.refresh_token, {
    ...cookieOpts,
    maxAge: 300,
  });

  return res;
}
