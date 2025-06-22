import { Label } from "radix-ui";
import { UnitSelect } from "@/components/ingredients/calculator/unit-select";
import { Input } from "@/components/ingredients/calculator/inputs";
import {
  handleIngredientSubmit,
  ingredientRegister,
  ingredientReset,
} from "@/providers/ingredient-form-provider";
import { SubmitHandler } from "react-hook-form";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { Dispatch, SetStateAction } from "react";

export const Calculator = ({
  setFetchedIngredients,
}: {
  setFetchedIngredients: Dispatch<SetStateAction<Ingredient[]>>;
}) => {
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

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { ingredient } = response;
      setFetchedIngredients((currentIngredients) => {
        const filteredIngredients = currentIngredients.filter(
          (currentIngredient) => currentIngredient.id !== ingredient.id,
        );
        return [...filteredIngredients, ingredient];
      });

      ingredientReset();
    }
  };

  const resetHandler = () => {
    ingredientReset();
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
          autoComplete={"name"}
          placeholder={"Pepsi"}
          id={"name"}
          type={"text"}
          {...ingredientRegister("name")}
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"price"}>
            Price ($)
          </Label.Root>

          <Input
            placeholder={"4.99"}
            step={"0.01"}
            id={"price"}
            type={"number"}
            {...ingredientRegister("price", { setValueAs: (val) => val * 100 })}
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
            {...ingredientRegister("quantity")}
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
            step={"0.001"}
            id={"capacity"}
            type={"number"}
            {...ingredientRegister("capacity")}
          />
        </div>

        <div>
          <Label.Root className={"text-md opacity-50"} htmlFor={"unit"}>
            Unit
          </Label.Root>
          <UnitSelect />
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

        <div>
          <button
            className={
              "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
            }
            onClick={handleIngredientSubmit(onSubmitHandler)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};