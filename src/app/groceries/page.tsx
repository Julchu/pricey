import { cookies } from "next/headers";
import { GroceryList } from "@/utils/interfaces";

const Groceries = async () => {
  let groceryLists: GroceryList[] = [];
  try {
    const browserCookies = await cookies();

    const fetchedGroceries = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${browserCookies.get("pricey_access_token")?.value}`,
        },
      },
    );

    const {
      success,
      data,
      error: responseError,
    } = await fetchedGroceries.json();

    if (success) groceryLists = data;
    else console.error(responseError);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex h-full flex-col bg-gray-200 md:flex-row">
      Shopping lists
      {JSON.stringify(groceryLists)}
    </div>
  );
};

export default Groceries;