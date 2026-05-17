"use client";
import { UnitType } from "@/utils/interfaces";
import { IngredientLabel, Input } from "@/components/ui/input";
import { GroceryFormIngredientUnitSelect } from "@/components/ui/unit-select";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BagCheckIcon } from "@/components/icons/grocery-bag/check";
import { BagAddIcon } from "@/components/icons/grocery-bag/add";
import { BagDeleteIcon } from "@/components/icons/grocery-bag/delete";
import { PriceDisplay } from "@/components/ui/price-display";
import { IngredientCombobox } from "@/components/ui/ingredient-combobox";
import { TotalPriceDisplay } from "@/components/ui/total-price-display";

export const IngredientArrayForm = ({
  submitAction,
  resetAction,
}: {
  submitAction: () => void;
  resetAction: () => void;
}) => {
  const { control, register } = useFormContext();

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
                <div
                  className={"relative col-span-4 sm:col-span-2 lg:col-span-4"}
                >
                  <IngredientLabel htmlFor={"ingredient-name"} index={index}>
                    Name
                  </IngredientLabel>

                  <IngredientCombobox index={index} />
                </div>

                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <IngredientLabel htmlFor={"price"} index={index}>
                    Price
                  </IngredientLabel>
                  <PriceDisplay index={index} />
                </div>

                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <IngredientLabel htmlFor={"quantity"} index={index}>
                    (Quantity)
                  </IngredientLabel>
                  <Input
                    placeholder={"6"}
                    id={"quantity"}
                    type={"number"}
                    {...register(`ingredients.${index}.quantity`, {
                      setValueAs: (val) => (val ? Number(val) : ""),
                    })}
                  />
                </div>

                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <IngredientLabel htmlFor={"capacity"} index={index}>
                    Capacity
                  </IngredientLabel>
                  <Input
                    placeholder={"0.710"}
                    step={"0.001"}
                    id={"capacity"}
                    type={"number"}
                    {...register(`ingredients.${index}.capacity`, {
                      setValueAs: (val) => (val ? Number(val) : ""),
                    })}
                  />
                </div>

                <div className={"col-span-2 sm:col-span-1 lg:col-span-2"}>
                  <IngredientLabel htmlFor={"unit"} index={index}>
                    Unit
                  </IngredientLabel>
                  <GroceryFormIngredientUnitSelect index={index} />
                </div>

                <div className={"group col-span-2 hidden flex-col lg:block"}>
                  <IngredientLabel htmlFor={"unit"} index={index}>
                    &nbsp;
                  </IngredientLabel>
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
            onClick={resetAction}
            type={"reset"}
          >
            <CircleResetIcon
              className={"h-6 fill-blue-500 group-hover:fill-white"}
            />
            Cancel
          </button>
        </div>

        <div className={"group sm:col-start-3 lg:col-span-2 lg:col-start-11"}>
          <button
            className={
              "group-hover:white flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-blue-500 font-medium tracking-widest text-white group-hover:bg-green-500"
            }
            onClick={submitAction}
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