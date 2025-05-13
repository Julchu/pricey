"use client";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { useUserStore } from "@/stores/user-store";
import { useEffect, useState } from "react";
import { fetchIngredient } from "@/components/ingredients/calculator/fetch-ingredient";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IngredientsList } from "@/components/ingredients/ingredients/ingredients-list";
import {
  CalculatorInputs,
  CalculatorResults,
} from "@/components/ingredients/calculator/calculator";

export const Ingredients = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const [fetchedIngredients, setFetchedIngredients] =
    useState<Ingredient[]>(ingredients);

  useEffect(() => {
    if (userInfo) {
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