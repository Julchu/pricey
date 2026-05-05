"use client";
import {
  RecipeFormData,
  RecipeIngredientFormData,
  RecipeUpdateFormData,
} from "@/utils/interfaces";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  AccordionContent,
  AccordionHeader,
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { BagDeleteIcon } from "@/components/icons/grocery-bag/delete";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";

export const ExistingRecipeForm = ({
  recipe,
  closeEditingCallbackAction,
  deleteRecipeCallbackAction,
  last,
}: {
  recipe: RecipeFormData;
  closeEditingCallbackAction: () => void;
  deleteRecipeCallbackAction: () => void;
  last: boolean;
}) => {
  const methods = useForm<RecipeFormData>({
    defaultValues: recipe,
  });

  const { removeRecipe, updateRecipe } = useRecipesStore(
    useShallow(({ removeRecipe, updateRecipe }) => ({
      removeRecipe,
      updateRecipe,
    })),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { dirtyFields, defaultValues },
  } = methods;

  const onDeleteHandler: SubmitHandler<RecipeFormData> = async (recipeData) => {
    if (!recipeData.publicId) return;

    const submitResponse = await fetch(`/api/recipe/${recipeData.publicId}`, {
      method: "DELETE",
      body: JSON.stringify(recipeData.publicId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { recipeId } = response;
      removeRecipe(recipeId);
    }
    return deleteRecipeCallbackAction();
  };

  const filterChangedData = (
    recipeChanges: RecipeFormData,
  ): RecipeUpdateFormData => {
    const { ingredients: dirtyIngredients, ...changedRecipeValues } =
      recipeChanges;

    if (
      !dirtyFields.ingredients ||
      dirtyFields.ingredients.length === 0 ||
      !defaultValues?.ingredients
    )
      return {
        updatedIngredients: [],
        deletedIngredientIds: [],
        newIngredients: [],
        recipe: changedRecipeValues,
      };

    const originalIngredients =
      methods.formState.defaultValues?.ingredients ?? [];

    const newIngredients: RecipeIngredientFormData[] = [];
    const updatedIngredients: RecipeIngredientFormData[] = [];
    const deletedIngredientIds: string[] = [];

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
      if (!dirtyIngredient.publicId) newIngredients.push(dirtyIngredient);
      else {
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
      recipe: changedRecipeValues,
    };
  };

  const onUpdateHandler: SubmitHandler<RecipeFormData> = async (recipeData) => {
    if (!recipeData.publicId) return;
    if (!dirtyFields) return;

    const changedFields = filterChangedData(recipeData);

    const submitResponse = await fetch(`/api/recipe/${recipeData.publicId}`, {
      method: "PATCH",
      body: JSON.stringify(changedFields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { recipe } = response;
      updateRecipe(recipe);
    }
    return closeEditingCallbackAction();
  };

  const onResetHandler = () => {
    reset();
    closeEditingCallbackAction();
  };

  return (
    <form>
      <FormProvider {...methods}>
        <AccordionHeader
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
              placeholder={"Enter recipe name"}
              id={"name"}
              type={"search"}
              {...register("name")}
            />
            <AccordionSubheader
              ingredientsLength={recipe.ingredients.length ?? 0}
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