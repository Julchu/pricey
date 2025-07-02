"use server";
import { cookies } from "next/headers";

// TODO: paginate results
export const fetchIngredient = async () => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token) return [];

    const ingredientsResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await ingredientsResponse.json();

    if (success) return data;
    if (error) console.error("fetch-ingredient error", error);
    return [];
  } catch (error) {
    console.error(error);
  }
};