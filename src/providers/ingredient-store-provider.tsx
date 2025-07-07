"use client";

import { Ingredient } from "@/utils/interfaces";
import { useIngredientsStore } from "@/stores/ingredients-store";
import { useEffect } from "react";

export const IngredientStoreProvider = ({
  ingredients,
}: {
  ingredients?: Ingredient[] | null;
}) => {
  const setIngredients = useIngredientsStore(
    ({ setIngredients }) => setIngredients,
  );

  useEffect(() => {
    if (ingredients) {
      setIngredients(ingredients);
    }
  }, [ingredients, setIngredients]);

  return null;
};