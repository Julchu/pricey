import { useWatch } from "react-hook-form";
import { Ingredient } from "@/utils/interfaces";
import { useMemo } from "react";
import {
  calcIndividualPrice,
  CurrencyFormatter,
  getPercentChange,
  PercentageFormatter,
  priceConverter,
  unitConverter,
} from "@/utils/text-formatters";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { ingredientControl } from "@/providers/ingredient-form-provider";

export const Calculations = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const unitToggles = {
    mass,
    volume: liquidVolume,
  };

  const [name, price, unit, capacity, quantity] = useWatch({
    name: ["name", "price", "unit", "capacity", "quantity"],
    control: ingredientControl,
  });

  const existingIngredient = ingredients.find((ingredient) => {
    if (ingredient.name && name)
      return ingredient.name.toLowerCase() === name.toLowerCase();
  });

  const inputIndividualPrice = calcIndividualPrice(price, capacity, quantity);

  const delta = useMemo(() => {
    if (!existingIngredient) return;

    const existingIndividualPrice = calcIndividualPrice(
      existingIngredient.price,
      existingIngredient.capacity,
      existingIngredient.quantity,
    );

    return PercentageFormatter.format(
      getPercentChange(existingIndividualPrice, inputIndividualPrice),
    );
  }, [existingIngredient, inputIndividualPrice]);

  const formattedPrice = CurrencyFormatter.format(
    priceConverter(inputIndividualPrice / 100, unit, unitToggles),
  );

  const formattedUnit =
    formattedPrice && unit ? `/${unitConverter(unit, unitToggles)}` : null;

  return (
    <>
      <h1 className={"mb-4 text-3xl font-bold"}>
        {name ? name : "Enter an ingredient"}
      </h1>

      {/* Price per unit */}
      {price || unit ? (
        <h3 className={"mb-4 text-xl"}>
          {formattedPrice}
          {formattedUnit}
        </h3>
      ) : null}

      {/* Price per item */}
      {price || unit ? (
        <h3 className={"mb-4 text-xl"}>
          {formattedPrice}
          {formattedUnit}
        </h3>
      ) : null}

      {delta ? <h3 className={"mb-4 text-xl"}>{delta}</h3> : null}
      {/* TODO: Upload image */}
    </>
  );
};