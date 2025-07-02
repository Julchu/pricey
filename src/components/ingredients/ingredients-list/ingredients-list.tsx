"use client";
import { Ingredient } from "@/utils/interfaces";
import { useWatch } from "react-hook-form";
import { ingredientControl } from "@/providers/ingredient-form-provider";
import { Card } from "@/components/ingredients/ingredients-list/card";
import { useDebouncedState } from "@/app/hooks/use-debounced-state";

export const IngredientsList = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [searchName, searchPrice, searchQuantity, searchUnit, searchCapacity] =
    useWatch({
      name: ["name", "price", "quantity", "unit", "capacity"],
      control: ingredientControl,
    });

  const debouncedSearchName = useDebouncedState(searchName, 100);
  const debouncedSearchPrice = useDebouncedState(searchPrice, 100);
  const debouncedSearchQuantity = useDebouncedState(searchQuantity, 100);
  const debouncedSearchCapacity = useDebouncedState(searchCapacity, 100);
  const debouncedSearchUnit = useDebouncedState(searchUnit, 100);

  const searchedIngredient = {
    name: debouncedSearchName,
    price: debouncedSearchPrice,
    quantity: debouncedSearchQuantity,
    unit: debouncedSearchUnit,
    capacity: debouncedSearchCapacity,
  };

  const filteredIngredients = ingredients.filter((ingredient) => {
    return (
      !debouncedSearchName ||
      debouncedSearchName
        .split("")
        .every((letter) =>
          ingredient.name.toLowerCase().includes(letter.toLowerCase()),
        )
    );
  });

  if (ingredients.length === 0)
    return (
      <div className={"flex h-full flex-col gap-4"}>
        <div
          className={
            "flex h-1/3 flex-col justify-center p-4 text-center font-medium"
          }
        >
          <h1 className={`text-3xl font-bold capitalize`}>Add ingredients</h1>
        </div>
        <div className={"flex h-2/3"} />
      </div>
    );

  return (
    <div className={"columns-2 gap-4 rounded-md"}>
      {filteredIngredients.map((ingredient, index) => {
        return (
          <Card
            key={`${ingredient.name}_${index}`}
            ingredient={ingredient}
            searchedIngredient={searchedIngredient}
          />
        );
      })}
    </div>
  );
};