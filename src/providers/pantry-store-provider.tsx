"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useStore } from "zustand";
import {
  createPantryStore,
  initPantryStore,
  PantryStore,
  PantryStoreApi,
} from "@/stores/pantry-store";
import { PantryItem } from "@/utils/interfaces";

export const PantryStoreContext = createContext<PantryStoreApi | undefined>(
  undefined,
);

export type PantryStoreProviderProps = PropsWithChildren<{
  pantryItems?: PantryItem[] | null;
}>;

export const PantryStoreProvider = ({
  children,
  pantryItems,
}: PantryStoreProviderProps) => {
  const [pantryStoreState] = useState(() =>
    createPantryStore(initPantryStore(pantryItems)),
  );

  return (
    <PantryStoreContext.Provider value={pantryStoreState}>
      {children}
    </PantryStoreContext.Provider>
  );
};

export const usePantryStore = <T,>(selector: (store: PantryStore) => T): T => {
  const pantryStoreContext = useContext(PantryStoreContext);

  if (!pantryStoreContext) {
    throw new Error(`usePantryStore must be used within PantryStoreProvider`);
  }

  return useStore(pantryStoreContext, selector);
};
