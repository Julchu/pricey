import { cookies } from "next/headers";

export async function POST() {
  const browserCookies = await cookies();

  try {
    const loginResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${browserCookies.get("pricey_token")?.value}`,
        },
      },
    );

    const setCookie = loginResponse.headers.get("set-cookie");
    if (setCookie) {
      return new Response(JSON.stringify({ loginResponse }), {
        status: 200,
        headers: { "Set-Cookie": setCookie },
      });
    }
  } catch (error) {
    return new Response(`Login error: ${error}`, {
      status: 400,
    });
  }
}