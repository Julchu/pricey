import {
  AccordionContent,
  AccordionHeader,
  AccordionSubheader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { RecipeFormData, UnitType } from "@/utils/interfaces";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";
import { useShallow } from "zustand/react/shallow";

export const NewRecipeForm = ({
  setOpenRecipe,
}: {
  setOpenRecipe: Dispatch<SetStateAction<string>>;
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

  const {
    addRecipe,
    currentRecipe,
    setCurrentRecipe,
    clearCurrentRecipe,
    currentRecipeVersion,
    hasHydrated,
  } = useRecipesStore(
    useShallow(
      ({
        addRecipe,
        currentRecipe,
        setCurrentRecipe,
        clearCurrentRecipe,
        currentRecipeVersion,
        hasHydrated,
      }) => ({
        addRecipe,
        currentRecipe,
        setCurrentRecipe,
        clearCurrentRecipe,
        currentRecipeVersion,
        hasHydrated,
      }),
    ),
  );

  const methods = useForm<RecipeFormData>({
    defaultValues: currentRecipe ?? defaultEmptyValues,
  });

  const { register, control, handleSubmit, setFocus, reset, watch } = methods;

  // Sync the RHF form with the persisted draft from the Zustand store.
  //
  // Problem: `useForm` captures `defaultValues` at mount time. If the store has
  // not yet rehydrated from localStorage (Zustand `persist`), the form mounts
  // with empty defaults and never sees the restored draft even after `hasHydrated`
  // turns true.
  //
  // Additionally, `addIngredientsToCurrentRecipe` can merge ingredients into the
  // draft from outside this form (e.g. the ingredients calculator). The form
  // won't reflect those changes because they happen via the store, not via RHF.
  //
  // Solution: `prevVersionRef` tracks the last version we synced from. A `reset()`
  // is triggered when:
  //   1. First sync after hydration (`prevVersionRef.current === null`), or
  //   2. The store version has advanced (`prevVersionRef.current !== currentRecipeVersion`),
  //      meaning an external write (e.g. `addIngredientsToCurrentRecipe`) changed
  //      the draft.
  //
  // Ordinary user typing does NOT bump `currentRecipeVersion` — the watch
  // subscription calls `setCurrentRecipe`, which does not increment the version —
  // so the form is never reset on each keystroke.
  const prevVersionRef = useRef<number | null>(null);

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  useEffect(() => {
    if (!hasHydrated || !currentRecipe) return;
    if (
      prevVersionRef.current === null ||
      prevVersionRef.current !== currentRecipeVersion
    ) {
      reset(currentRecipe);
      prevVersionRef.current = currentRecipeVersion;
    }
  }, [hasHydrated, currentRecipe, reset, currentRecipeVersion]);

  // Debounce-persist the in-progress draft to the Zustand store (and via
  // `persist`, to localStorage) so the user's work survives a page refresh.
  //
  // `watch` fires on every field change; the 300 ms debounce batches rapid
  // keystrokes into a single `setCurrentRecipe` call instead of writing on
  // every character.
  //
  // The `hasHydrated` guard prevents overwriting a persisted draft with the
  // stale in-memory initial values before the store finishes rehydrating from
  // localStorage.
  //
  // Cleanup unsubscribes the RHF watcher and cancels any pending timeout on
  // unmount to avoid stale state updates.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const subscription = watch((value) => {
      if (!hasHydrated) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCurrentRecipe(value as RecipeFormData);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, setCurrentRecipe, hasHydrated]);

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
    setOpenRecipe((newRecipeOpen) => {
      if (newRecipeOpen === "new-recipe") return "";
      return "new-recipe";
    });
  };

  const { fields } = useFieldArray({
    control,
    name: "ingredients",
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
              placeholder={"Enter new recipe name"}
              id={"name"}
              type={"search"}
              {...register("name")}
            />
            <AccordionSubheader ingredientsLength={fields.length} />
          </div>
          <AccordionTrigger tabIndex={-1} />
        </AccordionHeader>

        <AccordionContent>
          <IngredientArrayForm
            submitHandler={handleSubmit(onSubmitHandler)}
            resetHandler={recipeReset}
          />
        </AccordionContent>
      </FormProvider>
    </form>
  );
};