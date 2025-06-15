import { Card } from "@/components/ingredients/ingredients-list/card";
import { Ingredient } from "@/utils/interfaces";

export const IngredientsList = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  return (
    <div className={"flex h-full w-full flex-col rounded-md bg-gray-400 p-4"}>
      <div>Ingredients</div>

      <div className={"grid h-full w-full grid-cols-2 gap-6 bg-green-700"}>
        {ingredients.map((ingredient, index) => {
          return <Card key={`${ingredient.name}_${index}`} {...ingredient} />;
        })}
      </div>
    </div>
  );
};