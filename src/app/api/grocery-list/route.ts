import { NextRequest } from "next/server";
import { GroceryListFormData } from "@/utils/interfaces";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;

    const groceryListsResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await groceryListsResponse.json();

    if (!success)
      return new Response(error, { status: groceryListsResponse.status });
    return new Response(JSON.stringify({ groceryLists: data }), {
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

    const groceryListData: GroceryListFormData = await req.json();

    if (!accessToken)
      return new Response(JSON.stringify({ groceryList: null }), {
        status: 401,
      });

    const saveGroceryListResponse = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groceryList: groceryListData,
        }),
      },
    );

    const { success, data, error } = await saveGroceryListResponse.json();
    if (!success)
      return new Response(error, { status: saveGroceryListResponse.status });
    return new Response(JSON.stringify({ groceryList: data }), {
      status: 200,
    });
  } catch (error) {
    return new Response(`Grocery list creation error: ${error}`, {
      status: 400,
    });
  }
};