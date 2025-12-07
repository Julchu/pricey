import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY!;
  const refreshTokenKey = process.env.REFRESH_TOKEN_KEY!;

  const accessToken = req.cookies.get(accessTokenKey)?.value;
  const refreshToken = req.cookies.get(refreshTokenKey)?.value;

  const response = NextResponse.next();
  response.headers.set("X-Current-Path", req.nextUrl.pathname);

  if (!accessToken && refreshToken) {
    const refreshRes = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/refresh`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (refreshRes.ok) {
      const setCookies = refreshRes.headers.getSetCookie?.() || [];

      for (const cookie of setCookies) {
        response.headers.append("Set-Cookie", cookie);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    // "/api/:path*",
    // "/",
    "/:path*",
    // "/groceries",
    // "/ingredients",
    // "/recipes",
    "/api/:path*",
    // "!/api/public/:path*",
    // "!/favicon.ico",
    // "!/robots.txt",
    // "!/sitemap.xml",
    // "!/assets/:path*",
    // "!/_next/:path*",
  ],
};

/*export const config = {
  matcher: [
    "/api/:path*",
    "!/api/public/:path*", // Optional: exclude public endpoints
  ],
};*/