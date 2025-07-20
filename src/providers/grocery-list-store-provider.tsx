"use client";

import { GroceryList } from "@/utils/interfaces";
import { useGroceryListsStore } from "@/stores/grocery-list-store";
import { useEffect } from "react";

export const GroceryListStoreProvider = ({
  groceryLists,
}: {
  groceryLists?: GroceryList[] | null;
}) => {
  const setGroceryLists = useGroceryListsStore(
    ({ setGroceryLists }) => setGroceryLists,
  );

  useEffect(() => {
    if (groceryLists) {
      setGroceryLists(groceryLists);
    }
  }, [groceryLists, setGroceryLists]);

  return null;
};
