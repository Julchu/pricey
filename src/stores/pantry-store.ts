import { create } from "zustand";
import { PantryIngredient } from "@/utils/interfaces";

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
  syncPantry: (items: PantryIngredient[]) => Promise<void>;
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
        const res = await fetch("/api/pantry");
        const { pantryItems } = await res.json();
        set({ pantryItems: pantryItems ?? [] });
      } catch (error) {
        throw new Error("Unable to fetch pantry", { cause: error });
      }
    },
    syncPantry: async (items) => {
      try {
        await fetch("/api/pantry", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pantryItems: items }),
        });
      } catch (error) {
        console.error("Failed to sync pantry to DB:", error);
      }
    },
  }));
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