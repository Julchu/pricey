import { Card } from "@/components/results/card";
import { Ingredient } from "@/utils/interfaces";

export const Results = ({
  ingredientList,
}: {
  ingredientList: Ingredient[];
}) => {
  return (
    <div className={"flex h-full w-full flex-col rounded-md bg-gray-400 p-4"}>
      <div>Ingredients</div>

      <div className={"grid h-full w-full grid-cols-2 gap-6 bg-green-700"}>
        {ingredientList.map((ingredient, index) => {
          return <Card key={`${ingredient.name}_${index}`} {...ingredient} />;
        })}
      </div>
    </div>
  );
};