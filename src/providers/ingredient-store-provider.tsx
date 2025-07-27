"use client";

import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { useStore } from "zustand";
import {
  createIngredientsStore,
  defaultInitState,
  IngredientsStore,
  IngredientsStoreApi,
  initIngredientsStore,
} from "@/stores/ingredients-store";
import { Ingredient } from "@/utils/interfaces";

export const IngredientsStoreContext = createContext<
  IngredientsStoreApi | undefined
>(undefined);

export type IngredientsStoreProviderProps = PropsWithChildren<{
  ingredients: Ingredient[];
}>;

export const IngredientStoreProvider = ({
  children,
  ingredients,
}: IngredientsStoreProviderProps) => {
  const storeRef = useRef<IngredientsStoreApi | null>(null);
  if (storeRef.current === null) {
    const initialState = ingredients
      ? initIngredientsStore(ingredients)
      : defaultInitState;
    storeRef.current = createIngredientsStore(initialState);
  }

  return (
    <IngredientsStoreContext.Provider value={storeRef.current}>
      {children}
    </IngredientsStoreContext.Provider>
  );
};

export const useIngredientsStore = <T,>(
  selector: (store: IngredientsStore) => T,
): T => {
  const ingredientsStoreContext = useContext(IngredientsStoreContext);

  if (!ingredientsStoreContext) {
    throw new Error(
      `useIngredientsStore must be used within IngredientStoreProvider`,
    );
  }

  return useStore(ingredientsStoreContext, selector);
};