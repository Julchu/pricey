import { UserFormData } from "@/utils/interfaces";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData: UserFormData = await req.json();
  const email = formData["email"];

  try {
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