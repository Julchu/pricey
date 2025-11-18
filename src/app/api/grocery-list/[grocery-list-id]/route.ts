import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export const DELETE = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const accessToken = browserCookies.get(
      `${process.env.ACCESS_TOKEN_KEY}`,
    )?.value;

    const groceryListId: string = await req.json();

    // TODO: not sure what this will result in
    if (!accessToken)
      return new Response(JSON.stringify({ groceryList: groceryListId }), {
        status: 401,
      });

    const deleteGroceryListResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list/${groceryListId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { success, data, error } = await deleteGroceryListResponse.json();
    if (!success)
      return new Response(error, { status: deleteGroceryListResponse.status });
    return new Response(JSON.stringify({ groceryListId: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Grocery list deletion error: ${error}`, {
      status: 400,
    });
  }
};