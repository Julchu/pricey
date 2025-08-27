import { NextRequest } from "next/server";
import { IngredientFormData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const ingredientsResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await ingredientsResponse.json();

    if (!success) return new Response(error, { status: 400 });
    return new Response(JSON.stringify({ ingredient: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Login error: ${error}`, {
      status: 400,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const accessToken = browserCookies.get(
      `${process.env.ACCESS_TOKEN_KEY}`,
    )?.value;

    const ingredientData: IngredientFormData = await req.json();

    if (!accessToken)
      return new Response(JSON.stringify({ ingredient: ingredientData }), {
        status: 401,
      });

    const saveIngredientResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredient: ingredientData,
        }),
      },
    );

    const { success, data, error } = await saveIngredientResponse.json();
    if (!success) return new Response(error, { status: 400 });
    return new Response(JSON.stringify({ ingredient: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Ingredient creation error: ${error}`, {
      status: 400,
    });
  }
};
