"use client";

import { Ingredient } from "@/utils/interfaces";
import { useIngredientsStore } from "@/stores/ingredients-store";

export const IngredientStoreProvider = ({
  ingredients,
}: {
  ingredients?: Ingredient[] | null;
}) => {
  const setIngredients = useIngredientsStore(
    ({ setIngredients }) => setIngredients,
  );

  if (ingredients) setIngredients(ingredients);
  // useEffect(() => {
  //   if (ingredients) {
  //     setIngredients(ingredients);
  //   }
  // }, [ingredients, setIngredients]);

  return null;
};