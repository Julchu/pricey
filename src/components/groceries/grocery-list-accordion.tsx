"use client";
import { Accordion } from "radix-ui";
import { AccordionItem } from "@/components/ui/accordion";
import { NewGroceryListForm } from "./new-grocery-list-form";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useState } from "react";
import { ExistingGroceryList } from "@/components/groceries/existing-grocery-list-wrapper";

export const GroceryListAccordion = () => {
  const groceryLists = useGroceryListsStore(({ groceryLists }) => groceryLists);
  const currentGroceryListVersion = useGroceryListsStore(
    (state) => state.currentGroceryListVersion,
  );
  const [openList, setOpenList] = useState<string>("new-list");

  // TODO: switch new grocery list form back to useForm
  return (
    <Accordion.Root
      // className={"flex w-full flex-col gap-4"} // here
      className={"flex w-full flex-col gap-px"}
      type={"single"}
      collapsible
      defaultValue={"new-list"}
      value={openList}
      onValueChange={setOpenList}
    >
      <AccordionItem value={"new-list"}>
        <NewGroceryListForm
          key={currentGroceryListVersion}
          setOpenListAction={setOpenList}
        />
      </AccordionItem>

      {groceryLists.map((groceryList, index) => (
        <AccordionItem
          key={`${groceryList.name}_${index}`}
          value={`${groceryList.publicId}`}
        >
          <ExistingGroceryList
            groceryList={groceryList}
            setOpenList={setOpenList}
            last={index === groceryLists.length - 1}
          />
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
};