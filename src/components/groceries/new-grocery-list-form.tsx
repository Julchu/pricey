"use client";
import { FormProvider, useForm } from "react-hook-form";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useLens } from "@hookform/lenses";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import * as React from "react";
import { useEffect } from "react";

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

  const { control, register, setFocus } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const lens = useLens({ control });

  return (
    <FormProvider {...methods}>
      <form>
        <AccordionHeader
          className={"flex h-full flex-row gap-4 px-0 text-white"}
        >
          <Input
            className={"bg-blue-500 font-medium focus:outline-none"}
            autoComplete={"name"}
            placeholder={"Enter new grocery list name "}
            id={"name"}
            type={"text"}
            {...register("name")}
          />
          <AccordionTrigger tabIndex={-1} />
        </AccordionHeader>

        <AccordionContent>
          <IngredientArrayForm lens={lens.focus("ingredients")} />
        </AccordionContent>
      </form>
    </FormProvider>
  );
};