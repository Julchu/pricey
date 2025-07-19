"use client";
import { Accordion } from "radix-ui";
import { useGroceryListsStore } from "@/stores/grocery-lists-store";
// TODO: test if can remove * as React
import * as React from "react";
import { AccordionItem } from "@/components/ui/accordion";
import { ExistingGroceryListForm } from "./existing-grocery-list-form";
import { NewGroceryListForm } from "./new-grocery-list-form";

export const GroceryListAccordion = () => {
  const groceryLists = useGroceryListsStore(({ groceryLists }) => groceryLists);

  return (
    <Accordion.Root
      className={
        "h-full w-full rounded-md text-white shadow-[0_2px_10px] shadow-black/5"
      }
      type={"multiple"}
    >
      <AccordionItem value={"new-list"}>
        <NewGroceryListForm />
      </AccordionItem>

      {groceryLists.map((groceryList, index) => (
        <AccordionItem
          key={`${groceryList.name}_${index}`}
          value={`${groceryList.name}`}
        >
          <ExistingGroceryListForm groceryList={groceryList} />
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
};