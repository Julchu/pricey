import { create } from "zustand";
import { Recipe } from "@/utils/interfaces";

export type RecipesState = {
  recipes: Recipe[];
};

export type RecipesActions = {
  setRecipes: (recipes: Recipe[]) => void;
  clearRecipes: () => void;
  fetchRecipes: () => void;
};

export type RecipesStore = RecipesState & RecipesActions;

export const initRecipesStore = (recipes?: Recipe[]): RecipesState => {
  return {
    recipes: recipes && recipes.length > 0 ? recipes : [],
  };
};

export const defaultInitState: RecipesState = {
  recipes: [],
};

export const useRecipesStore = create<RecipesStore>((set) => ({
  ...defaultInitState,
  setRecipes: (recipes) => set({ recipes }),
  clearRecipes: () => set({ recipes: [] }),
  fetchRecipes: async () => {
    try {
      const { recipes } = await tryFetchingRecipes();
      set(() => ({ recipes }));
    } catch (error) {
      throw new Error("Unable to retrieve recipes", { cause: error });
    }
  },
}));

const tryFetchingRecipes = async () => {
  try {
    const fetchRecipes = await fetch("/api/recipes");
    return await fetchRecipes.json();
  } catch (error) {
    throw new Error("Unable to fetch recipes", { cause: error });
  }
};