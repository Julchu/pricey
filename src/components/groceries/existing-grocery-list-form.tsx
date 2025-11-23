"use client";
import {
  GroceryListFormData,
  GroceryListIngredientFormData,
  GroceryListUpdateFormData,
} from "@/utils/interfaces"; // TODO: test if can remove * as React
import * as React from "react";
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
}: {
  groceryList: GroceryListFormData;
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
  };

  const filterChangedData = (
    groceryListChanges: GroceryListFormData,
  ): GroceryListUpdateFormData => {
    const { ingredients: ingredientChanges, ...changedGroceryListValues } =
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

    const originalIngredientsByIds = originalIngredients.reduce<
      Record<string, Partial<GroceryListIngredientFormData>>
    >((ingredients, ingredient) => {
      if (!ingredient || !ingredient.publicId) return ingredients;
      ingredients[ingredient.publicId] = ingredient;
      return ingredients;
    }, {});

    console.log(originalIngredientsByIds);

    const updatedIngredientByIds = ingredientChanges.reduce<
      Record<string, GroceryListIngredientFormData>
    >((ingredients, ingredient) => {
      if (!ingredient.publicId) return ingredients;
      ingredients[ingredient.publicId] = ingredient;
      return ingredients;
    }, {});

    console.log(updatedIngredientByIds);

    const deletedIngredientIds = groceryList.ingredients.reduce<string[]>(
      (deletedIds, { publicId }) => {
        if (!publicId) return deletedIds;

        if (deletedIds && !updatedIngredientByIds[publicId])
          deletedIds.push(publicId);
        return deletedIds;
      },
      [],
    );

    const newIngredients = ingredientChanges.reduce<
      GroceryListIngredientFormData[]
    >((newIngredients, ingredient) => {
      if (!ingredient.publicId) return newIngredients;
      if (!originalIngredientsByIds[ingredient.publicId])
        newIngredients.push(ingredient);
      return newIngredients;
    }, []);

    const updatedIngredients = ingredientChanges.reduce<
      GroceryListIngredientFormData[]
    >((updates, ingredient) => {
      if (!ingredient.publicId) return updates;

      if (
        originalIngredientsByIds[ingredient.publicId] &&
        JSON.stringify(originalIngredientsByIds[ingredient.publicId]) !==
          JSON.stringify(ingredient)
      )
        updatedIngredients.push(ingredient);
      return updates;
    }, []);

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
    return;
  };

  const onResetHandler = () => {
    reset();
  };

  /* TODO: get current searched grocery list
   * if grocery list name is same, hide new list form and focus/edit existing name
   */
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
            className={"flex items-center"}
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