import { NextRequest } from "next/server";
import { IngredientFormData, PresignData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const browserCookies = await cookies();
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const ingredientsResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await ingredientsResponse.json();

    if (!success)
      return new Response(error, { status: ingredientsResponse.status });
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
    const token =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const ingredientData: IngredientFormData = await req.json();

    if (!token)
      return new Response(JSON.stringify({ ingredient: ingredientData }), {
        status: 401,
      });

    const saveIngredientResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredient: ingredientData,
        }),
      },
    );

    const { success, data, error } = await saveIngredientResponse.json();
    if (!success)
      return new Response(error, { status: saveIngredientResponse.status });

    const ingredient = data;
    const ingredientPublicId = ingredient?.publicId;

    if (!ingredientPublicId)
      return new Response(JSON.stringify({ ingredient }), { status: 200 });

    const presignResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/ingredient/${ingredientPublicId}/image/presign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const {
      success: presignSuccess,
      data: presignData,
    }: { success: boolean; data: PresignData } = await presignResponse.json();

    if (!presignSuccess)
      return new Response(JSON.stringify({ ingredient }), { status: 200 });

    return new Response(
      JSON.stringify({ ingredient, presign: presignData }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(`Ingredient creation error: ${error}`, {
      status: 400,
    });
  }
};