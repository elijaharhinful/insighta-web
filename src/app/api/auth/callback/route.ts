import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // 1. Verify state against your DB/Store if necessary

  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/auth/cli/exchange`,
      {
        code,
        code_verifier: "...", // Retrieve from session/store
      },
    );

    const { access_token, refresh_token } = response.data;

    const res = NextResponse.redirect(new URL("/dashboard", request.url));

    // 2. Set HTTP-only Cookies
    res.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 180, // 3 mins
    });

    res.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300, // 5 mins
    });

    return res;
  } catch (error) {
    return NextResponse.redirect(
      new URL("/login?error=auth_failed", request.url),
    );
  }
}
