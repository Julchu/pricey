"use client";
import { AccordionContent, AccordionHeader, AccordionSubheader, AccordionTrigger, } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  groceryListControl,
  groceryListRegister,
  groceryListReset,
  groceryListSetFocus,
  handleGroceryListSubmit,
} from "@/providers/new-grocery-list-form-provider";
import { SubmitHandler, useWatch } from "react-hook-form";
import { GroceryListFormData } from "@/utils/interfaces";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import { CircleAddIcon } from "@/components/icons/circle-add-icon";

export const NewGroceryListForm = ({
  setOpenListAction,
}: {
  setOpenListAction: Dispatch<SetStateAction<string>>;
}) => {
  const [dateString, setDateString] = useState("");
  useEffect(() => {
    groceryListSetFocus("name");
  }, []);

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
    control: groceryListControl,
    name: ["ingredients"],
  });

  useEffect(() => {
    setDateString(
      new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
  }, []);

  return (
    <form>
      <AccordionHeader
        className={"flex h-full flex-col items-center px-0 text-white"}
      >
        <div onClick={toggleHeader} className={"pl-4"}>
          <CircleAddIcon />
        </div>

        <div className={"flex w-full flex-col"}>
          <Input
            className={"`font-medium bg-blue-500 focus:outline-none sm:text-xl"}
            autoComplete={"name"}
            placeholder={"Enter new grocery list name "}
            id={"name"}
            type={"search"}
            {...groceryListRegister("name")}
          />
          <AccordionSubheader
            ingredientsLength={ingredients.length}
            dateString={dateString}
          />
        </div>
        <AccordionTrigger tabIndex={-1} />
      </AccordionHeader>

      <AccordionContent>
        <IngredientArrayForm
          control={groceryListControl}
          submitAction={handleGroceryListSubmit(onSubmitHandler)}
          resetAction={groceryListReset}
        />
      </AccordionContent>
    </form>
  );
};