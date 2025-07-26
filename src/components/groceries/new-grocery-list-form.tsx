"use client";
import { FormProvider, useForm } from "react-hook-form";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useLens } from "@hookform/lenses";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ingredients/calculator/inputs";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import * as React from "react";
import { useEffect } from "react";
import { SaveCartIcon } from "@/components/icons/cart/save-cart-icon";

export const NewGroceryListForm = () => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: {
      name: undefined,
      ingredients: [
        {
          name: "",
          price: "" as unknown as number,
          capacity: "" as unknown as number,
          unit: "" as UnitType,
        },
      ],
      public: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    register,
    setFocus,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const lens = useLens({ control });

  return (
    <FormProvider {...methods}>
      <form>
        <AccordionHeader className={"flex h-full w-full flex-row gap-4 pl-4"}>
          <Input
            className={"w-full focus:outline-none"}
            autoComplete={"name"}
            placeholder={"Enter new grocery list name "}
            id={"name"}
            type={"text"}
            {...register("name")}
          />
          <div
            onClick={handleSubmit((values) => console.log(values))}
            className={"flex items-center"}
          >
            {isDirty ? <SaveCartIcon /> : null}
          </div>
          <AccordionTrigger />
        </AccordionHeader>

        <AccordionContent>
          <IngredientArrayForm lens={lens.focus("ingredients")} />
        </AccordionContent>
      </form>
    </FormProvider>
  );
};