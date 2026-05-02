import { create } from "zustand";
import { Recipe } from "@/utils/interfaces";

export type RecipesState = {
  recipes: Recipe[];
};

export type RecipesActions = {
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (newRecipe: Recipe) => void;
  clearRecipes: () => void;
  fetchRecipes: () => void;
  updateRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
};

export type RecipesStore = RecipesState & RecipesActions;

export const initRecipesStore = (recipes?: Recipe[]): RecipesState => {
  return {
    recipes: recipes?.filter((i: unknown): i is Recipe => !!i) ?? [],
  };
};

export const defaultInitState: RecipesState = {
  recipes: [],
};

export const createRecipesStore = (
  initialState: RecipesState = defaultInitState,
) => {
  return create<RecipesStore>((set) => ({
    ...initialState,
    setRecipes: (recipes) => set({ recipes }),
    addRecipe: (newRecipe) =>
      set(({ recipes }) => ({
        recipes: [...recipes, newRecipe],
      })),
    clearRecipes: () => set({ recipes: [] }),
    fetchRecipes: async () => {
      try {
        const { recipes } = await tryFetchingRecipes();
        set(() => ({
          recipes: recipes?.filter((i: unknown): i is Recipe => !!i) ?? [],
        }));
      } catch (error) {
        throw new Error("Unable to retrieve recipes", { cause: error });
      }
    },
    updateRecipe: (existingRecipe) => {
      set(({ recipes }) => ({
        recipes: recipes.map((recipe) =>
          recipe.publicId === existingRecipe.publicId ? existingRecipe : recipe,
        ),
      }));
    },
    removeRecipe: (recipeId) =>
      set(({ recipes }) => ({
        recipes: recipes.filter((recipe) => recipe.publicId !== recipeId),
      })),
  }));
};

const tryFetchingRecipes = async () => {
  try {
    const fetchRecipes = await fetch("/api/recipe");
    return await fetchRecipes.json();
  } catch (error) {
    throw new Error("Unable to fetch recipes", { cause: error });
  }
};

export type RecipesStoreApi = ReturnType<typeof createRecipesStore>;