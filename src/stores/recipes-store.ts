import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Recipe,
  RecipeFormData,
  RecipeIngredientFormData,
} from "@/utils/interfaces";
import { mergeIngredients } from "@/utils/merge-ingredients";

export type RecipesState = {
  recipes: Recipe[];
  currentRecipe: RecipeFormData | null;
  currentRecipeVersion: number;
  hasHydrated: boolean;
};

export type RecipesActions = {
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (newRecipe: Recipe) => void;
  clearRecipes: () => void;
  fetchRecipes: () => void;
  updateRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  setCurrentRecipe: (recipe: RecipeFormData | null) => void;
  clearCurrentRecipe: () => void;
  addIngredientsToCurrentRecipe: (
    ingredients: RecipeIngredientFormData[],
  ) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export type RecipesStore = RecipesState & RecipesActions;

export const initRecipesStore = (recipes?: Recipe[] | null): RecipesState => {
  return {
    // TODO: Zod validation on recipes
    recipes: recipes && recipes.length > 0 ? recipes : [],
    currentRecipe: null,
    currentRecipeVersion: 1,
    hasHydrated: false,
  };
};

export const createRecipesStore = (initialState: RecipesState) => {
  return create<RecipesStore>()(
    persist(
      (set) => ({
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
            set(() => ({ recipes }));
          } catch (error) {
            throw new Error("Unable to retrieve recipes", { cause: error });
          }
        },
        updateRecipe: (existingRecipe) => {
          set(({ recipes }) => ({
            recipes: recipes.map((recipe) =>
              recipe.publicId === existingRecipe.publicId
                ? existingRecipe
                : recipe,
            ),
          }));
        },
        removeRecipe: (recipeId) =>
          set(({ recipes }) => ({
            recipes: recipes.filter((recipe) => recipe.publicId !== recipeId),
          })),
        setCurrentRecipe: (recipe: RecipeFormData | null) =>
          set({ currentRecipe: recipe }),
        clearCurrentRecipe: () => set({ currentRecipe: null }),
        addIngredientsToCurrentRecipe: (ingredients) =>
          set(({ currentRecipe, currentRecipeVersion }) => {
            if (!currentRecipe) {
              return {
                currentRecipe: {
                  name: "",
                  ingredients,
                  public: false,
                },
                currentRecipeVersion: currentRecipeVersion + 1,
              };
            }
            return {
              currentRecipe: {
                ...currentRecipe,
                ingredients: mergeIngredients(
                  currentRecipe.ingredients,
                  ingredients,
                ),
              },
              currentRecipeVersion: currentRecipeVersion + 1,
            };
          }),
        setHasHydrated: (hasHydrated: boolean) => {
          set({ hasHydrated });
        },
      }),
      {
        name: "current-recipe",
        partialize: ({ currentRecipe }) => ({
          currentRecipe,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (!error) state?.setHasHydrated(true);
          };
        },
      },
    ),
  );
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