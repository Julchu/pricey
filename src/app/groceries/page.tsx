import { GroceryList } from "@/utils/interfaces";
import { serverFetch } from "@/utils/server-actions/server-fetch";
import { GroceryListStoreProvider } from "@/providers/grocery-list-store-provider";
import { GroceryListAccordion } from "@/components/groceries/grocery-list-accordion";

// export const dynamic = "force-dynamic";

const Groceries = async () => {
  const groceryLists = await serverFetch<GroceryList[]>({
    endpoint: "grocery-list",
  });

  return (
    <div className="flex h-full flex-col md:flex-row">
      <GroceryListStoreProvider groceryLists={groceryLists} />
      <GroceryListAccordion />
    </div>
  );
};

export default Groceries;