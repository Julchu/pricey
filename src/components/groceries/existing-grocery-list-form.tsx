"use client";
import { GroceryListFormData } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { CartDeleteIcon } from "@/components/icons/cart/cart-delete-icon";
import { groceryListReset } from "@/providers/new-grocery-list-form-provider";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";

export const ExistingGroceryListForm = ({
  groceryList,
}: {
  groceryList: GroceryListFormData;
}) => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: groceryList,
  });

  const removeGroceryList = useGroceryListsStore(
    ({ removeGroceryList }) => removeGroceryList,
  );

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = methods;

  const onDeleteHandler: SubmitHandler<string | undefined> = async (
    groceryListId,
  ) => {
    if (!groceryListId) return;

    const submitResponse = await fetch(`/api/grocery-list/${groceryListId}`, {
      method: "DELETE",
      body: JSON.stringify(groceryListId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (groceryListData.image) {
    //   URL.revokeObjectURL(groceryListData.image);
    // }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { groceryListId } = response;
      removeGroceryList(groceryListId);
      groceryListReset();
    }
  };

  /* TODO: get current searched grocery list
   * if grocery list name is same, hide new list form and focus/edit existing name
   */
  return (
    <FormProvider {...methods}>
      <form>
        <AccordionHeader>
          <AccordionTrigger>{groceryList.name.toWellFormed()}</AccordionTrigger>
          <div
            onClick={handleSubmit((values) => onDeleteHandler(values.publicId))}
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