"use client";
import {
  GroceryListFormData,
  GroceryListIngredientFormData,
  GroceryListUpdateFormData,
} from "@/utils/interfaces";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { CartDeleteIcon } from "@/components/icons/cart/cart-delete-icon";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";

export const ExistingGroceryListForm = ({
  groceryList,
  closeEditingAction,
}: {
  groceryList: GroceryListFormData;
  closeEditingAction: () => void;
}) => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: groceryList,
  });

  const [removeGroceryList, updateGroceryList] = useGroceryListsStore(
    useShallow(({ removeGroceryList, updateGroceryList }) => [
      removeGroceryList,
      updateGroceryList,
    ]),
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { dirtyFields, defaultValues },
  } = methods;

  const onDeleteHandler: SubmitHandler<GroceryListFormData> = async (
    groceryListData,
  ) => {
    // "use server";
    if (!groceryListData.publicId) return;
    console.log("test");

    const submitResponse = await fetch(
      `/api/grocery-list/${groceryListData.publicId}`,
      {
        method: "DELETE",
        body: JSON.stringify(groceryListData.publicId),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // if (groceryListData.image) {
    //   URL.revokeObjectURL(groceryListData.image);
    // }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { groceryListId } = response;
      removeGroceryList(groceryListId);
    }
    return closeEditingAction();
  };

  const filterChangedData = (
    groceryListChanges: GroceryListFormData,
  ): GroceryListUpdateFormData => {
    const { ingredients: dirtyIngredients, ...changedGroceryListValues } =
      groceryListChanges;

    if (
      !dirtyFields.ingredients ||
      dirtyFields.ingredients.length === 0 ||
      !defaultValues?.ingredients
    )
      return {
        updatedIngredients: [],
        deletedIngredientIds: [],
        newIngredients: [],
        groceryList: changedGroceryListValues,
      };

    const originalIngredients =
      methods.formState.defaultValues?.ingredients ?? [];

    const newIngredients: GroceryListIngredientFormData[] = [];
    const updatedIngredients: GroceryListIngredientFormData[] = [];
    const deletedIngredientIds: string[] = [];

    //   If ingredient.publicId exists in originalIngredients but not in ingredientChanges: deleted ingredient
    for (const originalIngredient of originalIngredients) {
      if (
        originalIngredient &&
        originalIngredient.publicId &&
        !dirtyIngredients.some(
          ({ publicId }) => publicId === originalIngredient?.publicId,
        )
      ) {
        deletedIngredientIds.push(originalIngredient.publicId);
      }
    }

    for (const dirtyIngredient of dirtyIngredients) {
      //   If no ingredient.publicId: new ingredient
      if (!dirtyIngredient.publicId) newIngredients.push(dirtyIngredient);
      else {
        //   If ingredient.publicId exists in originalIngredients: do difference check to see if updated
        const existingIngredient = originalIngredients.find(
          (originalIngredient) =>
            originalIngredient?.publicId === dirtyIngredient.publicId,
        );

        if (existingIngredient) {
          if (
            JSON.stringify(dirtyIngredient) !==
            JSON.stringify(existingIngredient)
          ) {
            updatedIngredients.push(dirtyIngredient);
          }
        }
      }
    }

    return {
      deletedIngredientIds,
      newIngredients,
      updatedIngredients,
      groceryList: changedGroceryListValues,
    };
  };

  const onUpdateHandler: SubmitHandler<GroceryListFormData> = async (
    groceryListData,
  ) => {
    // "use server";
    if (!groceryListData.publicId) return;
    if (!dirtyFields) return;

    const changedFields = filterChangedData(groceryListData);

    const submitResponse = await fetch(
      `/api/grocery-list/${groceryListData.publicId}`,
      {
        method: "PATCH",
        body: JSON.stringify(changedFields),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // if (groceryListData.image) {
    //   URL.revokeObjectURL(groceryListData.image);
    // }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { groceryList } = response;
      updateGroceryList(groceryList);
    }
    return closeEditingAction();
  };

  const onResetHandler = () => {
    reset();
  };

  /* TODO:
   ** 1. Get current searched grocery list
   **  - If grocery list name is same, hide new list form and focus/edit existing name
   ** 2. Local checkbox to cross out ingredient
   ** 3. Edit button and show/hide Reset/Save button
   ** 4. Title bar created/updated timestamp
   ** 5. Styling for add/remove ingredient buttons
   **/

  return (
    <FormProvider {...methods}>
      <form>
        <AccordionHeader
          className={"flex h-full flex-row gap-4 px-0 text-white"}
        >
          <Input
            className={"bg-blue-500 font-medium focus:outline-none"}
            autoComplete={"name"}
            placeholder={"Enter new grocery list name "}
            id={"name"}
            type={"search"}
            {...register("name")}
          />

          <div
            onClick={handleSubmit(onDeleteHandler)}
            className={"3cursor-pointer flex items-center"}
          >
            <CartDeleteIcon />
          </div>

          <AccordionTrigger />
        </AccordionHeader>
        <AccordionContent className={"h-full w-full"}>
          <IngredientArrayForm
            control={control}
            submitAction={handleSubmit(onUpdateHandler)}
            resetAction={handleSubmit(onResetHandler)}
          />
        </AccordionContent>
      </form>
    </FormProvider>
  );
};