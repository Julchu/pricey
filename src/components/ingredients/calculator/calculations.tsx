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
import {
  ingredientControl,
  ingredientSetValue,
} from "@/providers/ingredient-form-provider";
import { Label, Separator } from "radix-ui";
import {
  ImageIcon,
  TextAlignJustifyIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { ChangeEvent } from "react";

export const Calculations = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const uploadFileHandler = (fileElement: ChangeEvent<HTMLInputElement>) => {
    const file = fileElement.target.files?.[0];
    if (file) {
      ingredientSetValue("image", URL.createObjectURL(file));
    }
  };

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

  const isInProgress = !!(
    newName ||
    newPrice ||
    newUnit ||
    newCapacity ||
    newQuantity
  );

  return (
    <div
      className={
        "relative flex h-1/3 flex-col items-center justify-center gap-y-4 rounded-md bg-purple-600 p-4 text-center text-xl font-medium text-white"
      }
    >
      <div className={`${isInProgress ? "h-1/4`" : ""} z-1`}>
        <h1 className={`text-3xl font-bold capitalize`}>
          {newName ? newName : "Enter an ingredient"}
        </h1>
      </div>

      <input
        type={"file"}
        id={"image"}
        className={"invisible absolute h-full w-full"}
        onChange={uploadFileHandler}
      />

      <Label.Root
        className={"absolute h-full w-full cursor-pointer"}
        htmlFor={"image"}
      >
        <div className={"absolute right-0 bottom-0 m-4 flex flex-row"}>
          <ImageIcon className={"size-6"} />
          <UploadIcon className={"size-6"} />
        </div>
        {/*<Image*/}
        {/*  src={ImageUploadIcon}*/}
        {/*  alt={"Uploaded Ingredient"}*/}
        {/*  className={*/}
        {/*    "absolute right-0 bottom-0 z-0 m-4 size-1/8 object-contain"*/}
        {/*  }*/}
        {/*/>*/}
      </Label.Root>

      {isInProgress ? (
        <Separator.Root
          decorative
          orientation="horizontal"
          className={"my-1 h-px w-full bg-white"}
        />
      ) : null}

      {isInProgress ? (
        <div className={`z-1 flex h-3/4 flex-col gap-2`}>
          {/* Price per unit */}
          {formattedPricePerMeasurement && formattedUnit ? (
            <h3>{`${formattedPricePerMeasurement}/${formattedUnit}`}</h3>
          ) : null}

          {/* Price per item */}
          {formattedPricePerItem ? <h3>{formattedPricePerItem} each</h3> : null}

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
      ) : null}
    </div>
  );
};