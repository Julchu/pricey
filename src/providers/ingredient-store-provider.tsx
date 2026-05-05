"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
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
  const initialState = ingredients
    ? initIngredientsStore(ingredients)
    : defaultInitState;

  const [ingredientStoreState] = useState(() =>
    createIngredientsStore(initialState),
  );

  return (
    <IngredientsStoreContext.Provider value={ingredientStoreState}>
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