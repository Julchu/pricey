"use client";
// TODO: similar ingredient card to Ingredients card
import { ingredientSetValue } from "@/providers/ingredient-form-provider";
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
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";

export const Card = ({
  ingredient,
  searchedIngredient,
}: {
  ingredient: Ingredient;
  searchedIngredient: IngredientFormData;
}) => {
  const { name, price, quantity, unit, capacity } = ingredient;
  const {
    price: searchPrice,
    quantity: searchQuantity,
    capacity: searchCapacity,
  } = searchedIngredient;

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

  const ingredientPricePerMeasurement = calcIndividualPrice(
    price,
    capacity,
    quantity,
  );
  const searchPricePerMeasurement = calcIndividualPrice(
    searchPrice,
    searchCapacity,
    searchQuantity,
  );

  const formattedPricePerMeasurement = formatCurrency(
    priceConverter(ingredientPricePerMeasurement, unit, userUnits),
  );

  const formattedUnit =
    formattedPricePerMeasurement && unit
      ? `${unitConverter(unit, userUnits)}`
      : "";

  const delta = getPercentChange(
    ingredientPricePerMeasurement,
    searchPricePerMeasurement,
  );

  return (
    <div
      className={
        "mb-4 flex h-full w-full cursor-pointer flex-col items-center gap-y-2 overflow-hidden rounded-md bg-blue-500 p-4 text-center text-lg break-words"
      }
      onClick={cardClickHandler}
    >
      <h1 className={"text-xl font-bold capitalize"}>{name}</h1>

      <h3>{`${formattedPricePerMeasurement}/${formattedUnit}`}</h3>

      {/* TODO: if delta is 0%, show 0% */}
      {delta ? (
        <h3 className={"flex flex-row items-center"}>
          <div className={"flex h-full w-full"}>
            {delta > 0 ? (
              <TriangleUpIcon className={"size-8 text-green-500"} />
            ) : (
              <TriangleDownIcon className={"size-8 text-red-700"} />
            )}
          </div>
          {PercentageFormatter.format(delta)}%
        </h3>
      ) : null}
    </div>
  );
};

/*<dialog open={open} onClose={closeHandler}>
        <form>
          <button
            type="submit"
            aria-label="close"
            formMethod="dialog"
            formNoValidate
          >
            X
          </button>
        </form>
        Ceeeee
      </dialog>*/