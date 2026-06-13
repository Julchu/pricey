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
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { useShallow } from "zustand/react/shallow";

export const NewGroceryListForm = ({
  setOpenList,
}: {
  setOpenList: Dispatch<SetStateAction<string>>;
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
    setNewGroceryList,
    clearNewGroceryList,
    addGroceryList,
    newGroceryList,
    newGroceryListVersion,
    hasHydrated,
  } = useGroceryListsStore(
    useShallow(
      ({
        setNewGroceryList,
        clearNewGroceryList,
        addGroceryList,
        newGroceryList,
        newGroceryListVersion,
        hasHydrated,
      }) => ({
        setNewGroceryList,
        clearNewGroceryList,
        addGroceryList,
        newGroceryList,
        newGroceryListVersion,
        hasHydrated,
      }),
    ),
  );

  const methods = useForm<GroceryListFormData>({
    defaultValues: newGroceryList ?? defaultEmptyValues,
  });

  const { register, handleSubmit, setFocus, control, reset, watch } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Sync the RHF form with the persisted draft from the Zustand store.
  //
  // Problem: `useForm` captures `defaultValues` at mount time. If the store has
  // not yet rehydrated from localStorage (Zustand `persist`), the form mounts
  // with empty defaults and never sees the restored draft even after `hasHydrated`
  // turns true.
  //
  // Additionally, `addIngredientsToNewList` can merge ingredients into the draft
  // from outside this form (e.g. the ingredients calculator). The form won't
  // reflect those changes because they happen via the store, not via RHF.
  //
  // Solution: `prevVersionRef` tracks the last version we synced from. A `reset()`
  // is triggered when:
  //   1. First sync after hydration (`prevVersionRef.current === null`), or
  //   2. The store version has advanced (`prevVersionRef.current !== newGroceryListVersion`),
  //      meaning an external write (e.g. `addIngredientsToNewList`) changed the draft.
  //
  // Ordinary user typing does NOT bump `newGroceryListVersion` — the watch
  // subscription calls `setNewGroceryList`, which does not increment the version —
  // so the form is never reset on each keystroke.
  const prevVersionRef = useRef<number | null>(null);
  useEffect(() => {
    if (!hasHydrated || !newGroceryList) return;
    if (
      prevVersionRef.current === null ||
      prevVersionRef.current !== newGroceryListVersion
    ) {
      reset(newGroceryList);
      prevVersionRef.current = newGroceryListVersion;
    }
  }, [hasHydrated, newGroceryList, reset, newGroceryListVersion]);

  // TODO: clean up/simplify debouncing saving current list
  // Debounce-persist the in-progress draft to the Zustand store (and via
  // `persist`, to localStorage) so the user's work survives a page refresh.
  //
  // `watch` fires on every field change; the 300 ms debounce batches rapid
  // keystrokes into a single `setNewGroceryList` call instead of writing on
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
        setNewGroceryList(value as GroceryListFormData);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, setNewGroceryList, hasHydrated]);

  const onSubmitHandler: SubmitHandler<GroceryListFormData> = async (
    groceryListData,
  ) => {
    // TODO: check if use server works
    // "use server";

    const submitResponse = await fetch("/api/grocery-list", {
      method: "POST",
      body: JSON.stringify(groceryListData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (groceryListData.image) {
    //   URL.revokeObjectURL(groceryListData.image);
    // }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { groceryList } = response;
      addGroceryList(groceryList);
      groceryListReset();
    }
  };

  const toggleHeader = () => {
    setOpenList((newListOpen) => {
      if (newListOpen === "new-list") return "";
      return "new-list";
    });
  };

  const { fields } = useFieldArray({
    control,
    name: "ingredients",
  });

  const groceryListReset = () => {
    reset(defaultEmptyValues);
    clearNewGroceryList();
  };

  return (
    <form>
      <FormProvider {...methods}>
        <AccordionHeader
          className={
            // "flex h-auto flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md"
            "flex h-auto flex-col items-center rounded-t-md px-0 text-white"
          }
        >
          <div onClick={toggleHeader} className={"pl-4"}>
            <ImageUploadIcon />
          </div>

          <div className={"flex w-full flex-col"}>
            <Input
              className={
                "border-none bg-blue-500 font-medium focus:outline-none sm:text-xl"
              }
              placeholder={"Enter new grocery list name "}
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
            resetHandler={groceryListReset}
          />
        </AccordionContent>
      </FormProvider>
    </form>
  );
};