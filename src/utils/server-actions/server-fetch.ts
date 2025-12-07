"use server";
import { cookies } from "next/headers";

// TODO: paginate results
export const serverFetch = async <T>({
  endpoint,
  method = "GET",
  body,
}: {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}): Promise<T | null> => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token) return null;

    const fetchResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/${endpoint}`,
      {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await fetchResponse.json();

    if (success) return data as T;
    if (error) console.error("Fetch error", error);
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};