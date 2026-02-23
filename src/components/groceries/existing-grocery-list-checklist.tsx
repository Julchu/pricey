"use client";
import {
  AccordionContent,
  AccordionHeader,
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GroceryListFormData,
  GroceryListIngredientFormData,
} from "@/utils/interfaces";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import {
  AnimatedCheckIcon,
  EmptyCheckbox,
} from "@/components/icons/animated-check-icon";
import { CartEditIcon } from "@/components/icons/cart/cart-edit-icon";
import { IngredientLabel } from "@/components/ui/input";

export const ExistingGroceryListChecklist = ({
  groceryList,
  startEditingAction,
  last,
}: {
  groceryList: GroceryListFormData;
  startEditingAction: () => void;
  last: boolean;
}) => {
  const [dateString, setDateString] = useState("");
  const ingredients = groceryList.ingredients;

  useEffect(() => {
    setDateString(
      new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
  }, []);

  return (
    <div className={"flex flex-col"}>
      <AccordionHeader
        className={`flex flex-col items-center px-0 text-white ${last ? "data-[state=closed]:rounded-b-md" : ""}`}
      >
        <div onClick={startEditingAction} className={"pl-4"}>
          <CartEditIcon />
        </div>

        <div className={"flex w-full flex-col"}>
          <div
            className={
              "text-md flex min-h-10 w-full items-center bg-blue-500 px-[15px] font-medium sm:text-xl"
            }
          >
            {groceryList.name}
          </div>

          <AccordionSubheader
            ingredientsLength={ingredients.length}
            dateString={dateString}
          />
        </div>
        <div
          onClick={startEditingAction}
          className={"flex cursor-pointer items-center"}
        >
          <CartEditIcon />
        </div>
        <AccordionTrigger />
      </AccordionHeader>

      <AccordionContent className={`${last ? "rounded-b-md" : ""} p-4`}>
        <IngredientsChecklist ingredients={ingredients} />
      </AccordionContent>
    </div>
  );
};

const IngredientsChecklist = ({
  ingredients,
}: {
  ingredients: GroceryListIngredientFormData[];
}) => {
  // gap-4
  return (
    <div className={"flex flex-col gap-y-4 font-medium"}>
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
    <div className={`flex w-full flex-row gap-4`}>
      <div
        className={
          "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <div className={"col-span-2 sm:col-span-3"}>
          <IngredientLabel htmlFor={"name"} index={index}>
            Name
          </IngredientLabel>
          <ExistingGroceryListField id={"name"} checked={checked}>
            {name}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <IngredientLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </IngredientLabel>
          <ExistingGroceryListField id={"quantity"} checked={checked}>
            {quantity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <IngredientLabel htmlFor={"capacity"} index={index}>
            Capacity
          </IngredientLabel>
          <ExistingGroceryListField id={"capacity"} checked={checked}>
            {capacity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <IngredientLabel htmlFor={"unit"} index={index}>
            Unit
          </IngredientLabel>
          <ExistingGroceryListField id={"unit"} checked={checked}>
            {unit}
          </ExistingGroceryListField>
        </div>
      </div>

      <div>
        <IngredientLabel htmlFor={"checked-ingredient"} index={index}>
          Added
        </IngredientLabel>
        <div
          id={"checked-ingredient"}
          className={`flex min-h-10 w-full cursor-pointer flex-row items-center rounded-md bg-blue-100 px-[15px] text-black ${checked ? "opacity-10" : ""}`}
          onClick={() => setChecked((currentlyChecked) => !currentlyChecked)}
        >
          {checked ? <AnimatedCheckIcon /> : <EmptyCheckbox />}
        </div>
      </div>
    </div>
  );
};

const ExistingGroceryListField = ({
  children,
  className,
  checked,
  ...props
}: ComponentPropsWithoutRef<"div"> & { checked: boolean }) => {
  return (
    <div
      id={"unit"}
      className={`text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none ${checked ? "opacity-10" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};