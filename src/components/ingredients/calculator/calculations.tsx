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
import { Label, Separator } from "radix-ui";
// import { UploadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import FoodPlaceholder from "@/images/food-placeholder.png";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";

export const Calculations = ({
  ingredients,
}: {
  ingredients: Ingredient[];
}) => {
  const [mass, liquidVolume] = useUserStore(
    useShallow(({ mass, liquidVolume }) => [mass, liquidVolume]),
  );

  const uploadFileHandler = (e: any) => {
    console.log(e);
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
        "relative z-1 flex h-1/3 flex-col items-center justify-center gap-y-4 rounded-md bg-purple-600 p-4 text-center text-xl text-white"
      }
    >
      <input
        type={"file"}
        id={"image"}
        className={"invisible absolute h-full w-full"}
        onChange={uploadFileHandler}
      />

      <div className={`${isInProgress ? "h-1/4`" : ""}`}>
        <h1 className={`z-1 text-3xl font-bold ${newName ? "capitalize" : ""}`}>
          {newName ? newName : "Enter an ingredient"}
        </h1>
      </div>

      {isInProgress ? (
        <Separator.Root
          decorative
          orientation="horizontal"
          className={"my-1 h-px w-full bg-white"}
        />
      ) : null}

      <div className={`relative h-full w-full ${isInProgress ? "h-3/4" : ""}`}>
        {/* Price per unit */}
        {formattedPricePerMeasurement && formattedUnit ? (
          <h3 className={""}>
            {`${formattedPricePerMeasurement}/${formattedUnit}`}
          </h3>
        ) : null}

        {/* Price per item */}
        {formattedPricePerItem ? <h3>{formattedPricePerItem} each</h3> : null}

        {/* TODO: if delta is 0%, show 0% */}
        {delta ? (
          <h3 className={"flex flex-row"}>
            <div className={"flex h-full w-full"}>
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

        <Label.Root
          className={"absolute top-0 left-0 h-full w-full cursor-pointer"}
          htmlFor={"image"}
        >
          <Image
            src={FoodPlaceholder}
            alt={"Uploaded Ingredient"}
            className={"z-0 h-full w-full blur-sm"}
          />
          {/*<UploadIcon className={"h-full w-full"} />*/}
        </Label.Root>
      </div>
    </div>
  );
};