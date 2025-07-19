"use client";

import { useEffect } from "react";
import { useGroceryListsStore } from "@/stores/grocery-lists-store";
import { GroceryList } from "@/utils/interfaces";

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