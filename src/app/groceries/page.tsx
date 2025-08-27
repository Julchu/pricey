import { cookies } from "next/headers";
import { GroceryList } from "@/utils/interfaces";

export const dynamic = "force-dynamic";

const Groceries = async () => {
  let groceryLists: GroceryList[] = [];
  try {
    const browserCookies = await cookies();
    const token = browserCookies.get(`${process.env.ACCESS_TOKEN_KEY}`)?.value;
    const fetchedGroceries = await fetch(
      `${process.env.PRICEY_BACKEND_URL}/grocery-list`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { success, data, error } = await fetchedGroceries.json();

    if (success) groceryLists = data;
    if (error) console.error("Error in groceries", error);
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
