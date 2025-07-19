"use client";
import { GroceryListFormData } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
    <form>
      <AccordionTrigger>Test title</AccordionTrigger>
      <AccordionContent>
        {isEditing ? (
          <IngredientArrayForm lens={lens.focus("ingredients")} />
        ) : null}
      </AccordionContent>
    </form>
  );
};