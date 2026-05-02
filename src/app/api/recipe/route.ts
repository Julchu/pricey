import { NextRequest } from "next/server";
import { RecipeFormData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const recipesResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/recipe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await recipesResponse.json();

    if (!success)
      return new Response(error, { status: recipesResponse.status });
    return new Response(JSON.stringify({ recipes: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Recipe fetch error: ${error}`, {
      status: 400,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const recipeData: RecipeFormData = await req.json();

    if (!token)
      return new Response(JSON.stringify({ recipe: null }), {
        status: 401,
      });

    const saveRecipeResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/recipe`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe: recipeData,
        }),
      },
    );

    const { success, data, error } = await saveRecipeResponse.json();
    if (!success)
      return new Response(error, { status: saveRecipeResponse.status });
    return new Response(JSON.stringify({ recipe: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Recipe creation error: ${error}`, {
      status: 400,
    });
  }
};
