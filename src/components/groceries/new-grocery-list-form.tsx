"use client";
import { FormProvider, useForm } from "react-hook-form";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useLens } from "@hookform/lenses";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ingredients/calculator/inputs";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import * as React from "react";
// TODO: test if can remove * as React

export const NewGroceryListForm = () => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: {
      name: undefined,
      ingredients: [
        {
          name: "",
          price: 0,
          capacity: 0,
          unit: "" as UnitType,
        },
      ],
      public: undefined,
    },
  });

  const { handleSubmit, control, register } = methods;

  const lens = useLens({ control });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((values) => console.log(values))}>
        <AccordionTrigger>
          <Input
            className={"w-full"}
            autoComplete={"name"}
            placeholder={"Costco Run"}
            id={"name"}
            type={"text"}
            {...register("name")}
          />
        </AccordionTrigger>

        <AccordionContent className={"h-full w-full"}>
          <IngredientArrayForm lens={lens.focus("ingredients")} />
          <input type="submit" />
        </AccordionContent>
      </form>
    </FormProvider>
  );
};