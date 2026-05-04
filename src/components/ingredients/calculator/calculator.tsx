"use client";
import { Label } from "radix-ui";
import { IngredientUnitSelect } from "@/components/ui/unit-select";
import { Input } from "@/components/ui/input";
import {
  handleIngredientSubmit,
  ingredientRegister,
  ingredientReset,
} from "@/providers/ingredient-form-provider";
import { SubmitHandler } from "react-hook-form";
import { IngredientFormData } from "@/utils/interfaces";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { LabelProps } from "@radix-ui/react-label";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { AnimatedCheckIcon } from "@/components/icons/animated-check-icon";

export const Calculator = () => {
  const updateIngredients = useIngredientsStore(
    ({ updateIngredients }) => updateIngredients,
  );

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (
    ingredientFormData,
  ) => {
    console.log("ingredientFormData", ingredientFormData);
    const submitResponse = await fetch("/api/ingredient", {
      method: "POST",
      body: JSON.stringify(ingredientFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (ingredientFormData.image) {
      URL.revokeObjectURL(ingredientFormData.image);
    }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { ingredient } = response;
      updateIngredients(ingredient);
      ingredientReset();
    }
  };

  const resetHandler = () => {
    ingredientReset();
  };

  return (
    <div
      className={
        "flex h-2/3 grid-cols-1 flex-col gap-4 p-4 text-sm tracking-widest"
      }
    >
      <div>
        <CalculatorLabel htmlFor={"name"}>Name</CalculatorLabel>
        <Input
          autoComplete={"name"}
          placeholder={"Pepsi"}
          id={"name"}
          type={"search"}
          {...ingredientRegister("name")}
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <CalculatorLabel htmlFor={"price"}>Price</CalculatorLabel>
          <div className="flex h-10 items-center rounded-md border border-gray-200 pl-3">
            <span className={"text-gray-400"}>$</span>

            <Input
              className={"border-none"}
              placeholder={"4.99"}
              step={"0.01"}
              id={"price"}
              type={"number"}
              {...ingredientRegister("price", {
                setValueAs: (val) => (val ? val * 100 : ""),
              })}
            />
          </div>
        </div>

        <div>
          <CalculatorLabel htmlFor={"quantity"}>(Quantity)</CalculatorLabel>

          <Input
            placeholder={"1"}
            id={"quantity"}
            type={"number"}
            {...ingredientRegister("quantity", {
              min: 0,
              setValueAs: (val) => (val ? Number(val) : ""),
            })}
          />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <CalculatorLabel htmlFor={"capacity"}>Capacity</CalculatorLabel>

          <Input
            placeholder={"0.710"}
            step={"0.1"}
            min={0}
            id={"capacity"}
            type={"number"}
            {...ingredientRegister("capacity", {
              min: 0,
              setValueAs: (val) => (val ? Number(val) : ""),
            })}
          />
        </div>

        <div>
          <CalculatorLabel htmlFor={"unit"}>Unit</CalculatorLabel>
          <IngredientUnitSelect />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div className={"group"}>
          <button
            className={
              "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-red-500 group-hover:text-white"
            }
            onClick={resetHandler}
            type={"reset"}
          >
            <CircleResetIcon
              className={"fill-blue-500 group-hover:fill-white"}
            />
            Reset
          </button>
        </div>

        <div className={"group"}>
          <button
            className={
              "group-hover:white flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-blue-500 font-medium tracking-widest text-white group-hover:bg-green-500"
            }
            onClick={handleIngredientSubmit(onSubmitHandler)}
          >
            <AnimatedCheckIcon />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const CalculatorLabel = ({ children, className, ...props }: LabelProps) => {
  return (
    <Label.Root
      className={`text-xs font-medium text-black uppercase opacity-50 ${className}`}
      {...props}
    >
      {children}
    </Label.Root>
  );
};