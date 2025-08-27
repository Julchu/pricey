"use client";

import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createGroceryListsStore,
  defaultInitState,
  GroceryListsStore,
  GroceryListsStoreApi,
  initGroceryListsStore,
} from "@/stores/grocery-list-store";
import { GroceryList } from "@/utils/interfaces";

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
  const storeRef = useRef<GroceryListsStoreApi | null>(null);
  if (storeRef.current === null) {
    const initialState = groceryLists
      ? initGroceryListsStore(groceryLists)
      : defaultInitState;
    storeRef.current = createGroceryListsStore(initialState);
  }

  return (
    <GroceryListsStoreContext.Provider value={storeRef.current}>
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
