import { create } from "zustand";
import {
  GroceryList,
  GroceryListFormData,
  GroceryListIngredientFormData,
} from "@/utils/interfaces";
import { persist } from "zustand/middleware";
import { mergeIngredients } from "@/utils/merge-ingredients";

export type GroceryListsState = {
  groceryLists: GroceryList[];
  currentGroceryList: GroceryListFormData | null;
  currentGroceryListVersion: number;
  hasHydrated: boolean;
};

export type GroceryListsActions = {
  setGroceryLists: (groceryLists: GroceryList[]) => void;
  addGroceryList: (newGroceryList: GroceryList) => void;
  clearGroceryLists: () => void;
  fetchGroceryLists: () => void;
  updateGroceryList: (groceryList: GroceryList) => void;
  removeGroceryList: (groceryListId: string) => void;
  setCurrentGroceryList: (groceryList: GroceryListFormData | null) => void;
  clearCurrentGroceryList: () => void;
  addIngredientsToCurrentList: (
    ingredients: GroceryListIngredientFormData[],
  ) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export type GroceryListsStore = GroceryListsState & GroceryListsActions;

export const initGroceryListsStore = (
  groceryLists?: GroceryList[] | null,
): GroceryListsState => {
  return {
    // TODO: Zod validation on grocery lists
    groceryLists: groceryLists && groceryLists.length > 0 ? groceryLists : [],
    currentGroceryList: null,
    currentGroceryListVersion: 1,
    hasHydrated: false,
  };
};

export const createGroceryListsStore = (initialState: GroceryListsState) => {
  return create<GroceryListsStore>()(
    persist(
      (set) => ({
        ...initialState,
        setGroceryLists: (groceryLists) => set({ groceryLists }),
        addGroceryList: (newGroceryList) =>
          set(({ groceryLists }) => ({
            groceryLists: [...groceryLists, newGroceryList],
          })),
        clearGroceryLists: () => set({ groceryLists: [] }),
        fetchGroceryLists: async () => {
          try {
            const { groceryLists } = await tryFetchingGroceryLists();
            set(() => ({ groceryLists }));
          } catch (error) {
            throw new Error("Unable to retrieve grocery lists", {
              cause: error,
            });
          }
        },
        updateGroceryList: (existingGroceryList) => {
          set(({ groceryLists }) => ({
            groceryLists: groceryLists.map((groceryList) =>
              groceryList.publicId === existingGroceryList.publicId
                ? existingGroceryList
                : groceryList,
            ),
          }));
        },
        removeGroceryList: (groceryListId) =>
          set(({ groceryLists }) => ({
            groceryLists: groceryLists.filter(
              (groceryList) => groceryList.publicId !== groceryListId,
            ),
          })),
        setCurrentGroceryList: (groceryList: GroceryListFormData | null) =>
          set({ currentGroceryList: groceryList }),
        clearCurrentGroceryList: () => set({ currentGroceryList: null }),
        addIngredientsToCurrentList: (ingredients) =>
          set(({ currentGroceryList, currentGroceryListVersion }) => {
            if (!currentGroceryList) {
              return {
                currentGroceryList: {
                  name: "",
                  ingredients,
                  public: false,
                },
                currentGroceryListVersion: currentGroceryListVersion + 1,
              };
            }
            return {
              currentGroceryList: {
                ...currentGroceryList,
                ingredients: mergeIngredients(
                  currentGroceryList.ingredients,
                  ingredients,
                ),
              },
              currentGroceryListVersion: currentGroceryListVersion + 1,
            };
          }),
        setHasHydrated: (hasHydrated: boolean) => {
          set({ hasHydrated });
        },
      }),
      {
        name: "current-grocery-list",
        partialize: ({ currentGroceryList }) => ({
          currentGroceryList,
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

const tryFetchingGroceryLists = async () => {
  try {
    const fetchGroceryLists = await fetch("/api/grocery-list");
    return await fetchGroceryLists.json();
  } catch (error) {
    throw new Error("Unable to fetch grocery lists", { cause: error });
  }
};

export type GroceryListsStoreApi = ReturnType<typeof createGroceryListsStore>;
