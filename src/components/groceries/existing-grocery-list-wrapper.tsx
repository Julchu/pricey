import { GroceryListFormData } from "@/utils/interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { ExistingGroceryListForm } from "@/components/groceries/existing-grocery-list-form";
import { ExistingGroceryListChecklist } from "@/components/groceries/existing-grocery-list-checklist";

export const ExistingGroceryList = ({
  groceryList,
  setOpenList,
  last,
}: {
  groceryList: GroceryListFormData;
  setOpenList: Dispatch<SetStateAction<string>>;
  last: boolean;
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
        closeEditingCallback={closeEditingCallback}
        deleteListCallback={deleteListCallback}
        last={last}
      />
    );
  }

  return (
    <ExistingGroceryListChecklist
      groceryList={groceryList}
      startEditing={startEditingCallback}
      last={last}
    />
  );
};