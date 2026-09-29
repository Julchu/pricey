"use client";
import { Accordion } from "@base-ui/react/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { NewGroceryListForm } from "./new-grocery-list-form";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useState } from "react";
import { ExistingGroceryList } from "@/components/groceries/existing-grocery-list-wrapper";

export const GroceryListAccordion = () => {
  const groceryLists = useGroceryListsStore(({ groceryLists }) => groceryLists);
  const [openList, setOpenList] = useState("new-list");

  return (
    <Accordion.Root
      className={"flex w-full flex-col gap-px"}
      value={[openList]}
      onValueChange={(values) => setOpenList(values[0] ?? "")}
    >
      <AccordionItem value={"new-list"}>
        <NewGroceryListForm setOpenList={setOpenList} />
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