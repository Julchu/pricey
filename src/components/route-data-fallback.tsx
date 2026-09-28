"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { useShallow } from "zustand/react/shallow";
import { useUserStore } from "@/providers/user-store-provider";

export const RouteDataFallback = () => {
  const pathname = usePathname();
  const userInfo = useUserStore(({ userInfo }) => userInfo);

  const [ingredientsLoadState, fetchIngredients] = useIngredientsStore(
    useShallow(({ ingredientsLoadState, fetchIngredients }) => [
      ingredientsLoadState,
      fetchIngredients,
    ]),
  );
  const [groceryListsLoadState, fetchGroceryLists] = useGroceryListsStore(
    useShallow(({ groceryListsLoadState, fetchGroceryLists }) => [
      groceryListsLoadState,
      fetchGroceryLists,
    ]),
  );
  const [recipesLoadState, fetchRecipes] = useRecipesStore(
    useShallow(({ recipesLoadState, fetchRecipes }) => [
      recipesLoadState,
      fetchRecipes,
    ]),
  );

  useEffect(() => {
    // Early return if user is not authenticated
    if (!userInfo) return;

    // Idle means this collection has not been loaded yet.
    if (pathname === "/" || pathname.includes("/ingredients")) {
      if (ingredientsLoadState === "idle") {
        void fetchIngredients();
      }
    }

    if (pathname.includes("/groceries")) {
      if (groceryListsLoadState === "idle") {
        void fetchGroceryLists();
      }
    }

    if (pathname.includes("/recipes")) {
      if (recipesLoadState === "idle") {
        void fetchRecipes();
      }
    }
  }, [
    userInfo,
    pathname,
    ingredientsLoadState,
    groceryListsLoadState,
    recipesLoadState,
    fetchIngredients,
    fetchGroceryLists,
    fetchRecipes,
  ]);

  return null;
};
