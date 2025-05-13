import { Label } from "radix-ui";
import { useFormContext, useWatch } from "react-hook-form";
import { Ingredient } from "@/utils/interfaces";
import { UnitSelect } from "@/components/ingredients/calculator/unit-select";
import { useMemo } from "react";
import {
  calcIndividualPrice,
  CurrencyFormatter,
  getPercentChange,
  PercentageFormatter,
  priceConverter,
} from "@/utils/textFormatters";
import { Input } from "@/components/ingredients/calculator/inputs";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";

export const CalculatorResults = ({
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

  return (
    <>
      <h1 className={"mb-4 text-3xl font-bold"}>
        {name ? name : "Enter an ingredient"}
      </h1>
      {price || unit ? (
        <h3 className={"mb-4 text-xl"}>
          {formattedPrice}
          {formattedPrice && unit ? "/" : null}
          {unit}
        </h3>
      ) : null}

      {delta ? <h3 className={"mb-4 text-xl"}>{delta}</h3> : null}
      {/* TODO: Upload image */}
    </>
  );
};

export const CalculatorInputs = ({
  selectResetKey,
}: {
  selectResetKey: number;
}) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const { register, reset } = useFormContext();

  const resetHandler = () => {
    reset();
  };

  return (
    <div
      className={
        "flex h-2/3 grid-cols-1 flex-col gap-4 rounded-md bg-purple-300 p-4"
      }
    >
      <div className={"grid grid-cols-1"}>
        <Label.Root className={"text-sm opacity-50"} htmlFor={"name"}>
          Name
        </Label.Root>
        <Input
          placeholder={"Pepsi"}
          id={"name"}
          type={"text"}
          {...register("name")}
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"price"}>
            Price ($)
          </Label.Root>

          <Input
            placeholder={"4.99"}
            id={"price"}
            type={"number"}
            {...register("price", { setValueAs: (val) => val * 100 })}
          />
        </div>

        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"quantity"}>
            (Quantity)
          </Label.Root>

          <Input
            placeholder={"6"}
            id={"quantity"}
            type={"number"}
            {...register("quantity")}
          />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"capacity"}>
            Capacity
          </Label.Root>

          <Input
            placeholder={"0.710"}
            id={"capacity"}
            type={"number"}
            {...register("capacity")}
          />
        </div>

        <div>
          <Label.Root className={"text-md opacity-50"} htmlFor={"unit"}>
            Unit
          </Label.Root>
          <UnitSelect selectKey={selectResetKey} />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <button
            className={
              "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
            }
            onClick={resetHandler}
            type={"reset"}
          >
            Reset
          </button>
        </div>

        {userInfo ? (
          <div>
            <button
              className={
                "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
              }
              type={"submit"}
            >
              Save
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};