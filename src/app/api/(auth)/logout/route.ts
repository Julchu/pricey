import { cookies } from "next/headers";

export async function POST() {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get("pricey_access_token")?.value;

    if (token) {
      const logoutResponse = await fetch(
        `${process.env.PRICEY_BACKEND_URL}/user/logout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { success, data, error } = await logoutResponse.json();
      const setCookie = logoutResponse.headers.get("set-cookie");

      if (!success || !setCookie) return new Response(error, { status: 400 });

      return new Response(JSON.stringify({ userInfo: data }), {
        status: 200,
        headers: { "Set-Cookie": setCookie },
      });
    }
  } catch (error) {
    return new Response(`Logout error: ${error}`, {
      status: 400,
    });
  }
}