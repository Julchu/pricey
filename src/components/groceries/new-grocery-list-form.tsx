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
    setCurrentGroceryList,
    clearCurrentGroceryList,
    addGroceryList,
    currentGroceryList,
    currentGroceryListVersion,
    hasHydrated,
  } = useGroceryListsStore(
    useShallow(
      ({
        setCurrentGroceryList,
        clearCurrentGroceryList,
        addGroceryList,
        currentGroceryList,
        currentGroceryListVersion,
        hasHydrated,
      }) => ({
        setCurrentGroceryList,
        clearCurrentGroceryList,
        addGroceryList,
        currentGroceryList,
        currentGroceryListVersion,
        hasHydrated,
      }),
    ),
  );

  const methods = useForm<GroceryListFormData>({
    defaultValues: currentGroceryList ?? defaultEmptyValues,
  });

  const { register, handleSubmit, setFocus, control, reset, watch } = methods;

  const prevVersionRef = useRef<number | null>(null);

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  useEffect(() => {
    if (!hasHydrated || !currentGroceryList) return;
    if (
      prevVersionRef.current === null ||
      prevVersionRef.current !== currentGroceryListVersion
    ) {
      reset(currentGroceryList);
      prevVersionRef.current = currentGroceryListVersion;
    }
  }, [hasHydrated, currentGroceryList, reset, currentGroceryListVersion]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const subscription = watch((value) => {
      if (!hasHydrated) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCurrentGroceryList(value as GroceryListFormData);
      }, 300);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, setCurrentGroceryList, hasHydrated]);

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