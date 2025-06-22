"use client";
import { Ingredient } from "@/utils/interfaces";
import { Card } from "@/components/ingredients/ingredients-list/card";

export const IngredientsList = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  return (
    <div className={"w-full columns-2 gap-4 rounded-md"}>
      {ingredients.map((ingredient, index) => {
        return <Card key={`${ingredient.name}_${index}`} {...ingredient} />;
      })}
    </div>
  );
};