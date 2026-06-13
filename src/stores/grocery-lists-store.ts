import { create } from "zustand";
import {
  ChecklistData,
  GroceryList,
  GroceryListFormData,
  GroceryListIngredientFormData,
} from "@/utils/interfaces";
import { persist } from "zustand/middleware";
import { mergeIngredients } from "@/utils/merge-ingredients";

export type GroceryListsState = {
  groceryLists: GroceryList[];
  checklist: ChecklistData | null;
  newGroceryList: GroceryListFormData | null;
  newGroceryListVersion: number;
  hasHydrated: boolean;
};

export type GroceryListsActions = {
  setGroceryLists: (groceryLists: GroceryList[]) => void;
  addGroceryList: (newGroceryList: GroceryList) => void;
  clearGroceryLists: () => void;
  fetchGroceryLists: () => void;
  updateGroceryList: (groceryList: GroceryList) => void;
  removeGroceryList: (groceryListId: string) => void;
  setChecklist: (checklistData: ChecklistData) => void;
  updateChecklist: (ingredientPublicId: string) => void;
  clearChecklist: () => void;
  setNewGroceryList: (groceryList: GroceryListFormData | null) => void;
  clearNewGroceryList: () => void;
  addIngredientsToNewList: (
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
    checklist: null,
    newGroceryList: null,
    newGroceryListVersion: 1,
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
        setChecklist: (checklistData) => set({ checklist: checklistData }),
        clearChecklist: () => set({ checklist: null }),
        setNewGroceryList: (groceryList) =>
          set({ newGroceryList: groceryList }),
        updateChecklist: (ingredientPublicId) => {
          set(({ checklist }) => {
            if (checklist) {
              return {
                checklist: {
                  ...checklist,
                  ingredients: {
                    ...checklist.ingredients,
                    [ingredientPublicId]:
                      !checklist.ingredients[ingredientPublicId],
                  },
                },
              };
            }

            return { checklist };
          });
        },
        clearNewGroceryList: () => set({ newGroceryList: null }),
        addIngredientsToNewList: (ingredients) =>
          set(({ newGroceryList, newGroceryListVersion }) => {
            if (!newGroceryList) {
              return {
                newGroceryList: {
                  name: "",
                  ingredients,
                  public: false,
                },
                newGroceryListVersion: newGroceryListVersion + 1,
              };
            }
            return {
              newGroceryList: {
                ...newGroceryList,
                ingredients: mergeIngredients(
                  newGroceryList.ingredients,
                  ingredients,
                ),
              },
              newGroceryListVersion: newGroceryListVersion + 1,
            };
          }),
        setHasHydrated: (hasHydrated: boolean) => {
          set({ hasHydrated });
        },
      }),
      {
        name: "local-grocery-lists",
        partialize: ({ newGroceryList, checklist }) => ({
          newGroceryList,
          checklist,
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