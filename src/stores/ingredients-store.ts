import { create } from "zustand";
import { Ingredient } from "@/utils/interfaces";

export type IngredientsState = {
  ingredients: Ingredient[];
};

export type IngredientsActions = {
  setIngredients: (ingredients: Ingredient[]) => void;
  updateIngredients: (ingredient: Ingredient) => void;
  clearIngredients: () => void;
  fetchIngredients: () => void;
};

export type IngredientsStore = IngredientsState & IngredientsActions;

export const initIngredientsStore = (
  ingredients: Ingredient[],
): IngredientsState => {
  return {
    ingredients: ingredients && ingredients.length > 0 ? ingredients : [],
  };
};

export const defaultInitState: IngredientsState = {
  ingredients: [],
};

export const createIngredientsStore = (
  initialState: IngredientsState = defaultInitState,
) => {
  return create<IngredientsStore>((set, get) => ({
    ...initialState,
    setIngredients: (ingredients) => set({ ingredients }),
    updateIngredients: (newIngredient) => {
      const ingredients = get().ingredients;
      const filteredIngredients = ingredients.filter(
        (currentIngredient) =>
          currentIngredient.publicId !== newIngredient.publicId,
      );
      set({ ingredients: [...filteredIngredients, newIngredient] });
    },
    clearIngredients: () => set({ ingredients: [] }),
    fetchIngredients: async () => {
      try {
        const { ingredients } = await tryFetchingIngredients();
        set(() => ({ ingredients }));
      } catch (error) {
        throw new Error("Unable to retrieve ingredients", { cause: error });
      }
    },
  }));
};

const tryFetchingIngredients = async () => {
  try {
    const fetchIngredients = await fetch("/api/ingredient");
    return await fetchIngredients.json();
  } catch (error) {
    throw new Error("Unable to fetch ingredients", { cause: error });
  }
};

export type IngredientsStoreApi = ReturnType<typeof createIngredientsStore>;