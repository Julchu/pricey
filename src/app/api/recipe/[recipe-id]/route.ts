import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { RecipeUpdateFormData } from "@/utils/interfaces";

export const PATCH = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const recipeData: RecipeUpdateFormData = await req.json();

    if (!token)
      return new Response(JSON.stringify({ recipe: null }), {
        status: 401,
      });

    const recipeId = recipeData.recipe.publicId;
    if (!recipeId)
      return new Response(JSON.stringify({ recipe: null }), {
        status: 404,
      });

    const updateRecipeResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/recipe/${recipeId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      },
    );

    const { success, data, error } = await updateRecipeResponse.json();
    if (!success)
      return new Response(error, { status: updateRecipeResponse.status });
    return new Response(JSON.stringify({ recipe: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Recipe update error: ${error}`, {
      status: 400,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const recipeId: string = await req.json();

    if (!token)
      return new Response(JSON.stringify({ recipe: recipeId }), {
        status: 401,
      });

    const deleteRecipeResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/recipe/${recipeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { success, data, error } = await deleteRecipeResponse.json();
    if (!success)
      return new Response(error, { status: deleteRecipeResponse.status });
    return new Response(JSON.stringify({ recipeId: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Recipe deletion error: ${error}`, {
      status: 400,
    });
  }
};
