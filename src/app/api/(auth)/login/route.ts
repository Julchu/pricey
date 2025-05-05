import { UserFormData } from "@/utils/interfaces";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData: UserFormData = await req.json();
    const email = formData["email"];
    const loginResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      },
    );

    const { success, data, error } = await loginResponse.json();
    const setCookie = loginResponse.headers.get("set-cookie");

    if (!success || !setCookie) return new Response(error, { status: 400 });

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