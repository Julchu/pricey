import { createFormControl } from "react-hook-form";
import { GroceryListFormData } from "@/utils/interfaces";

export const {
  formControl: groceryListFormControl,
  control: groceryListControl,
  handleSubmit: handleGroceryListSubmit,
  register: groceryListRegister,
  getFieldState: getGroceryListFieldState,
  reset,
  setValue: groceryListSetValue,
} = createFormControl<GroceryListFormData>({
  mode: "onChange", // when to trigger validating fields
  defaultValues: {
    name: undefined,
    ingredients: undefined,
    public: undefined,
  },
});

export const groceryListReset = () => {
  reset();
  // TODO: set grocery list ingredient unit as ""
  // groceryListSetValue("unit", "" as UnitType);
};