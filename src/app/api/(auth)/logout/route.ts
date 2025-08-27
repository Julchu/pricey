import { cookies } from "next/headers";

export async function POST() {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const logoutResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data } = await logoutResponse.json();

    const setCookie = logoutResponse.headers.get("set-cookie");

    if (success)
      return new Response(JSON.stringify({ userInfo: data }), {
        status: 200,
        ...(setCookie && { headers: { "Set-Cookie": setCookie } }),
      });

    const clearCookiesHeader = [
      `${process.env.ACCESS_TOKEN_KEY}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
      `${process.env.REFRESH_TOKEN_KEY}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
    ];

    return new Response(JSON.stringify({ userInfo: null }), {
      status: 200,
      headers: { "Set-Cookie": clearCookiesHeader.join(", ") },
    });
  } catch (error) {
    return new Response(`Logout error: ${error}`, {
      status: 400,
    });
  }
}
