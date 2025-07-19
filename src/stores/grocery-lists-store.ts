import { create } from "zustand";
import { GroceryList } from "@/utils/interfaces";

export type GroceryListsState = {
  groceryLists: GroceryList[];
};

export type GroceryListsActions = {
  setGroceryLists: (groceryLists: GroceryList[]) => void;
  clearGroceryLists: () => void;
  fetchGroceryLists: () => void;
};

export type GroceryListsStore = GroceryListsState & GroceryListsActions;

export const initGroceryListsStore = (
  groceryLists?: GroceryList[],
): GroceryListsState => {
  return {
    groceryLists: groceryLists && groceryLists.length > 0 ? groceryLists : [],
  };
};

export const defaultInitState: GroceryListsState = {
  groceryLists: [],
};

export const useGroceryListsStore = create<GroceryListsStore>((set) => ({
  ...defaultInitState,
  setGroceryLists: (groceryLists) => set({ groceryLists }),
  clearGroceryLists: () => set({ groceryLists: [] }),
  fetchGroceryLists: async () => {
    try {
      const { groceryLists } = await tryFetchingGroceryLists();
      set(() => ({ groceryLists }));
    } catch (error) {
      throw new Error("Unable to retrieve grocery lists", { cause: error });
    }
  },
}));

const tryFetchingGroceryLists = async () => {
  try {
    const fetchGroceryLists = await fetch("/api/groceries");
    return await fetchGroceryLists.json();
  } catch (error) {
    throw new Error("Unable to fetch grocery lists", { cause: error });
  }
};