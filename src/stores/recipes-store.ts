import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Recipe,
  RecipeFormData,
  RecipeIngredientFormData,
} from "@/utils/interfaces";
import { mergeIngredients } from "@/utils/merge-ingredients";
import {
  CollectionLoadState,
  fetchCollection,
  loadStateFromServer,
  nextLoadStateForFetch,
} from "@/stores/collection-load";

export type RecipesState = {
  recipes: Recipe[];
  recipesLoadState: CollectionLoadState;
  currentRecipe: RecipeFormData | null;
  currentRecipeVersion: number;
  hasHydrated: boolean;
};

export type RecipesActions = {
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (newRecipe: Recipe) => void;
  clearRecipes: () => void;
  fetchRecipes: () => Promise<void>;
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

export const initRecipesStore = (
  recipes?: Recipe[] | null,
  recipesServerLoaded = false,
): RecipesState => {
  return {
    // TODO: Zod validation on recipes
    recipes: recipes ?? [],
    recipesLoadState: loadStateFromServer(recipesServerLoaded),
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
        clearRecipes: () => set({ recipes: [], recipesLoadState: "idle" }),
        fetchRecipes: async () => {
          let shouldFetch = false;
          set(({ recipesLoadState }) => {
            const next = nextLoadStateForFetch(recipesLoadState);
            if (!next.shouldFetch) return {};
            shouldFetch = true;
            return { recipesLoadState: next.loadState };
          });
          if (!shouldFetch) return;

          try {
            const recipes = await fetchCollection<Recipe>(
              "/api/recipe",
              "recipes",
              "Recipe",
            );
            set({ recipes, recipesLoadState: "loaded" });
          } catch (error) {
            console.error("Unable to retrieve recipes", error);
            set({ recipesLoadState: "error" });
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

export type RecipesStoreApi = ReturnType<typeof createRecipesStore>;
