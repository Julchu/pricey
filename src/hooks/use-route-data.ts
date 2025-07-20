"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIngredientsStore } from "@/stores/ingredients-store";
import { useGroceryListsStore } from "@/stores/grocery-list-store";

export const useRouteData = () => {
  const pathname = usePathname();
  const { ingredients, fetchIngredients } = useIngredientsStore();
  const { groceryLists, fetchGroceryLists } = useGroceryListsStore();

  useEffect(() => {
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
  }, [
    pathname,
    ingredients.length,
    groceryLists.length,
    fetchIngredients,
    fetchGroceryLists,
  ]);
};
