"use client";

import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createRecipesStore,
  defaultInitState,
  initRecipesStore,
  RecipesStore,
  RecipesStoreApi,
} from "@/stores/recipes-store";
import { Recipe } from "@/utils/interfaces";

export const RecipesStoreContext = createContext<RecipesStoreApi | undefined>(
  undefined,
);

export type RecipesStoreProviderProps = PropsWithChildren<{
  recipes?: Recipe[] | null;
}>;

export const RecipeStoreProvider = ({
  children,
  recipes,
}: RecipesStoreProviderProps) => {
  const storeRef = useRef<RecipesStoreApi>(null);
  if (storeRef.current === null) {
    const initialState = recipes ? initRecipesStore(recipes) : defaultInitState;
    storeRef.current = createRecipesStore(initialState);
  }

  return (
    <RecipesStoreContext.Provider value={storeRef.current}>
      {children}
    </RecipesStoreContext.Provider>
  );
};

export const useRecipesStore = <T,>(
  selector: (store: RecipesStore) => T,
): T => {
  const recipesStoreContext = useContext(RecipesStoreContext);

  if (!recipesStoreContext) {
    throw new Error(`useRecipesStore must be used within RecipeStoreProvider`);
  }

  return useStore(recipesStoreContext, selector);
};