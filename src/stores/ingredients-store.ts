import { create } from "zustand";
import { Ingredient } from "@/utils/interfaces";
import {
  CollectionLoadState,
  fetchCollection,
  loadStateFromServer,
  nextLoadStateForFetch,
} from "@/stores/collection-load";

export type IngredientsState = {
  ingredients: Ingredient[];
  ingredientsLoadState: CollectionLoadState;
};

export type IngredientsActions = {
  setIngredients: (ingredients: Ingredient[]) => void;
  updateIngredients: (ingredient: Ingredient) => void;
  clearIngredients: () => void;
  fetchIngredients: () => Promise<void>;
};

export type IngredientsStore = IngredientsState & IngredientsActions;

const presentIngredients = (ingredients?: Ingredient[] | null): Ingredient[] =>
  (ingredients ?? []).filter(
    (ingredient): ingredient is Ingredient => !!ingredient,
  );

export const initIngredientsStore = (
  ingredients?: Ingredient[] | null,
  ingredientsServerLoaded = false,
): IngredientsState => {
  return {
    ingredients: presentIngredients(ingredients),
    ingredientsLoadState: loadStateFromServer(ingredientsServerLoaded),
  };
};

export const defaultInitState: IngredientsState = {
  ingredients: [],
  ingredientsLoadState: "idle",
};

export const createIngredientsStore = (
  initialState: IngredientsState = defaultInitState,
) => {
  return create<IngredientsStore>((set, get) => ({
    ...initialState,
    setIngredients: (ingredients) => set({ ingredients }),
    updateIngredients: (newIngredient) => {
      if (!newIngredient) return;
      const ingredients = get().ingredients;
      const filteredIngredients = ingredients.filter((currentIngredient) => {
        if (!currentIngredient?.publicId || !newIngredient?.publicId)
          return true;
        return currentIngredient.publicId !== newIngredient.publicId;
      });
      set({ ingredients: [...filteredIngredients, newIngredient] });
    },
    clearIngredients: () =>
      set({ ingredients: [], ingredientsLoadState: "idle" }),
    fetchIngredients: async () => {
      let shouldFetch = false;
      set(({ ingredientsLoadState }) => {
        const next = nextLoadStateForFetch(ingredientsLoadState);
        if (!next.shouldFetch) return {};
        shouldFetch = true;
        return { ingredientsLoadState: next.loadState };
      });
      if (!shouldFetch) return;

      try {
        const ingredients = presentIngredients(
          await fetchCollection<Ingredient>(
            "/api/ingredient",
            "ingredient",
            "Ingredient",
          ),
        );
        set({ ingredients, ingredientsLoadState: "loaded" });
      } catch (error) {
        console.error("Unable to retrieve ingredients", error);
        set({ ingredientsLoadState: "error" });
      }
    },
  }));
};

export type IngredientsStoreApi = ReturnType<typeof createIngredientsStore>;
