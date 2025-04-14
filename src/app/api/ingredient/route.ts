import { NextRequest } from "next/server";
import { IngredientFormData } from "../../../../old_pricey/components/HomeDashboard";

export async function POST(req: NextRequest) {
  const formData: IngredientFormData = await req.json();
  const name = formData["name"];
  const price = formData["price"];
  const unit = formData["unit"];
  const capacity = formData["capacity"];
  const quantity = formData["quantity"];

  const saveIngredient = await fetch(
    `${process.env.PRICEY_BACKEND_URL}/ingredient`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredient: {
          name,
          price,
          unit,
          capacity,
          quantity,
        },
      }),
    },
  );

  return Response.json({ ingredient: saveIngredient });
}