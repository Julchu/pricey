"use client";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useState } from "react";
import { fetchIngredient } from "@/utils/server-actions/fetch-ingredient";
import { SubmitHandler } from "react-hook-form";
import { IngredientsList } from "@/components/ingredients/ingredients/ingredients-list";
import { Calculator } from "@/components/ingredients/calculator/calculator";
import { Calculations } from "@/components/ingredients/calculator/calculations";
import {
  handleIngredientSubmit,
  ingredientReset,
} from "@/providers/ingredient-form-provider";

export const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const [fetchedIngredients, setFetchedIngredients] =
    useState<Ingredient[]>(ingredients);

  useEffect(() => {
    if (!userInfo || ingredients) return;
    fetchIngredient().then(setFetchedIngredients);
  }, [ingredients, userInfo]);

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (data) => {
    await fetch("/api/ingredient", {
      method: "POST",
      body: JSON.stringify(data),
    });

    ingredientReset();
  };

  return (
    <>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <form
          className={"flex h-full flex-col gap-4"}
          onSubmit={handleIngredientSubmit(onSubmitHandler)}
        >
          <div
            className={
              "flex h-1/3 flex-col items-center justify-center rounded-md bg-purple-600 p-4"
            }
          >
            <Calculations ingredients={fetchedIngredients} />
          </div>
          <Calculator />
        </form>
      </div>

      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <IngredientsList ingredients={fetchedIngredients} />
      </div>
    </>
  );
};