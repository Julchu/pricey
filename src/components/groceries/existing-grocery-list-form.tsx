"use client";
import { GroceryListFormData } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { CartDeleteIcon } from "@/components/icons/cart/cart-delete-icon";

export const ExistingGroceryListForm = ({
  groceryList,
}: {
  groceryList: GroceryListFormData;
}) => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: groceryList,
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = methods;

  /* TODO: get current searched grocery list
   * if grocery list name is same, hide new list form and focus/edit existing name
   */
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((values) => console.log(values))}>
        <AccordionHeader>
          <AccordionTrigger>Test title</AccordionTrigger>
          <div
            onClick={handleSubmit((values) => console.log(values))}
            className={"flex items-center"}
          >
            <CartDeleteIcon />
          </div>
        </AccordionHeader>
        {isDirty ? (
          <AccordionContent className={"h-full w-full"}>
            <IngredientArrayForm control={control} />
            <input type="submit" />
          </AccordionContent>
        ) : null}
      </form>
    </FormProvider>
  );
};