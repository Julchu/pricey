import { NextRequest } from "next/server";
import { PantryUpdateFormData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token)
      return new Response(JSON.stringify({ pantryIngredients: [] }), {
        status: 200,
      });

    const pantryResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/pantry`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await pantryResponse.json();

    if (!success) return new Response(error, { status: pantryResponse.status });
    return new Response(JSON.stringify({ pantryIngredients: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Pantry fetch error: ${error}`, { status: 400 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    if (!token)
      return new Response(JSON.stringify({ pantryIngredients: [] }), {
        status: 401,
      });

    const {
      deletedIngredientIds,
      newIngredients,
      updatedIngredients,
    }: PantryUpdateFormData = await req.json();

    const syncResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/pantry`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            deletedIngredientIds,
            newIngredients,
            updatedIngredients,
          },
          (_key, value) => (value === undefined ? null : value),
        ),
      },
    );

    const { success, data, error } = await syncResponse.json();

    if (!success) return new Response(error, { status: syncResponse.status });
    return new Response(JSON.stringify({ pantryIngredients: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Pantry sync error: ${error}`, { status: 400 });
  }
};