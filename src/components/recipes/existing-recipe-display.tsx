import { AccordionContent, AccordionHeader, AccordionSubheader, AccordionTrigger, } from "@/components/ui/accordion";
import { GroceryListIngredientFormData, RecipeFormData, RecipeIngredientFormData, } from "@/utils/interfaces";
import { ComponentPropsWithoutRef, MouseEvent } from "react";
import { IngredientLabel } from "@/components/ui/input";
import { BagEditIcon } from "@/components/icons/grocery-bag/edit";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { BagAddIcon } from "@/components/icons/grocery-bag/add";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { formatPrice } from "@/utils/text-formatters";
import { ChefTransparent } from "@/components/icons/chef/chef-transparent";
import { Field } from "@base-ui/react/field";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";

export const ExistingRecipeDisplay = ({
  recipe,
  startEditingHandler,
  last,
}: {
  recipe: RecipeFormData;
  startEditingHandler: () => void;
  last: boolean;
}) => {
  const onClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    startEditingHandler();
  };

  const ingredients = recipe.ingredients;

  return (
    <div className={"flex flex-col"}>
      <AccordionHeader
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
            {recipe.name}
          </div>
          <AccordionSubheader ingredientsLength={ingredients?.length ?? 0} />
        </div>
        <div
          onClick={onClickHandler}
          className={"flex cursor-pointer items-center"}
        >
          <BagEditIcon className={"h-6 fill-none stroke-white"} />
        </div>
        <AccordionTrigger />
      </AccordionHeader>

      <AccordionContent className={`${last ? "rounded-b-md" : ""}`}>
        <IngredientsDisplay ingredients={ingredients} />
      </AccordionContent>
    </div>
  );
};

const IngredientsDisplay = ({
  ingredients,
}: {
  ingredients: RecipeIngredientFormData[];
}) => {
  const addIngredientsToCurrentList = useGroceryListsStore(
    ({ addIngredientsToCurrentList }) => addIngredientsToCurrentList,
  );
  const addIngredientsToCurrentRecipe = useRecipesStore(
    ({ addIngredientsToCurrentRecipe }) => addIngredientsToCurrentRecipe,
  );

  const masterIngredients = useIngredientsStore(
    ({ ingredients }) => ingredients,
  );

  return (
    <div className={"flex flex-col gap-4 p-4 font-medium"}>
      <div className={"flex w-full flex-col gap-4 sm:flex-row"}>
        <div className="group w-full">
          <button
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
            type="button"
            onClick={() =>
              addIngredientsToCurrentList(
                ingredients as GroceryListIngredientFormData[],
              )
            }
          >
            <BagAddIcon className="h-6 fill-none stroke-blue-500 group-hover:stroke-white" />
            Add to shopping list
          </button>
        </div>

        <div className="group w-full">
          <button
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
            type="button"
            onClick={() => addIngredientsToCurrentRecipe(ingredients)}
          >
            <ChefTransparent className="h-6 fill-none stroke-blue-500 group-hover:stroke-white" />
            Add to new recipe
          </button>
        </div>
      </div>

      {ingredients.map((ingredient, index) => {
        return (
          <div
            key={`${ingredient.publicId}_${index}`}
            className={
              "rounded-md border border-gray-200 p-4 sm:gap-4 lg:flex-row lg:border-none lg:p-0"
            }
          >
            <DisplayIngredient ingredient={ingredient} index={index} />
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

const DisplayIngredient = ({
  ingredient: { name, quantity, unit, capacity, publicId },
  index,
}: {
  ingredient: RecipeIngredientFormData;
  index: number;
}) => {
  const masterIngredients = useIngredientsStore(
    ({ ingredients }) => ingredients,
  );

  const foundIngredient = masterIngredients.find(
    ({ publicId: masterPublicId }) => masterPublicId === publicId,
  );

  return (
    <div className={`flex w-full flex-row gap-4`}>
      <div
        className={
          "grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
        }
      >
        <Field.Root className={"col-span-2 sm:col-span-4 lg:col-span-2"}>
          <IngredientLabel htmlFor={"name"} index={index}>
            Name
          </IngredientLabel>
          <DisplayField id={"name"}>{name}</DisplayField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"price"} index={index}>
            Price
          </IngredientLabel>
          <div className="flex items-center rounded-md bg-blue-100 pl-3">
            <span className={"text-gray-400"}>$</span>
            <DisplayField id={"price"}>
              {foundIngredient?.price
                ? formatPrice(foundIngredient.price / 100)
                : "0.00"}
            </DisplayField>
          </div>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"quantity"} index={index}>
            (Quantity)
          </IngredientLabel>
          <DisplayField id={"quantity"}>{quantity}</DisplayField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"capacity"} index={index}>
            Capacity
          </IngredientLabel>
          <DisplayField id={"capacity"}>{capacity}</DisplayField>
        </Field.Root>

        <Field.Root className={"col-span-1 sm:col-span-1"}>
          <IngredientLabel htmlFor={"unit"} index={index}>
            Unit
          </IngredientLabel>
          <DisplayField id={"unit"}>{unit}</DisplayField>
        </Field.Root>
      </div>
    </div>
  );
};

const DisplayField = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={`text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};