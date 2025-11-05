import { createFormControl } from "react-hook-form";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";

export const {
  formControl: groceryListFormControl,
  control: groceryListControl,
  handleSubmit: handleGroceryListSubmit,
  register: groceryListRegister,
  getFieldState: getGroceryListFieldState,
  reset,
  setValue: groceryListSetValue,
  setFocus: groceryListSetFocus,
} = createFormControl<GroceryListFormData>({
  mode: "onChange", // when to trigger validating fields
  defaultValues: {
    name: undefined,
    ingredients: [
      {
        name: "",
        price: "" as unknown as number,
        quantity: "" as unknown as number,
        capacity: "" as unknown as number,
        unit: "" as UnitType,
      },
    ],
    public: false,
  },
});

export const groceryListReset = () => {
  groceryListSetValue("ingredients", [
    {
      name: "",
      price: "" as unknown as number,
      quantity: "" as unknown as number,
      capacity: "" as unknown as number,
      unit: "" as UnitType,
    },
  ]);
  reset();
};