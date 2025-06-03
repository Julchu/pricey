"use server";
import { cookies } from "next/headers";

// TODO: paginate results
export const fetchIngredient = async () => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get("pricey_access_token")?.value;
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
    else return [];
  } catch (error) {
    console.log(error);
  }
};