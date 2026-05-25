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
import { BagAddIcon } from "@/components/icons/grocery-bag/add";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { usePantryStore } from "@/providers/pantry-store-provider";
import { formatPrice } from "@/utils/text-formatters"; // TODO: re-add checking off ingredients
import { Field } from "@base-ui/react/field";
import { useShallow } from "zustand/react/shallow"; // TODO: re-add checking off ingredients

// TODO: re-add checking off ingredients
export const ExistingGroceryListChecklist = ({
  groceryList,
  startEditing,
  last,
}: {
  groceryList: GroceryListFormData;
  startEditing: () => void;
  last: boolean;
}) => {
  const onClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    startEditing();
  };

  const ingredients = groceryList.ingredients;

  return (
    <div className={"flex flex-col"}>
      <AccordionHeader
        // className={`flex flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md`} // here
        className={`flex flex-col items-center px-0 text-white ${last ? "data-closed:rounded-b-md" : ""}`}
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
  const addIngredientsToCurrentList = useGroceryListsStore(
    (state) => state.addIngredientsToCurrentList,
  );

  const { addItemToPantry } = usePantryStore(
    useShallow(({ addItemToPantry }) => ({
      addItemToPantry,
    })),
  );

  return (
    <div className={"flex flex-col gap-4 p-4 font-medium"}>
      <div className={"group"}>
        <button
          className={
            "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
          }
          type="button"
          onClick={() => addIngredientsToCurrentList(ingredients)}
        >
          <BagAddIcon
            className={"h-6 fill-none stroke-blue-500 group-hover:stroke-white"}
          />
          Add to current list
        </button>
      </div>

      {ingredients.map((ingredient, index) => {
        return (
          <div
            key={`${ingredient.publicId}_${index}`}
            className={
              "rounded-md border border-gray-200 p-4 sm:gap-4 lg:flex-row lg:border-none lg:p-0"
            }
          >
            <ChecklistIngredient
              ingredient={ingredient}
              index={index}
              onAddToPantry={addItemToPantry}
            />
          </div>
        );
      })}

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
          {formatPrice(
            ingredients.reduce(
              (sum, ingredient) => sum + (ingredient.price || 0) / 100,
              0,
            ),
          ) || "0.00"}
        </div>
      </div>
    </div>
  );
};

const ChecklistIngredient = ({
  ingredient: { name, quantity, unit, capacity, price },
  index,
  onAddToPantry,
}: {
  ingredient: GroceryListIngredientFormData;
  index: number;
  onAddToPantry: (item: GroceryListIngredientFormData) => void;
}) => {
  return (
    <div className={`flex w-full flex-row gap-4`}>
      <div
        className={
          "grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
          // TODO: update to 14 grid with add to pantry button if current grocery list
          //   grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-14
        }
      >
        <Field.Root className={"col-span-2 sm:col-span-4 lg:col-span-2"}>
          <IngredientLabel htmlFor={"name"} index={index}>
            Name
          </IngredientLabel>
          <ExistingGroceryListField id={"name"}>
            {name}
          </ExistingGroceryListField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"price"} index={index}>
            Price
          </IngredientLabel>
          <div className="flex items-center rounded-md bg-blue-100 pl-3">
            <span className={"text-gray-400"}>$</span>
            <ExistingGroceryListField id={"price"}>
              {price ? formatPrice(price / 100) : "0.00"}
            </ExistingGroceryListField>
          </div>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </IngredientLabel>
          <ExistingGroceryListField id={"quantity"}>
            {quantity}
          </ExistingGroceryListField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"capacity"} index={index}>
            Capacity
          </IngredientLabel>
          <ExistingGroceryListField id={"capacity"}>
            {capacity}
          </ExistingGroceryListField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"unit"} index={index}>
            Unit
          </IngredientLabel>
          <ExistingGroceryListField id={"unit"}>
            {unit}
          </ExistingGroceryListField>
        </Field.Root>
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