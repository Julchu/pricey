import { cookies } from "next/headers";

export async function GET() {
  const oauth2EndpointUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const clientId = encodeURIComponent(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  );
  const redirect_uri = encodeURIComponent(
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URIS!,
  );

  // const code_verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  // const code_challenge = base64url(await sha256(code_verifier));
  const response_type = encodeURIComponent("code");
  const scope = encodeURIComponent("email profile");
  const include_granted_scopes = "true";
  const state = encodeURIComponent(crypto.randomUUID()); // for CSRF protection

  const redirectToGoogle = `${oauth2EndpointUrl}?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&include_granted_scopes=${include_granted_scopes}&state=${state}`;
  return Response.redirect(redirectToGoogle);
}

export async function POST() {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token) return new Response(JSON.stringify({ userInfo: null }));

    const loginResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await loginResponse.json();
    // const setCookie = loginResponse.headers.get("set-cookie");
    // console.log(
    //   "Set-Cookie from backend:",
    //   loginResponse.headers.get("set-cookie"),
    // );
    if (!success || error)
      return new Response(`Error: ${error}`, { status: loginResponse.status });

    return new Response(JSON.stringify({ userInfo: data }), {
      status: 200,
      // ...(setCookie && { headers: { "Set-Cookie": setCookie } }),
    });
  } catch (error) {
    console.error(error);
  }
}

/*
* import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: () => apiFetch("/api/login", { method: "POST" }), // calls your backend-proxy route
    retry: false,
  });
  * */