"use client";
import {
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { IngredientArrayForm } from "@/components/groceries/ingredient-array-form";
import * as React from "react";
import { useEffect } from "react";
import {
  groceryListControl,
  groceryListRegister,
  groceryListSetFocus,
} from "@/providers/new-grocery-list-form-provider";

export const NewGroceryListForm = () => {
  useEffect(() => {
    groceryListSetFocus("name");
  }, []);

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
        <IngredientArrayForm control={groceryListControl} />
      </AccordionContent>
    </form>
  );
};