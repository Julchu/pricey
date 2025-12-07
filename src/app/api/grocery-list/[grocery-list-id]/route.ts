import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { GroceryListUpdateFormData } from "@/utils/interfaces";

export const PATCH = async (req: NextRequest) => {
  try {
    const browserCookies = await cookies();
    const accessToken =
      process.env.MASTER_KEY ||
      browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const groceryListData: GroceryListUpdateFormData = await req.json();

    if (!accessToken)
      return new Response(JSON.stringify({ groceryList: null }), {
        status: 401,
      });

    const groceryListId = groceryListData.groceryList.publicId;
    if (!groceryListId)
      return new Response(JSON.stringify({ groceryList: null }), {
        status: 404,
      });

    const updateGroceryListResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list/${groceryListId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groceryListData),
      },
    );

    const { success, data, error } = await updateGroceryListResponse.json();
    if (!success)
      return new Response(error, { status: updateGroceryListResponse.status });
    return new Response(JSON.stringify({ groceryList: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Grocery list creation error: ${error}`, {
      status: 400,
    });
  }
};

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