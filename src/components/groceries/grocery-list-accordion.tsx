"use client";
import { Accordion } from "radix-ui";
// TODO: test if can remove * as React
import * as React from "react";
import { AccordionItem } from "@/components/ui/accordion";
import { ExistingGroceryListForm } from "./existing-grocery-list-form";
import { NewGroceryListForm } from "./new-grocery-list-form";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";

export const GroceryListAccordion = () => {
  const groceryLists = useGroceryListsStore(({ groceryLists }) => groceryLists);

  return (
    <Accordion.Root
      className={"h-full w-full rounded-md text-white"}
      type="single"
      collapsible
      defaultValue={"new-list"}
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