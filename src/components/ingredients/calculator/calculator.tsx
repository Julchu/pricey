"use client";
import { Label } from "radix-ui";
import { UnitSelect } from "@/components/ui/unit-select";
import { Input } from "@/components/ingredients/calculator/inputs";
import {
  handleIngredientSubmit,
  ingredientControl,
  ingredientRegister,
  ingredientReset,
} from "@/providers/ingredient-form-provider";
import { SubmitHandler } from "react-hook-form";
import { IngredientFormData } from "@/utils/interfaces";
import { CheckCircledIcon, ResetIcon } from "@radix-ui/react-icons";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { LabelProps } from "@radix-ui/react-label";

export const Calculator = () => {
  const updateIngredients = useIngredientsStore(
    ({ updateIngredients }) => updateIngredients,
  );

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (
    ingredientFormData,
  ) => {
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
        "flex h-2/3 grid-cols-1 flex-col gap-4 rounded-md bg-blue-500 p-4 text-sm"
      }
    >
      <div className={"grid grid-cols-1"}>
        <CalculatorLabel htmlFor={"name"}>Name</CalculatorLabel>
        <Input
          autoComplete={"name"}
          placeholder={"Pepsi"}
          id={"name"}
          type={"text"}
          {...ingredientRegister("name")}
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <CalculatorLabel htmlFor={"price"}>Price ($)</CalculatorLabel>

          <Input
            placeholder={"4.99"}
            step={"0.01"}
            id={"price"}
            type={"number"}
            {...ingredientRegister("price", { setValueAs: (val) => val * 100 })}
          />
        </div>

        <div>
          <CalculatorLabel htmlFor={"quantity"}>(Quantity)</CalculatorLabel>

          <Input
            placeholder={"6"}
            id={"quantity"}
            type={"number"}
            {...ingredientRegister("quantity")}
          />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <CalculatorLabel htmlFor={"capacity"}>Capacity</CalculatorLabel>

          <Input
            placeholder={"0.710"}
            step={"0.001"}
            id={"capacity"}
            type={"number"}
            {...ingredientRegister("capacity")}
          />
        </div>

        <div>
          <CalculatorLabel htmlFor={"unit"}>Unit</CalculatorLabel>
          <UnitSelect control={ingredientControl} />
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
            <ResetIcon />
            Reset
          </button>
        </div>

        <div>
          <button
            className={
              "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
            }
            onClick={handleIngredientSubmit(onSubmitHandler)}
          >
            <CheckCircledIcon />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const CalculatorLabel = ({ children, className, ...props }: LabelProps) => {
  return (
    <Label.Root className={`font-medium text-white ${className}`} {...props}>
      {children}
    </Label.Root>
  );
};