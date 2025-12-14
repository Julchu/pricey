"use client";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GroceryListFormData,
  GroceryListIngredientFormData,
} from "@/utils/interfaces";
import { Label } from "radix-ui";
import { useState } from "react";
import {
  AnimatedCheckIcon,
  EmptyCheckbox,
} from "@/components/icons/animated-check-icon";
import { CartEditIcon } from "@/components/icons/cart/cart-edit-icon";

export const ExistingGroceryListChecklist = ({
  groceryList,
  startEditingAction,
}: {
  groceryList: GroceryListFormData;
  startEditingAction: () => void;
}) => {
  const ingredients = groceryList.ingredients;
  return (
    <>
      <AccordionHeader className={"flex h-full flex-row gap-4 px-0 text-white"}>
        <div
          className={
            "text-md flex w-full items-center rounded-md bg-blue-500 px-[15px] font-medium"
          }
        >
          {groceryList.name}
        </div>

        <div
          onClick={startEditingAction}
          className={"flex cursor-pointer items-center"}
        >
          <CartEditIcon />
        </div>

        <AccordionTrigger />
      </AccordionHeader>
      <AccordionContent className={"h-full w-full"}>
        <IngredientsChecklist ingredients={ingredients} />
      </AccordionContent>
    </>
  );
};

const IngredientsChecklist = ({
  ingredients,
}: {
  ingredients: GroceryListIngredientFormData[];
}) => {
  return (
    <div className={"flex flex-col gap-4 font-medium"}>
      {ingredients.map((ingredient, index) => {
        return (
          <ChecklistIngredient
            ingredient={ingredient}
            index={index}
            key={`${ingredient.publicId}_${index}`}
          />
        );
      })}
    </div>
  );
};

const ChecklistIngredient = ({
  ingredient: { name, quantity, unit, capacity },
  index,
}: {
  ingredient: GroceryListIngredientFormData;
  index: number;
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <div
      className={`flex w-full flex-row gap-4 ${checked ? "opacity-50" : ""}`}
    >
      <div
        className={
          "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <div className={"col-span-2 sm:col-span-3"}>
          <Label.Root
            className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
            htmlFor={"name"}
          >
            Name
          </Label.Root>

          <div
            id={"name"}
            className={
              "text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none"
            }
          >
            {name}
          </div>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <Label.Root
            className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
            htmlFor={"quantity"}
          >
            (Quantity)
          </Label.Root>
          <div
            id={"quantity"}
            className={
              "text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none"
            }
          >
            {quantity}
          </div>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <Label.Root
            className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
            htmlFor={"capacity"}
          >
            Capacity
          </Label.Root>
          <div
            id={"capacity"}
            className={
              "text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none"
            }
          >
            {capacity}
          </div>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <Label.Root
            className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
            htmlFor={"unit"}
          >
            Unit
          </Label.Root>
          <div
            id={"unit"}
            className={
              "text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none"
            }
          >
            {unit}
          </div>
        </div>
      </div>

      <div className={"flex flex-col justify-center opacity-100"}>
        {index === 0 ? (
          <Label.Root htmlFor={"checked-ingredient"}>&nbsp;</Label.Root>
        ) : null}
        <div
          id={"checked-ingredient"}
          className={
            "flex min-h-10 w-full cursor-pointer flex-row items-center rounded-md bg-blue-100 px-[15px] text-black"
          }
          onClick={() => setChecked((currentlyChecked) => !currentlyChecked)}
        >
          {checked ? <AnimatedCheckIcon /> : <EmptyCheckbox />}
        </div>
      </div>
    </div>
  );
};