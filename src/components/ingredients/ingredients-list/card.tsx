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
        "h-1/4 rounded-md border-2 border-amber-50 bg-red-900 text-center"
      }
      onClick={cardClickHandler}
    >
      <div className={"text-3xl"}>{name}</div>
      <div className={"text-xl"}>
        {`${formattedPricePerMeasurement}/${formattedUnit}`}
      </div>
      <div className={"text-xl"}>{`${formattedPricePerItem}`}</div>
    </div>
  );
};