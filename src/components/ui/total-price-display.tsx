"use client";

import { useMemo } from "react";
import {
  calcGroceryIngredientPrice,
  formatPrice,
} from "@/utils/text-formatters";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { useUserStore } from "@/providers/user-store-provider";
import { UnitCategory } from "@/utils/interfaces";
import { useShallow } from "zustand/react/shallow";
import { useFormContext, useWatch } from "react-hook-form";

export const TotalPriceDisplay = () => {
  const { control } = useFormContext();
  const ingredients = useWatch({
    control,
    name: "ingredients",
  });

  const masterIngredients = useIngredientsStore(
    ({ ingredients }) => ingredients,
  );
  const { mass, liquidVolume } = useUserStore(
    useShallow(({ mass, liquidVolume }) => ({ mass, liquidVolume })),
  );

  const totalPrice = useMemo(() => {
    const userUnits: UnitCategory = {
      mass,
      volume: liquidVolume,
    };

    return ingredients?.reduce(
      (
        sum: number,
        ingredient: {
          ingredientPublicId?: string;
          capacity?: number;
          quantity?: number;
        },
      ) => {
        const masterIngredient = masterIngredients.find(
          (i) => i.publicId === ingredient.ingredientPublicId,
        );
        const price = calcGroceryIngredientPrice(
          masterIngredient,
          ingredient.capacity || 0,
          ingredient.quantity || 0,
          userUnits,
        );
        return sum + (price || 0);
      },
      0,
    );
  }, [ingredients, masterIngredients, mass, liquidVolume]);

  return (
    <p className={"text-center font-medium"}>
      ${formatPrice(totalPrice) || "0.00"}
    </p>
  );
};