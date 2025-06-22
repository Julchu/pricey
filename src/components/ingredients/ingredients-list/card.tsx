"use client";
// TODO: similar ingredient card to Ingredients card
import { Ingredient } from "@/utils/interfaces";
import { ingredientSetValue } from "@/providers/ingredient-form-provider";
import {
  calcIndividualPrice,
  formatCurrency,
  priceConverter,
  unitConverter,
} from "@/utils/text-formatters";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";

export const Card = ({ name, price, quantity, unit, capacity }: Ingredient) => {
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const userUnits = {
    mass,
    volume: liquidVolume,
  };

  const cardClickHandler = () => {
    ingredientSetValue("name", name);
    ingredientSetValue("price", price / 100);
    ingredientSetValue("quantity", quantity);
    ingredientSetValue("unit", unit);
    ingredientSetValue("capacity", capacity);
  };

  const newPricePerMeasurement = calcIndividualPrice(price, capacity, quantity);

  const newPricePerItem = calcIndividualPrice(price, quantity);

  const formattedPricePerItem = formatCurrency(
    priceConverter(newPricePerItem, unit, userUnits),
  );

  const formattedPricePerMeasurement = formatCurrency(
    priceConverter(newPricePerMeasurement, unit, userUnits),
  );

  const formattedUnit =
    formattedPricePerMeasurement && unit
      ? `${unitConverter(unit, userUnits)}`
      : "";

  return (
    <div
      className={
        "mb-4 flex w-full shrink-0 cursor-pointer flex-col flex-wrap justify-center overflow-hidden rounded-md bg-blue-500 p-4 text-center text-xl"
      }
      onClick={cardClickHandler}
    >
      <div className={"text-2xl font-bold capitalize"}>{name}</div>
      <div>{`${formattedPricePerMeasurement}/${formattedUnit}`}</div>
      <div>{`${formattedPricePerItem}`}</div>
    </div>
  );
};