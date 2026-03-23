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
import { ComponentPropsWithoutRef, MouseEvent } from "react";
import { IngredientLabel } from "@/components/ui/input";
import { BagEditIcon } from "@/components/icons/grocery-bag/edit";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";

export const ExistingGroceryListChecklist = ({
  groceryList,
  startEditingAction,
  last,
}: {
  groceryList: GroceryListFormData;
  startEditingAction: () => void;
  last: boolean;
}) => {
  const onClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    startEditingAction();
  };

  const ingredients = groceryList.ingredients;

  return (
    <div className={"flex flex-col"}>
      <AccordionHeader
        // className={`flex flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md`} // here
        className={`flex flex-col items-center px-0 text-white ${last ? "data-[state=closed]:rounded-b-md" : ""}`}
      >
        <div onClick={onClickHandler} className={"pl-4"}>
          <ImageUploadIcon />
        </div>

        <div className={"flex w-full flex-col"}>
          <div
            className={
              "text-md flex min-h-10 w-full items-center bg-blue-500 px-[15px] text-xl font-bold"
            }
          >
            {groceryList.name}
          </div>

          {/* TODO: change to created/updated at*/}
          <AccordionSubheader ingredientsLength={ingredients.length} />
        </div>
        <div
          onClick={onClickHandler}
          className={"flex cursor-pointer items-center"}
        >
          <BagEditIcon className={"h-6 fill-none stroke-white"} />
        </div>
        {/* TODO: fix trigger to move entire header within trigger */}
        <AccordionTrigger />
      </AccordionHeader>

      <AccordionContent className={`${last ? "rounded-b-md" : ""}`}>
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
  return (
    <div className={"flex flex-col gap-4 p-4 font-medium"}>
      {ingredients.map((ingredient, index) => {
        return (
          <div
            key={`${ingredient.publicId}_${index}`}
            className={
              "rounded-md border border-gray-200 p-4 sm:gap-4 lg:flex-row lg:border-none lg:p-0"
            }
          >
            <ChecklistIngredient ingredient={ingredient} index={index} />
          </div>
        );
      })}
    </div>
  );
};

const ChecklistIngredient = ({
  ingredient: { name, quantity, unit, capacity, price },
  index,
}: {
  ingredient: GroceryListIngredientFormData;
  index: number;
}) => {
  return (
    <div className={`flex w-full flex-row gap-4`}>
      <div
        className={
          "grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <div className={"col-span-2 sm:col-span-4 lg:col-span-2"}>
          <IngredientLabel htmlFor={"name"} index={index}>
            Name
          </IngredientLabel>
          <ExistingGroceryListField id={"name"}>
            {name}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"price"} index={index}>
            Price
          </IngredientLabel>
          <div className="flex items-center rounded-md bg-blue-100 pl-3">
            <span className={"text-gray-400"}>$</span>
            <ExistingGroceryListField id={"price"}>
              {price ? `${price}` : "0"}
            </ExistingGroceryListField>
          </div>
        </div>

        <div className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </IngredientLabel>
          <ExistingGroceryListField id={"quantity"}>
            {quantity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"capacity"} index={index}>
            Capacity
          </IngredientLabel>
          <ExistingGroceryListField id={"capacity"}>
            {capacity}
          </ExistingGroceryListField>
        </div>

        <div className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"unit"} index={index}>
            Unit
          </IngredientLabel>
          <ExistingGroceryListField id={"unit"}>
            {unit}
          </ExistingGroceryListField>
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
}: ComponentPropsWithoutRef<"div"> & { checked?: boolean }) => {
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