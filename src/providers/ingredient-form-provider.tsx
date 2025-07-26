import { createFormControl } from "react-hook-form";
import { IngredientFormData, UnitType } from "@/utils/interfaces";

export const {
  formControl: ingredientFormControl,
  control: ingredientControl,
  handleSubmit: handleIngredientSubmit,
  register: ingredientRegister,
  getFieldState: getIngredientFieldState,
  reset,
  setValue: ingredientSetValue,
} = createFormControl<IngredientFormData>({
  mode: "onChange", // when to trigger validating fields
  defaultValues: {
    name: undefined,
    price: undefined,
    quantity: undefined,
    capacity: undefined,
    unit: undefined,
  },
});

export const ingredientReset = () => {
  ingredientSetValue("unit", undefined as unknown as UnitType);
  reset();
};