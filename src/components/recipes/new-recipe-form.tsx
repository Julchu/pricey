"use client";
import {
  AccordionContent,
  AccordionHeader,
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { RecipeFormData, UnitType } from "@/utils/interfaces";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";
import { useShallow } from "zustand/react/shallow";

export const NewRecipeForm = ({
  setOpenRecipeAction,
}: {
  setOpenRecipeAction: Dispatch<SetStateAction<string>>;
}) => {
  const defaultEmptyValues = {
    name: "",
    ingredients: [
      {
        name: "",
        quantity: "" as unknown as number,
        capacity: "" as unknown as number,
        unit: "" as UnitType,
        ingredientPublicId: undefined,
      },
    ],
    public: false,
  };

  const { currentRecipe, setCurrentRecipe, clearCurrentRecipe } =
    useRecipesStore(
      useShallow(({ currentRecipe, setCurrentRecipe, clearCurrentRecipe }) => ({
        currentRecipe,
        setCurrentRecipe,
        clearCurrentRecipe,
      })),
    );

  const methods = useForm<RecipeFormData>({
    defaultValues: currentRecipe ?? defaultEmptyValues,
  });

  const { register, handleSubmit, setFocus, control, reset, watch } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Sync form changes to the store so draft state persists while typing
  // TODO: try using getValues() instead
  useEffect(() => {
    const subscription = watch((value) => {
      setCurrentRecipe(value as RecipeFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setCurrentRecipe]);

  const addRecipe = useRecipesStore(({ addRecipe }) => addRecipe);

  const onSubmitHandler: SubmitHandler<RecipeFormData> = async (recipeData) => {
    const submitResponse = await fetch("/api/recipe", {
      method: "POST",
      body: JSON.stringify(recipeData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { recipe } = response;
      addRecipe(recipe);
      recipeReset();
    }
  };

  const toggleHeader = () => {
    setOpenRecipeAction((newRecipeOpen) => {
      if (newRecipeOpen === "new-recipe") return "";
      return "new-recipe";
    });
  };

  const [ingredients] = useWatch({
    control,
    name: ["ingredients"],
  });

  const recipeReset = () => {
    reset(defaultEmptyValues);
    clearCurrentRecipe();
  };

  return (
    <form>
      <FormProvider {...methods}>
        <AccordionHeader className="flex h-auto flex-col items-center rounded-t-md px-0 text-white">
          <div onClick={toggleHeader} className={"pl-4"}>
            <ImageUploadIcon />
          </div>

          <div className={"flex w-full flex-col"}>
            <Input
              className={
                "border-none bg-blue-500 font-medium focus:outline-none sm:text-xl"
              }
              autoComplete={"name"}
              placeholder={"Enter new recipe name"}
              id={"name"}
              type={"search"}
              {...register("name")}
            />
            <AccordionSubheader ingredientsLength={ingredients?.length ?? 0} />
          </div>
          <AccordionTrigger tabIndex={-1} />
        </AccordionHeader>

        <AccordionContent>
          <IngredientArrayForm
            submitAction={handleSubmit(onSubmitHandler)}
            resetAction={recipeReset}
          />
        </AccordionContent>
      </FormProvider>
    </form>
  );
};