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

  const [ingredients, fetchIngredients] = useIngredientsStore(
    useShallow(({ ingredients, fetchIngredients }) => [
      ingredients,
      fetchIngredients,
    ]),
  );
  const [groceryLists, fetchGroceryLists] = useGroceryListsStore(
    useShallow(({ groceryLists, fetchGroceryLists }) => [
      groceryLists,
      fetchGroceryLists,
    ]),
  );
  const [recipes, fetchRecipes] = useRecipesStore(
    useShallow(({ recipes, fetchRecipes }) => [recipes, fetchRecipes]),
  );

  useEffect(() => {
    // Early return if user is not authenticated
    if (!userInfo) return;

    // Only fetch if data is not already loaded
    if (pathname === "/" || pathname.includes("/ingredients")) {
      if (ingredients.length === 0) {
        fetchIngredients();
      }
    }

    if (pathname.includes("/groceries")) {
      if (groceryLists.length === 0) {
        fetchGroceryLists();
      }
    }

    if (pathname.includes("/recipes")) {
      if (recipes.length === 0) {
        fetchRecipes();
      }
    }
  }, [
    userInfo,
    pathname,
    ingredients.length,
    groceryLists.length,
    recipes.length,
    fetchIngredients,
    fetchGroceryLists,
    fetchRecipes,
  ]);

  return null;
};
