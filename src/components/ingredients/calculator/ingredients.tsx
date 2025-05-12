"use client";
import { Label } from "radix-ui";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { UnitSelect } from "@/components/ingredients/calculator/unit-select";
import { useEffect, useMemo, useState } from "react";
import { fetchIngredient } from "@/components/ingredients/calculator/fetch-ingredient";
import { IngredientsList } from "@/components/ingredients/results/ingredients-list";
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

export const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const [fetchedIngredients, setFetchedIngredients] =
    useState<Ingredient[]>(ingredients);

  useEffect(() => {
    if (userInfo) {
      console.log("re-fetched ingredients");
      const response = async () => {
        setFetchedIngredients(await fetchIngredient());
      };
      response().then((r) => r);
    } else {
      console.log("empty ingredients");
      setFetchedIngredients([]);
    }
  }, [userInfo]);

  const methods = useForm<IngredientFormData>({
    defaultValues: {
      name: undefined,
      price: undefined,
      quantity: undefined,
      capacity: undefined,
      unit: undefined,
    },
  });

  const { reset, handleSubmit } = methods;
  const [selectResetKey, setSelectResetKey] = useState<number>(+new Date());

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (data) => {
    await fetch("api/ingredient", {
      method: "POST",
      body: JSON.stringify(data),
    });
    reset();
    setSelectResetKey(+new Date());
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <form
          className={"flex h-full flex-col gap-4"}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <div
            className={
              "flex h-1/3 flex-col items-center justify-center rounded-md bg-purple-600 p-4"
            }
          >
            <CalculatorResults ingredients={fetchedIngredients} />
          </div>
          <CalculatorInputs selectResetKey={selectResetKey} />
        </form>
      </div>

      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <IngredientsList ingredients={fetchedIngredients} />
      </div>
    </FormProvider>
  );
};

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

  const { watch } = useFormContext();

  const [name, price, unit, capacity, quantity] = watch([
    "name",
    "price",
    "unit",
    "capacity",
    "quantity",
  ]);

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
    reset({
      name: "",
      price: "",
      quantity: "",
      capacity: "",
      unit: "",
    });
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