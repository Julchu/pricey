"use client";
import { GroceryListFormData } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { useLens } from "@hookform/lenses";

export const ExistingGroceryListForm = ({
  groceryList,
}: {
  groceryList: GroceryListFormData;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const methods = useForm<GroceryListFormData>({
    defaultValues: groceryList,
  });

  const { handleSubmit, control, register } = methods;

  const lens = useLens({ control });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((values) => console.log(values))}>
        <AccordionTrigger>Test title</AccordionTrigger>
        {isEditing ? (
          <AccordionContent className={"h-full w-full"}>
            <IngredientArrayForm lens={lens.focus("ingredients")} />
            <input type="submit" />
          </AccordionContent>
        ) : null}
      </form>
    </FormProvider>
  );
};