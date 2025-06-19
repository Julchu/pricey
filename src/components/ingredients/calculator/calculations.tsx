import { useWatch } from "react-hook-form";
import { Ingredient } from "@/utils/interfaces";
import {
  calcIndividualPrice,
  formatCurrency,
  getPercentChange,
  PercentageFormatter,
  priceConverter,
  unitConverter,
} from "@/utils/text-formatters";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { ingredientControl } from "@/providers/ingredient-form-provider";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";

export const Calculations = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const userUnits = {
    mass,
    volume: liquidVolume,
  };

  const [newName, newPrice, newUnit, newCapacity, newQuantity] = useWatch({
    name: ["name", "price", "unit", "capacity", "quantity"],
    control: ingredientControl,
  });

  const newPricePerMeasurement = calcIndividualPrice(
    newPrice,
    newCapacity,
    newQuantity,
  );

  const newPricePerItem = calcIndividualPrice(newPrice, newQuantity);

  const formattedPricePerItem = formatCurrency(
    priceConverter(newPricePerItem, newUnit, userUnits),
  );

  const existingIngredient = ingredients.find((ingredient) => {
    if (ingredient.name && newName)
      return ingredient.name.toLowerCase() === newName.toLowerCase();
  });

  const existingPricePerMeasurement = calcIndividualPrice(
    existingIngredient?.price,
    existingIngredient?.capacity,
    existingIngredient?.quantity,
  );

  const delta = getPercentChange(
    existingPricePerMeasurement,
    newPricePerMeasurement,
  );

  const formattedPricePerMeasurement = formatCurrency(
    priceConverter(newPricePerMeasurement, newUnit, userUnits),
  );

  const formattedUnit =
    formattedPricePerMeasurement && newUnit
      ? `${unitConverter(newUnit, userUnits)}`
      : null;

  return (
    <div
      className={
        "flex h-1/3 flex-col items-center justify-center rounded-md bg-purple-600 p-4"
      }
    >
      <h1 className={"mb-4 text-center text-3xl font-bold"}>
        {newName ? newName : "Enter an ingredient"}
      </h1>

      {/* Price per unit */}
      {formattedPricePerMeasurement && formattedUnit ? (
        <h3 className={"mb-4 text-xl"}>
          {`${formattedPricePerMeasurement}/${formattedUnit}`}
        </h3>
      ) : null}

      {/* Price per item */}
      {formattedPricePerItem ? (
        <h3 className={"mb-4 text-xl"}>{formattedPricePerItem} each</h3>
      ) : null}

      {delta ? (
        <h3 className={"mb-4 flex flex-row text-xl"}>
          <div className={"flex h-full w-full items-center"}>
            {delta > 0 ? (
              <TriangleUpIcon className={"size-full text-green-500"} />
            ) : (
              <TriangleDownIcon className={"size-full text-red-700"} />
            )}
          </div>
          {PercentageFormatter.format(delta)}%
        </h3>
      ) : null}
      {/* TODO: Upload image */}
    </div>
  );
};