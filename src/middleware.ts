import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY!;
  const refreshTokenKey = process.env.REFRESH_TOKEN_KEY!;

  const accessToken = req.cookies.get(accessTokenKey)?.value;
  const refreshToken = req.cookies.get(refreshTokenKey)?.value;

  if (!accessToken && refreshToken) {
    const refreshRes = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `${refreshTokenKey}=${refreshToken}`,
        },
      },
    );

    if (refreshRes.ok) {
      const response = NextResponse.redirect(req.nextUrl);

      const setCookies = refreshRes.headers.getSetCookie?.() || [];

      for (const cookie of setCookies) {
        response.headers.append("Set-Cookie", cookie);
      }

      return response;
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
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