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
  ingredientSetValue("name", undefined as unknown as string);
  ingredientSetValue("price", undefined as unknown as number);
  ingredientSetValue("quantity", undefined as unknown as number);
  ingredientSetValue("capacity", undefined as unknown as number);
  ingredientSetValue("unit", undefined as unknown as UnitType);
};