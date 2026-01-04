"use client";
import { Accordion } from "radix-ui";
import { AccordionItem } from "@/components/ui/accordion";
import { ExistingGroceryListForm } from "./existing-grocery-list-form";
import { NewGroceryListForm } from "./new-grocery-list-form";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { GroceryListFormData } from "@/utils/interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { ExistingGroceryListChecklist } from "@/components/groceries/existing-grocery-list-checklist";

export const GroceryListAccordion = () => {
  const groceryLists = useGroceryListsStore(({ groceryLists }) => groceryLists);
  const [openList, setOpenList] = useState<string>("new-list");

  return (
    <Accordion.Root
      className={"h-full w-full rounded-md"}
      type={"single"}
      collapsible
      defaultValue={"new-list"}
      value={openList}
      onValueChange={setOpenList}
    >
      <AccordionItem value={"new-list"}>
        <NewGroceryListForm setOpenListAction={setOpenList} />
      </AccordionItem>

      {groceryLists.map((groceryList, index) => (
        <AccordionItem
          key={`${groceryList.name}_${index}`}
          value={`${groceryList.publicId}`}
        >
          <ExistingGroceryList
            groceryList={groceryList}
            setOpenList={setOpenList}
          />
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
};

const ExistingGroceryList = ({
  groceryList,
  setOpenList,
}: {
  groceryList: GroceryListFormData;
  setOpenList: Dispatch<SetStateAction<string>>;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const deleteListCallback = () => {
    setIsEditing(false);
    setOpenList((currentlyOpenList) => {
      if (currentlyOpenList === groceryList.publicId) return "new-list";
      return currentlyOpenList;
    });
  };

  const closeEditingCallback = () => {
    setIsEditing(false);
  };

  const startEditingCallback = () => {
    setIsEditing(true);
    if (groceryList.publicId) setOpenList(groceryList.publicId);
  };

  if (isEditing) {
    return (
      <ExistingGroceryListForm
        groceryList={groceryList}
        closeEditingCallbackAction={closeEditingCallback}
        deleteListCallbackAction={deleteListCallback}
      />
    );
  }

  return (
    <ExistingGroceryListChecklist
      groceryList={groceryList}
      startEditingAction={startEditingCallback}
    />
  );
};