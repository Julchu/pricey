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
import { Label } from "radix-ui";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import {
  AnimatedCheckIcon,
  EmptyCheckbox,
} from "@/components/icons/animated-check-icon";
import { CartEditIcon } from "@/components/icons/cart/cart-edit-icon";
import { LabelProps } from "@radix-ui/react-label";

export const ExistingGroceryListChecklist = ({
  groceryList,
  startEditingAction,
}: {
  groceryList: GroceryListFormData;
  startEditingAction: () => void;
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
    <>
      <AccordionHeader
        className={"flex h-full flex-col items-center px-0 text-white"}
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
    <div className={`flex w-full flex-row gap-4`}>
      <div
        className={
          "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <div className={"col-span-2 sm:col-span-3"}>
          <ExistingGroceryListLabel htmlFor={"name"} index={index}>
            Name
          </ExistingGroceryListLabel>
          <ExistingGroceryListField id={"name"} checked={checked}>
            {name}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <ExistingGroceryListLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </ExistingGroceryListLabel>
          <ExistingGroceryListField id={"quantity"} checked={checked}>
            {quantity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <ExistingGroceryListLabel htmlFor={"capacity"} index={index}>
            Capacity
          </ExistingGroceryListLabel>
          <ExistingGroceryListField id={"capacity"} checked={checked}>
            {capacity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-2 sm:col-span-1"}>
          <ExistingGroceryListLabel htmlFor={"unit"} index={index}>
            Unit
          </ExistingGroceryListLabel>
          <ExistingGroceryListField id={"unit"} checked={checked}>
            {unit}
          </ExistingGroceryListField>
        </div>
      </div>

      <div>
        <ExistingGroceryListLabel htmlFor={"checked-ingredient"} index={index}>
          Bought
        </ExistingGroceryListLabel>
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

const ExistingGroceryListLabel = ({
  children,
  className,
  index,
  ...props
}: LabelProps & { index: number }) => {
  return (
    <Label.Root
      className={`text-sm text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""} ${className}`}
      {...props}
    >
      {children}
    </Label.Root>
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