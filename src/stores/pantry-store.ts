import { create } from "zustand";
import { PantryIngredient, PantryIngredientFormData } from "@/utils/interfaces";

export type PantryState = {
  pantryItems: PantryIngredient[];
  isPantryOpen: boolean;
  pantryVersion: number;
};

export type PantryActions = {
  addItemToPantry: (item: PantryIngredient) => void;
  addItems: (items: PantryIngredient[]) => void;
  removeItemFromPantry: (name: string) => void;
  clearPantry: () => void;
  setPantryOpen: (open: boolean) => void;
  setPantryItems: (items: PantryIngredient[]) => void;
  fetchPantry: () => Promise<void>;
  syncPantry: (ingredients: PantryIngredientFormData) => Promise<void>;
};

export type PantryStore = PantryState & PantryActions;

export const initPantryStore = (
  pantryItems?: PantryIngredient[] | null,
): PantryState => ({
  pantryItems: pantryItems ?? [],
  isPantryOpen: false,
  pantryVersion: 1,
});

export const createPantryStore = (initialState: PantryState) => {
  return create<PantryStore>()((set) => ({
    ...initialState,
    addItemToPantry: (item) =>
      set(({ pantryItems, pantryVersion }) => ({
        pantryItems: mergePantryItem(pantryItems, item),
        pantryVersion: pantryVersion + 1,
      })),
    addItems: (items) =>
      set(({ pantryItems }) => ({
        pantryItems: items.reduce(
          (acc, item) => mergePantryItem(acc, item),
          pantryItems,
        ),
      })),
    removeItemFromPantry: (name) =>
      set(({ pantryItems }) => ({
        pantryItems: pantryItems.filter(
          (i) => i.name.toLowerCase() !== name.toLowerCase(),
        ),
      })),
    clearPantry: () => set({ pantryItems: [] }),
    setPantryOpen: (isPantryOpen) => set({ isPantryOpen }),
    setPantryItems: (pantryItems) => set({ pantryItems }),
    fetchPantry: async () => {
      try {
        const { pantryItems } = await tryFetchingPantry();
        set(() => ({ pantryItems }));
      } catch (error) {
        throw new Error("Unable to fetch pantry", {
          cause: error,
        });
      }
    },
    syncPantry: async (ingredients) => {
      try {
        const { pantryItems } = await trySyncingPantry(ingredients);
        set(() => ({ pantryItems }));
      } catch (error) {
        console.error("Failed to sync pantry to DB:", error);
      }
    },
  }));
};

const tryFetchingPantry = async () => {
  try {
    const fetchPantry = await fetch("/api/grocery-list");
    return await fetchPantry.json();
  } catch (error) {
    throw new Error("Unable to fetch grocery lists", { cause: error });
  }
};

const trySyncingPantry = async (ingredients: PantryIngredientFormData) => {
  try {
    const fetchPantry = await fetch("/api/grocery-list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });
    return await fetchPantry.json();
  } catch (error) {
    throw new Error("Unable to fetch grocery lists", { cause: error });
  }
};

// Upsert by ingredientPublicId; pantry items need to exist in master list
const mergePantryItem = (
  items: PantryIngredient[],
  incoming: PantryIngredient,
): PantryIngredient[] => {
  const exists = items.some(
    ({ ingredientPublicId }) =>
      ingredientPublicId?.toLowerCase() ===
      incoming.ingredientPublicId?.toLowerCase(),
  );
  if (exists) return items;
  return [...items, incoming];
};

export type PantryStoreApi = ReturnType<typeof createPantryStore>;