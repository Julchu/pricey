import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const loginResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const { success, data, error: loginError } = await loginResponse.json();
    const setCookie = loginResponse.headers.get("set-cookie");

    if (!success || !setCookie || loginError)
      return new Response(loginError, { status: 400 });

    return new Response(JSON.stringify({ userInfo: data }), {
      status: 200,
      headers: { "Set-Cookie": setCookie },
    });
  } catch (error) {
    return new Response(`Login error: ${error}`, {
      status: 400,
    });
  }
}