"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useStore } from "zustand";

import { GroceryList } from "@/utils/interfaces";
import {
  createGroceryListsStore,
  GroceryListsStore,
  GroceryListsStoreApi,
  initGroceryListsStore,
} from "@/stores/grocery-lists-store";

export const GroceryListsStoreContext = createContext<
  GroceryListsStoreApi | undefined
>(undefined);

export type GroceryListsStoreProviderProps = PropsWithChildren<{
  groceryLists?: GroceryList[] | null;
}>;

export const GroceryListStoreProvider = ({
  children,
  groceryLists,
}: GroceryListsStoreProviderProps) => {
  const [groceryStoreState] = useState(() =>
    createGroceryListsStore(initGroceryListsStore(groceryLists)),
  );

  return (
    <GroceryListsStoreContext.Provider value={groceryStoreState}>
      {children}
    </GroceryListsStoreContext.Provider>
  );
};

export const useGroceryListsStore = <T,>(
  selector: (store: GroceryListsStore) => T,
): T => {
  const groceryListsStoreContext = useContext(GroceryListsStoreContext);

  if (!groceryListsStoreContext) {
    throw new Error(
      `useGroceryListsStore must be used within GroceryListStoreProvider`,
    );
  }

  return useStore(groceryListsStoreContext, selector);
};