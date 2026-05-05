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
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { BagDeleteIcon } from "@/components/icons/grocery-bag/delete"; // Grocery list editing form

// Grocery list editing form
export const ExistingGroceryListForm = ({
  groceryList,
  closeEditingCallbackAction,
  deleteListCallbackAction,
  last,
}: {
  groceryList: GroceryListFormData;
  closeEditingCallbackAction: () => void;
  deleteListCallbackAction: () => void;
  last: boolean;
}) => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: groceryList,
  });

  const { removeGroceryList, updateGroceryList } = useGroceryListsStore(
    useShallow(({ removeGroceryList, updateGroceryList }) => ({
      removeGroceryList,
      updateGroceryList,
    })),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, defaultValues },
  } = methods;

  const onDeleteHandler: SubmitHandler<GroceryListFormData> = async (
    groceryListData,
  ) => {
    // "use server";
    if (!groceryListData.publicId) return;

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
    return deleteListCallbackAction();
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

    console.log(changedFields);
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
    return closeEditingCallbackAction();
  };

  const onResetHandler = () => {
    reset();
    closeEditingCallbackAction();
  };

  // groceryList.updatedAt
  //   ? groceryList.updatedAt
  //   : groceryList.createdAt
  //     ? groceryList.createdAt
  //     : new Date(),

  console.log("edit groceryList.updatedAt", groceryList.updatedAt);
  console.log("edit groceryList.createdAt", groceryList.createdAt);
  /* TODO:
   ** 1. Get current searched grocery list
   **  - If grocery list name is same, hide new list form and focus/edit existing name
   ** 2. Local checkbox to cross out ingredient
   ** Button to reset checkboxes
   ** 3. Edit button and show/hide Reset/Save button
   ** 4. Title bar created/updated timestamp
   ** 5. Styling for add/remove ingredient buttons
   **/

  return (
    <form>
      <FormProvider {...methods}>
        <AccordionHeader
          // className={`flex flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md`} // here
          className={`flex flex-col items-center px-0 text-white ${last ? "data-[state=closed]:rounded-b-md" : ""}`}
        >
          <div onClick={() => 0} className={"pl-4"}>
            <ImageUploadIcon />
          </div>

          <div className={"flex w-full flex-col"}>
            <Input
              className={
                "border-none bg-blue-500 font-bold focus:outline-none sm:text-xl"
              }
              placeholder={"Enter new grocery list name "}
              id={"name"}
              type={"search"}
              {...register("name")}
            />

            {/* TODO: Change to created/updated date */}
            <AccordionSubheader
              ingredientsLength={groceryList.ingredients.length ?? 0}
            />
          </div>
          <div
            onClick={handleSubmit(onDeleteHandler)}
            className={"flex cursor-pointer items-center"}
          >
            <BagDeleteIcon
              className={"h-6 fill-none stroke-white hover:stroke-red-500"}
            />
          </div>
          <AccordionTrigger />
        </AccordionHeader>
        <AccordionContent className={`${last ? "rounded-b-md" : ""}`}>
          <IngredientArrayForm
            submitAction={handleSubmit(onUpdateHandler)}
            resetAction={handleSubmit(onResetHandler)}
          />
        </AccordionContent>
      </FormProvider>
    </form>
  );
};