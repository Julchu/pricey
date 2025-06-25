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
import {
  TextAlignJustifyIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import FoodPlaceholder from "@/images/food-placeholder.png";
import { Separator } from "radix-ui";

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
        "relative mb-4 flex h-full w-full cursor-pointer flex-col items-center gap-y-2 overflow-hidden rounded-md bg-blue-500 p-4 text-center text-lg font-medium break-words text-white"
      }
      onClick={cardClickHandler}
    >
      <Image
        src={FoodPlaceholder}
        alt={"Uploaded Ingredient"}
        className={
          "absolute top-0 left-0 z-0 h-full w-full object-none mix-blend-overlay blur-sm"
        }
      />

      <h1 className={"text-xl font-bold capitalize"}>{name}</h1>

      <Separator.Root
        decorative
        orientation="horizontal"
        className={"my-1 h-px w-full bg-white"}
      />

      <h3>{`${formattedPricePerMeasurement}/${formattedUnit}`}</h3>

      {delta !== null ? (
        <div className={"flex flex-row items-center"}>
          {delta > 0 ? (
            <TriangleUpIcon className={"size-8 text-green-500"} />
          ) : delta < 0 ? (
            <TriangleDownIcon className={"size-8 text-red-700"} />
          ) : (
            <TextAlignJustifyIcon className={"size-8 text-gray-500"} />
          )}
          <h3>{PercentageFormatter.format(delta)}%</h3>
        </div>
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
        Test modal
      </dialog>*/