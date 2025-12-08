"use client";
import { AccordionContent, AccordionHeader, AccordionTrigger, } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import {
  groceryListControl,
  groceryListRegister,
  groceryListReset,
  groceryListSetFocus,
  handleGroceryListSubmit,
} from "@/providers/new-grocery-list-form-provider";
import { SubmitHandler } from "react-hook-form";
import { GroceryListFormData } from "@/utils/interfaces";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";

export const NewGroceryListForm = () => {
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
    console.log(groceryListData);

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

  return (
    <form>
      <AccordionHeader className={"flex h-full flex-row gap-4 px-0 text-white"}>
        <Input
          className={"bg-blue-500 font-medium focus:outline-none"}
          autoComplete={"name"}
          placeholder={"Enter new grocery list name "}
          id={"name"}
          type={"search"}
          {...groceryListRegister("name")}
        />
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