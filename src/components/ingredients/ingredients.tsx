"use client";
import { Ingredient } from "@/utils/interfaces";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useState } from "react";
import { fetchIngredient } from "@/utils/server-actions/fetch-ingredient";
import { IngredientsList } from "@/components/ingredients/ingredients-list/ingredients-list";
import { Calculator } from "@/components/ingredients/calculator/calculator";
import { Calculations } from "@/components/ingredients/calculator/calculations";

export const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const [fetchedIngredients, setFetchedIngredients] =
    useState<Ingredient[]>(ingredients);

  useEffect(() => {
    if (!userInfo || ingredients) return;
    fetchIngredient().then(setFetchedIngredients);
  }, [ingredients, userInfo]);

  return (
    <>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <form className={"flex h-full flex-col gap-4"}>
          <Calculations ingredients={fetchedIngredients} />

          <Calculator setFetchedIngredients={setFetchedIngredients} />
        </form>
      </div>

      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <IngredientsList ingredients={fetchedIngredients} />
      </div>
    </>
  );
};