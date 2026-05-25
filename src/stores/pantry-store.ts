import { create } from "zustand";
import { PantryItem } from "@/utils/interfaces";

export type PantryState = {
  pantryItems: PantryItem[];
  isPantryOpen: boolean;
};

export type PantryActions = {
  addItemToPantry: (item: PantryItem) => void;
  addItems: (items: PantryItem[]) => void;
  removeItemFromPantry: (name: string) => void;
  clearPantry: () => void;
  setPantryOpen: (open: boolean) => void;
  setPantryItems: (items: PantryItem[]) => void;
  fetchPantry: () => Promise<void>;
  syncPantry: (items: PantryItem[]) => Promise<void>;
};

export type PantryStore = PantryState & PantryActions;

export const initPantryStore = (
  pantryItems?: PantryItem[] | null,
): PantryState => ({
  pantryItems: pantryItems ?? [],
  isPantryOpen: false,
});

export const createPantryStore = (initialState: PantryState) => {
  return create<PantryStore>()((set) => ({
    ...initialState,
    addItemToPantry: (item) =>
      set(({ pantryItems }) => ({
        pantryItems: mergePantryItem(pantryItems, item),
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

// Upsert by name (case-insensitive) — skip if already present
const mergePantryItem = (
  items: PantryItem[],
  incoming: PantryItem,
): PantryItem[] => {
  const exists = items.some(
    (i) => i.name.toLowerCase() === incoming.name.toLowerCase(),
  );
  if (exists) return items;
  return [...items, incoming];
};

export type PantryStoreApi = ReturnType<typeof createPantryStore>;