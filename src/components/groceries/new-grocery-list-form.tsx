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
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { IngredientArrayForm } from "@/components/ui/ingredient-array-form";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";
import { useShallow } from "zustand/react/shallow";

export const NewGroceryListForm = ({
  setOpenListAction,
}: {
  setOpenListAction: Dispatch<SetStateAction<string>>;
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
    setCurrentGroceryList,
    clearCurrentGroceryList,
    addGroceryList,
    currentGroceryList,
  } = useGroceryListsStore(
    useShallow(
      ({
        setCurrentGroceryList,
        clearCurrentGroceryList,
        addGroceryList,
        currentGroceryList,
      }) => ({
        setCurrentGroceryList,
        clearCurrentGroceryList,
        addGroceryList,
        currentGroceryList,
      }),
    ),
  );

  const methods = useForm<GroceryListFormData>({
    defaultValues: currentGroceryList ?? defaultEmptyValues,
  });

  const { register, handleSubmit, setFocus, control, reset, watch } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Sync form changes to the store so draft state persists while typing
  // TODO: try using getValues() instead
  useEffect(() => {
    const subscription = watch((value) => {
      setCurrentGroceryList(value as GroceryListFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setCurrentGroceryList]);

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
    setOpenListAction((newListOpen) => {
      if (newListOpen === "new-list") return "";
      return "new-list";
    });
  };

  const [ingredients] = useWatch({
    control,
    name: ["ingredients"],
  });

  const groceryListReset = () => {
    reset(defaultEmptyValues);
    clearCurrentGroceryList();
  };

  return (
    <form>
      <FormProvider {...methods}>
        <AccordionHeader
          className={
            // "flex h-auto flex-col items-center rounded-t-md px-0 text-white data-[state=closed]:rounded-b-md" // here
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
            <AccordionSubheader ingredientsLength={ingredients.length} />
          </div>
          <AccordionTrigger tabIndex={-1} />
        </AccordionHeader>

        <AccordionContent>
          <IngredientArrayForm
            submitAction={handleSubmit(onSubmitHandler)}
            resetAction={groceryListReset}
          />
        </AccordionContent>
      </FormProvider>
    </form>
  );
};