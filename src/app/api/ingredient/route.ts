import { NextRequest } from "next/server";
import { IngredientFormData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get("pricey_access_token")?.value;

    if (token) {
      const ingredientData: IngredientFormData = await req.json();

      const saveIngredientResponse = await fetch(
        `${process.env.PRICEY_BACKEND_URL}/ingredient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ingredient: ingredientData,
          }),
        },
      );

      const { success, data, error } = await saveIngredientResponse.json();

      if (!success) return new Response(error, { status: 400 });

      return Response.json({ ingredient: data });
    }
  } catch (error) {
    return new Response(`Login error: ${error}`, {
      status: 400,
    });
  }
};