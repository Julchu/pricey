import { UnitType } from "@/utils/interfaces";
import { Input } from "@/components/ui/input";
import { GroceryFormIngredientUnitSelect } from "@/components/ui/unit-select";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BagCheckIcon } from "@/components/icons/grocery-bag/check";
import { BagAddIcon } from "@/components/icons/grocery-bag/add";
import { BagDeleteIcon } from "@/components/icons/grocery-bag/delete";
import { PriceDisplay } from "@/components/ui/price-display";
import { IngredientCombobox } from "@/components/ui/ingredient-combobox";
import { TotalPriceDisplay } from "@/components/ui/total-price-display";
import { Field } from "@base-ui/react/field";

export const IngredientArrayForm = ({
  submitHandler,
  resetHandler,
}: {
  submitHandler: () => void;
  resetHandler: () => void;
}) => {
  const { control, register, getFieldState, formState } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <div
      className={"bg-card-white relative flex flex-col gap-4 p-4 font-medium"}
    >
      <div className={"flex flex-col gap-4"}>
        {fields.map((field, index) => {
          const nameState = getFieldState(
            `ingredients.${index}.name`,
            formState,
          );
          const quantityState = getFieldState(
            `ingredients.${index}.quantity`,
            formState,
          );
          const capacityState = getFieldState(
            `ingredients.${index}.capacity`,
            formState,
          );

          return (
            <div
              className={
                "flex w-full flex-col rounded-md border border-gray-200 p-4 lg:border-none lg:p-0"
              }
              key={field.id}
            >
              <div
                className={
                  "flex flex-row items-center justify-between lg:hidden"
                }
              >
                {<p>Ingredient {index + 1}</p>}
                <button
                  className={
                    "group flex h-10 w-auto cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 p-4 hover:bg-red-500 hover:text-white"
                  }
                  name={"remove-ingredient"}
                  onClick={() => remove(index)}
                >
                  <BagDeleteIcon
                    className={
                      "h-6 fill-none stroke-red-500 group-hover:stroke-white"
                    }
                  />
                  Delete
                </button>
              </div>
              <div
                className={
                  "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-14"
                }
              >
                {/* Name */}
                <Field.Root
                  className={"relative col-span-4 sm:col-span-2 lg:col-span-4"}
                  invalid={nameState.invalid}
                  touched={nameState.isTouched}
                  dirty={nameState.isDirty}
                >
                  <Field.Label
                    className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  >
                    Name
                  </Field.Label>
                  <IngredientCombobox index={index} />
                  <Field.Error className="mt-1 text-xs text-red-500">
                    {nameState.error?.message}
                  </Field.Error>
                </Field.Root>

                {/* Price (read-only computed, no validation) */}
                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <Field.Root>
                    <Field.Label
                      className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                    >
                      Price
                    </Field.Label>
                    <PriceDisplay index={index} />
                  </Field.Root>
                </div>

                {/* Quantity */}
                <Field.Root
                  className={"col-span-2 sm:col-span-1 lg:col-span-2"}
                  invalid={quantityState.invalid}
                  touched={quantityState.isTouched}
                  dirty={quantityState.isDirty}
                >
                  <Field.Label
                    className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  >
                    (Quantity)
                  </Field.Label>
                  <Input
                    placeholder={"6"}
                    type={"number"}
                    {...register(`ingredients.${index}.quantity`, {
                      min: { value: 0, message: "Must be ≥ 0" },
                      setValueAs: (val) => (val ? Number(val) : ""),
                    })}
                  />
                  <Field.Error className="mt-1 text-xs text-red-500">
                    {quantityState.error?.message}
                  </Field.Error>
                </Field.Root>

                {/* Capacity */}
                <Field.Root
                  className={"col-span-2 sm:col-span-1 lg:col-span-2"}
                  invalid={capacityState.invalid}
                  touched={capacityState.isTouched}
                  dirty={capacityState.isDirty}
                >
                  <Field.Label
                    className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  >
                    Capacity
                  </Field.Label>
                  <Input
                    placeholder={"0.710"}
                    step={"0.001"}
                    type={"number"}
                    {...register(`ingredients.${index}.capacity`, {
                      min: { value: 0, message: "Must be ≥ 0" },
                      setValueAs: (val) => (val ? Number(val) : ""),
                    })}
                  />
                  <Field.Error className="mt-1 text-xs text-red-500">
                    {capacityState.error?.message}
                  </Field.Error>
                </Field.Root>

                {/* Unit */}
                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <Field.Root>
                    <Field.Label
                      className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                    >
                      Unit
                    </Field.Label>
                    <GroceryFormIngredientUnitSelect index={index} />
                  </Field.Root>
                </div>

                {/* Desktop delete button column */}
                <div className={"group col-span-2 hidden flex-col lg:block"}>
                  <Field.Root>
                    <Field.Label
                      className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                    >
                      &nbsp;
                    </Field.Label>

                    <button
                      className={
                        "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-red-500 group-hover:text-white"
                      }
                      name={"remove-ingredient"}
                      onClick={() => remove(index)}
                    >
                      <BagDeleteIcon
                        className={
                          "h-6 fill-none stroke-red-500 group-hover:stroke-white"
                        }
                      />
                      Delete
                    </button>
                  </Field.Root>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200" />

      <div
        className={
          "grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-14"
        }
      >
        <div
          className={
            "col-span-1 flex h-10 flex-col items-end justify-center text-center sm:col-start-2 lg:col-span-2 lg:col-start-11"
          }
        >
          Total cost:
        </div>
        <div
          className={
            "col-span-1 flex h-10 flex-col justify-center rounded-md border border-gray-200 sm:col-start-3 lg:col-span-2 lg:col-start-13"
          }
        >
          <TotalPriceDisplay />
        </div>
      </div>

      {/* Save buttons bar */}
      <div
        className={
          "grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-14"
        }
      >
        <div
          className={"group col-span-2 sm:col-span-1 lg:order-1 lg:col-span-2"}
        >
          <button
            className={
              "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-blue-500 group-hover:text-white"
            }
            type="button"
            onClick={() =>
              append({
                name: "",
                capacity: "" as unknown as number,
                quantity: "" as unknown as number,
                unit: "" as UnitType,
                ingredientPublicId: undefined,
              })
            }
          >
            <BagAddIcon
              className={
                "h-6 fill-none stroke-blue-500 group-hover:stroke-white"
              }
            />
            Item
          </button>
        </div>

        <div
          className={
            "group sm:col-start-2 lg:col-span-2 lg:col-start-9 lg:col-end-11"
          }
        >
          <button
            className={
              "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-red-500 group-hover:text-white"
            }
            onClick={resetHandler}
            type={"reset"}
          >
            <CircleResetIcon
              className={"fill-blue-500 group-hover:fill-white"}
            />
            Cancel
          </button>
        </div>

        <div className={"group sm:col-start-3 lg:col-span-2 lg:col-start-11"}>
          <button
            className={
              "group-hover:white flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-blue-500 font-medium tracking-widest text-white group-hover:bg-green-500"
            }
            onClick={submitHandler}
            type={"button"}
          >
            <BagCheckIcon className={"h-6 animate-pulse"} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};