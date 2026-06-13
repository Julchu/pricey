import {
  AccordionContent,
  AccordionHeader,
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChecklistData,
  GroceryListFormData,
  GroceryListIngredientFormData,
} from "@/utils/interfaces";
import * as React from "react";
import { MouseEvent } from "react";
import { IngredientLabel, IngredientRoot } from "@/components/ui/input";
import { BagEditIcon } from "@/components/icons/grocery-bag/edit";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { BagAddIcon } from "@/components/icons/grocery-bag/add";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { formatPrice } from "@/utils/text-formatters";
import { Field } from "@base-ui/react/field";
import { useShallow } from "zustand/react/shallow";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { ChecklistAdd } from "@/components/icons/checklist/checklist-add";
import { ChecklistRemove } from "@/components/icons/checklist/checklist-remove";
import { IngredientToggle } from "@/components/groceries/ingredient-toggle";
import { usePantryStore } from "@/providers/pantry-store-provider";
import { ExistingGroceryListField } from "@/components/groceries/grocery-list-ui"; // TODO: re-add checking off ingredients

// TODO: re-add checking off ingredients
export const ExistingGroceryListChecklist = ({
  groceryList: { name, ingredients, publicId },
  startEditing,
  last,
}: {
  groceryList: GroceryListFormData;
  startEditing: () => void;
  last: boolean;
}) => {
  const checklist = useGroceryListsStore(({ checklist }) => checklist);

  const onClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    startEditing();
  };

  const isCurrentList = checklist?.groceryListId === publicId;

  return (
    <div className={"flex flex-col"}>
      <AccordionHeader
        // className={`flex flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md`} // here
        className={`flex flex-col items-center bg-blue-500 px-0 text-white ${last ? "data-closed:rounded-b-md" : ""}`} // ${checklist ? (isCurrentList ? "" : "bg-blue-800 opacity-70") : ""}
      >
        {/* TODO: fix header trigger/upload image to form */}
        <div onClick={onClickHandler} className={"cursor-pointer pl-4"}>
          <ImageUploadIcon />
        </div>

        <div className={"flex w-full flex-col"}>
          <div
            className={`text-md flex min-h-10 w-full items-center px-[15px] text-xl font-bold`}
          >
            {name}
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
        {publicId ? (
          <IngredientsChecklist
            ingredients={ingredients}
            groceryListId={publicId}
          />
        ) : null}
      </AccordionContent>
    </div>
  );
};

const IngredientsChecklist = ({
  ingredients,
  groceryListId,
}: {
  ingredients: GroceryListIngredientFormData[];
  groceryListId: string;
}) => {
  // TODO: destructure
  const { addIngredientsToNewList, setChecklist, clearChecklist, checklist } =
    useGroceryListsStore(
      useShallow(
        ({
          addIngredientsToNewList,
          setChecklist,
          clearChecklist,
          checklist,
        }) => ({
          addIngredientsToNewList,
          setChecklist,
          clearChecklist,
          checklist,
        }),
      ),
    );

  const masterIngredients = useIngredientsStore(
    ({ ingredients }) => ingredients,
  );

  const isCurrentList = checklist?.groceryListId === groceryListId;

  const checklistData: ChecklistData = {
    groceryListId,
    ingredients: ingredients.reduce<Record<string, boolean>>(
      (ingredientObj, { publicId }) => {
        if (publicId) ingredientObj[publicId] = false;
        return ingredientObj;
      },
      {},
    ),
  };

  if (!groceryListId) return null;

  // TODO: move total and individual ingredient price calculation up
  return (
    <div className={"flex flex-col gap-4 p-4 font-medium"}>
      <div className={"flex w-full flex-col gap-4 sm:flex-row"}>
        <div className={"group w-full"}>
          <button
            className={
              "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
            }
            type="button"
            onClick={() => {
              if (!isCurrentList) setChecklist(checklistData);
              else clearChecklist();
            }}
          >
            {isCurrentList ? (
              <>
                <ChecklistRemove
                  className={
                    "h-6 fill-blue-500 stroke-blue-500 group-hover:fill-white group-hover:stroke-white"
                  }
                />
                Unset current list
              </>
            ) : (
              <>
                <ChecklistAdd
                  className={
                    "h-6 fill-blue-500 stroke-blue-500 group-hover:fill-white group-hover:stroke-white"
                  }
                />
                Set current list
              </>
            )}
          </button>
        </div>

        <div className={"group w-full"}>
          <button
            className={
              "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
            }
            type="button"
            onClick={() => addIngredientsToNewList(ingredients)}
          >
            <BagAddIcon
              className={
                "h-6 fill-none stroke-blue-500 group-hover:stroke-white"
              }
            />
            Add to new list
          </button>
        </div>
      </div>

      {ingredients.map((ingredient, index) => {
        if (!ingredient.publicId) return null;

        const checked = !!checklist?.ingredients[ingredient.publicId];

        return (
          <div
            key={`${ingredient.publicId}_${index}`}
            className={
              "flex-col rounded-md border border-gray-200 p-4 sm:gap-4 lg:flex-row lg:border-none lg:p-0"
            }
          >
            <div
              className={
                "flex h-10 flex-row items-center justify-between lg:hidden"
              }
            >
              {<p>Ingredient {index + 1}</p>}
              {isCurrentList ? (
                <IngredientRoot
                  isCurrentList
                  className={"col-span-2 mt-auto justify-center"}
                >
                  <IngredientToggle
                    publicId={ingredient.publicId}
                    checked={checked}
                  />
                </IngredientRoot>
              ) : null}
            </div>
            <ChecklistIngredient
              ingredient={ingredient}
              index={index}
              isCurrentList={isCurrentList}
              checked={checked}
            />
          </div>
        );
      })}

      {/*grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1*/}
      <div
        className={
          "grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-14"
        }
      >
        <div
          className={
            "col-span-1 flex h-10 flex-col items-end justify-center text-center sm:col-start-2 lg:col-span-2 lg:col-start-11"
          }
        >
          Total cost:
        </div>

        <div
          className={
            "col-span-1 flex h-10 flex-col justify-center rounded-md border border-gray-200 sm:col-start-3 lg:col-span-2 lg:col-start-13"
          }
        >
          <p className={"text-center font-medium"}>
            $
            {formatPrice(
              ingredients.reduce((sum, { publicId }) => {
                const foundIngredient = masterIngredients.find(
                  ({ publicId: masterPublicId }) => masterPublicId === publicId,
                );
                if (foundIngredient?.price) return sum + foundIngredient.price;
                return sum;
              }, 0),
            ) || "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChecklistIngredient = ({
  ingredient: { name, quantity, unit, capacity, publicId },
  index,
  isCurrentList,
  checked,
}: {
  ingredient: GroceryListIngredientFormData;
  index: number;
  isCurrentList: boolean;
  checked: boolean;
}) => {
  const masterIngredients = useIngredientsStore(
    ({ ingredients }) => ingredients,
  );

  // TODO: remove useShallow
  const _addItemToPantry = usePantryStore(
    ({ addItemToPantry }) => addItemToPantry,
  );

  const foundIngredient = masterIngredients.find(
    ({ publicId: masterPublicId }) => masterPublicId === publicId,
  );

  return (
    <div className={`flex w-full flex-col gap-4`}>
      <div
        className={
          isCurrentList
            ? "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-14"
            : "grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <Field.Root
          className={`${
            isCurrentList
              ? "col-span-4 sm:col-span-2 lg:col-span-4"
              : "col-span-2 sm:col-span-4 lg:col-span-2"
          } ${checked ? "opacity-10" : ""}`}
        >
          <IngredientLabel htmlFor={"name"} index={index}>
            Name
          </IngredientLabel>
          <ExistingGroceryListField id={"name"}>
            {name}
          </ExistingGroceryListField>
        </Field.Root>

        <IngredientRoot
          isCurrentList={isCurrentList}
          className={`${checked ? "opacity-10" : ""}`}
        >
          <IngredientLabel htmlFor={"price"} index={index}>
            Price
          </IngredientLabel>
          <div className="flex items-center rounded-md bg-blue-100 pl-3">
            <span className={"text-gray-400"}>$</span>
            <ExistingGroceryListField id={"price"}>
              {foundIngredient?.price
                ? formatPrice(foundIngredient.price / 100)
                : "0.00"}
            </ExistingGroceryListField>
          </div>
        </IngredientRoot>

        <IngredientRoot
          isCurrentList={isCurrentList}
          className={`${checked ? "opacity-10" : ""}`}
        >
          <IngredientLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </IngredientLabel>
          <ExistingGroceryListField id={"quantity"}>
            {quantity}
          </ExistingGroceryListField>
        </IngredientRoot>

        <IngredientRoot
          isCurrentList={isCurrentList}
          className={`${checked ? "opacity-10" : ""}`}
        >
          <IngredientLabel htmlFor={"capacity"} index={index}>
            Capacity
          </IngredientLabel>
          <ExistingGroceryListField id={"capacity"}>
            {capacity}
          </ExistingGroceryListField>
        </IngredientRoot>

        <IngredientRoot
          isCurrentList={isCurrentList}
          className={`${checked ? "opacity-10" : ""}`}
        >
          <IngredientLabel htmlFor={"unit"} index={index}>
            Unit
          </IngredientLabel>
          <ExistingGroceryListField id={"unit"}>
            {unit}
          </ExistingGroceryListField>
        </IngredientRoot>

        {isCurrentList && publicId ? (
          <IngredientRoot
            isCurrentList
            className={"mt-auto hidden w-full lg:block"}
          >
            <IngredientToggle checked={checked} publicId={publicId}>
              Add
            </IngredientToggle>
          </IngredientRoot>
        ) : null}
      </div>
    </div>
  );
};