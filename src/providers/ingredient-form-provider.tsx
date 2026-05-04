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
    name: "",
    price: "" as unknown as number,
    quantity: "" as unknown as number,
    capacity: "" as unknown as number,
    unit: "" as UnitType,
  },
});

// TODO: check if switching to regular useForm works
export const ingredientReset = () => {
  ingredientSetValue("name", "");
  ingredientSetValue("price", "" as unknown as number);
  ingredientSetValue("quantity", "" as unknown as number);
  ingredientSetValue("capacity", "" as unknown as number);
  ingredientSetValue("unit", "" as UnitType);
};