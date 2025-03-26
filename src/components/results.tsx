import { FC } from "react";
import { Card, IngredientsFetch } from "@/components/card";

export const Results: FC = async () => {
  const ingredientList = await fetch("https://swapi.py4e.com/api/vehicles/");
  const { results: fetchedIngredients }: IngredientsFetch =
    await ingredientList.json();

  return (
    <div className={"flex h-full flex-col bg-gray-400"}>
      <div>Ingredients</div>

      <div
        className={"grid h-full grid-cols-2 gap-6 overflow-auto bg-green-700"}
      >
        {fetchedIngredients.map((ingredient, index) => {
          return <Card key={`${ingredient.name}_${index}`} {...ingredient} />;
        })}
      </div>
    </div>
  );
};