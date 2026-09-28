"use server";
import { getAccessToken } from "@/utils/server-actions/session-token";

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
    const token = await getAccessToken();

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