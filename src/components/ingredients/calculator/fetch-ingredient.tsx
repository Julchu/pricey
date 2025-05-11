"use server";
import { cookies } from "next/headers";

// TODO: paginate results
export const fetchIngredient = async () => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get("pricey_access_token")?.value;
    if (token) {
      const ingredientsResponse = await fetch(
        `${process.env.PRICEY_BACKEND_URL}/ingredient`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const {
        success,
        data,
        error: responseError,
      } = await ingredientsResponse.json();

      if (success) return data;
      else console.error(responseError);
    }
  } catch (error) {
    console.log(error);
  }
};