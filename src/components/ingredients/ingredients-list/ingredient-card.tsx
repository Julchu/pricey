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
import { useShallow } from "zustand/react/shallow";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import {
  TextAlignJustifyIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import FoodPlaceholder from "@/images/food-placeholder.png";
import { memo } from "react";
import { useUserStore } from "@/providers/user-store-provider";
import { Separator } from "@base-ui/react/separator";
import { usePantryStore } from "@/providers/pantry-store-provider";
import { ContextMenu } from "@base-ui/react/context-menu";

export const CardComponent = ({
  ingredient,
  searchedIngredient,
}: {
  ingredient: Ingredient;
  searchedIngredient: Partial<IngredientFormData>;
}) => {
  const { name, price, quantity, unit, capacity } = ingredient;

  const {
    price: searchPrice,
    quantity: searchQuantity,
    unit: searchUnit,
    capacity: searchCapacity,
  } = searchedIngredient;

  const { mass, liquidVolume } = useUserStore(
    useShallow(({ mass, liquidVolume }) => ({ mass, liquidVolume })),
  );

  const addItemToPantry = usePantryStore(
    ({ addItemToPantry }) => addItemToPantry,
  );

  const userUnits = {
    mass,
    volume: liquidVolume,
  };

  const ingredientDeleteHandler = () => {
    return;
  };

  const ingredientEditHandler = () => {
    ingredientSetValue("name", name);
    if (price) ingredientSetValue("price", price / 100);
    ingredientSetValue("quantity", quantity);
    ingredientSetValue("unit", unit);
    ingredientSetValue("capacity", capacity);
  };

  const ingredientPricePerCapacity = calcIndividualPrice(
    price,
    capacity,
    quantity,
  );

  const ingredientPricePerMeasurement = priceConverter(
    ingredientPricePerCapacity,
    unit,
    userUnits,
  );

  const searchPricePerCapacity = calcIndividualPrice(
    searchPrice,
    searchCapacity,
    searchQuantity,
  );

  const searchPricePerMeasurement = priceConverter(
    searchPricePerCapacity,
    searchUnit,
    userUnits,
  );

  const formattedPricePerMeasurement = formatCurrency(
    ingredientPricePerMeasurement,
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
    <ContextMenu.Root>
      <ContextMenu.Trigger
        className={
          "relative mb-4 flex h-full w-full flex-col items-center gap-y-2 overflow-hidden rounded-md bg-blue-500 text-center text-lg font-medium break-words text-white"
        }
      >
        <Image
          src={FoodPlaceholder}
          alt={"Uploaded Ingredient"}
          className={
            "absolute top-0 left-0 z-0 h-full w-full object-contain mix-blend-overlay blur-sm"
          }
        />

        <div className={"relative z-1 flex w-full flex-row px-4 pt-4"}>
          <h1 className={"w-full text-xl font-bold capitalize"}>{name}</h1>
        </div>

        <Separator className={"my-1 h-px w-full border-none bg-white"} />

        <div className={"px-4 pb-4"}>
          <h3>{`${formattedPricePerMeasurement}/${formattedUnit}`}</h3>

          {delta !== null ? (
            <div className={"flex flex-row items-center"}>
              {delta > 0 ? (
                <TriangleUpIcon className={"size-8 text-green-500"} />
              ) : delta < 0 ? (
                <TriangleDownIcon className={"size-8 text-red-700"} />
              ) : (
                <TextAlignJustifyIcon className={"size-8 text-gray-400"} />
              )}
              <h3>{PercentageFormatter.format(delta)}%</h3>
            </div>
          ) : null}
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner
          className="outline-hidden"
          side={"inline-start"}
          sideOffset={8}
        >
          <ContextMenu.Popup
            className={
              // "data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-up-and-fade data-[side=top]:animate-slide-right-and-fade z-2 rounded-md bg-white p-1 tracking-widest shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] select-none"
              "relative origin-(--transform-origin) cursor-pointer gap-4 rounded-md bg-white p-1 py-1 tracking-widest shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none"
            }
          >
            <ContextMenu.Item
              className={
                "text-md relative flex h-[25px] items-center rounded-md p-4 leading-none outline-none data-highlighted:bg-blue-500 data-highlighted:text-white"
              }
              onClick={() => addItemToPantry(ingredient)}
            >
              Add to pantry
            </ContextMenu.Item>
            <ContextMenu.Item
              className={
                "text-md relative flex h-[25px] items-center rounded-md p-4 leading-none outline-none data-highlighted:bg-blue-500 data-highlighted:text-white"
              }
              onClick={ingredientEditHandler}
            >
              Edit ingredient
            </ContextMenu.Item>
            <ContextMenu.Item
              className={
                "text-md relative flex h-[25px] items-center rounded-md p-4 leading-none outline-none data-highlighted:bg-blue-500 data-highlighted:text-white"
              }
              onClick={ingredientDeleteHandler}
            >
              Delete ingredient
            </ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export const IngredientCard = memo(CardComponent);

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