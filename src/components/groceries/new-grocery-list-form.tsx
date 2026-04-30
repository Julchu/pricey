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
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { ImageUploadIcon } from "@/components/icons/image-upload-icon";

export const NewGroceryListForm = ({
  setOpenListAction,
}: {
  setOpenListAction: Dispatch<SetStateAction<string>>;
}) => {
  const methods = useForm<GroceryListFormData>({
    defaultValues: {
      name: undefined,
      ingredients: [
        {
          name: "",
          quantity: "" as unknown as number,
          capacity: "" as unknown as number,
          unit: "" as UnitType,
          ingredientPublicId: undefined,
          //   image
        },
      ],
      public: false,
    },
  });

  const { register, handleSubmit, setFocus, setValue, control, reset } =
    methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const addGroceryList = useGroceryListsStore(
    ({ addGroceryList }) => addGroceryList,
  );

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
    setValue("ingredients", [
      {
        name: undefined as unknown as string,
        quantity: undefined as unknown as number,
        capacity: undefined as unknown as number,
        unit: undefined as unknown as UnitType,
        ingredientPublicId: undefined,
      },
    ]);
    reset();
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
              autoComplete={"name"}
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