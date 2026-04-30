"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  calcGroceryIngredientPrice,
  formatCurrency,
} from "@/utils/text-formatters";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { useUserStore } from "@/providers/user-store-provider";
import { UnitCategory } from "@/utils/interfaces";
import { useShallow } from "zustand/react/shallow";
import { useFormContext, useWatch } from "react-hook-form";

export const PriceDisplay = ({ index }: { index: number }) => {
  const { control } = useFormContext();
  const [ingredientPublicId, capacity, quantity] = useWatch({
    control,
    name: [
      `ingredients.${index}.ingredientPublicId`,
      `ingredients.${index}.capacity`,
      `ingredients.${index}.quantity`,
    ],
  });

  const ingredients = useIngredientsStore(({ ingredients }) => ingredients);
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const masterIngredient = ingredients.find(
    (i) => i.publicId === ingredientPublicId,
  );

  const derivedPrice = useMemo(() => {
    const userUnits: UnitCategory = {
      mass,
      volume: liquidVolume,
    };
    return calcGroceryIngredientPrice(
      masterIngredient,
      capacity || 0,
      quantity || 0,
      userUnits,
    );
  }, [masterIngredient, capacity, quantity, mass, liquidVolume]);

  return (
    <div className="flex h-10 items-center rounded-md border border-gray-200 pl-3">
      <span className="text-gray-400">$</span>
      <span className="flex-1 px-[15px] text-sm font-medium">
        {formatCurrency(derivedPrice) || "0.00"}
      </span>
    </div>
  );
};