"use client";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useFieldArray } from "@hookform/lenses/rhf";
import { IngredientLabel, Input } from "@/components/ui/input";
import { GroceryFormIngredientUnitSelect } from "@/components/ui/unit-select";
import { CircleMinusIcon } from "@/components/icons/circle-minus-icon";
import { CircleAddIcon } from "@/components/icons/circle-add-icon";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { SaveCartIcon } from "@/components/icons/cart/save-cart-icon";
import { Control } from "react-hook-form";
import { useLens } from "@hookform/lenses";

export const IngredientArrayForm = ({
  control,
  submitAction,
  resetAction,
}: {
  control: Control<GroceryListFormData>;
  submitAction: () => void;
  resetAction: () => void;
}) => {
  const ingredientsLens = useLens({ control }).focus("ingredients");

  const { fields, append, remove } = useFieldArray(ingredientsLens.interop());

  // const onError: SubmitErrorHandler<GroceryListFormData> = async (errors) =>
  //   console.log(errors);

  return (
    <div className={"relative flex h-full flex-col gap-4 font-medium"}>
      <span className={"flex h-full flex-col gap-4"}>
        {ingredientsLens.map(fields, (value, l, index) => {
          return (
            <div className={"flex w-full flex-row gap-4"} key={value.id}>
              <div
                className={
                  "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
                }
              >
                <div className={"col-span-2 sm:col-span-3"}>
                  <IngredientLabel htmlFor={"name"} index={index}>
                    Name
                  </IngredientLabel>

                  <Input
                    autoComplete={"name"}
                    className={"w-full"}
                    placeholder={"Pepsi"}
                    id={"name"}
                    type={"search"}
                    {...l
                      .focus("name")
                      .interop(({ register }, name) => register(name))}
                  />
                </div>

                <div className={"col-span-2 sm:col-span-1"}>
                  <IngredientLabel htmlFor={"quantity"} index={index}>
                    (Quantity)
                  </IngredientLabel>
                  <Input
                    placeholder={"6"}
                    id={"quantity"}
                    type={"number"}
                    {...l
                      .focus("quantity")
                      .interop(({ register }, name) => register(name))}
                  />
                </div>

                <div className={"col-span-2 sm:col-span-1"}>
                  <IngredientLabel htmlFor={"capacity"} index={index}>
                    Capacity
                  </IngredientLabel>
                  <Input
                    placeholder={"0.710"}
                    step={"0.001"}
                    id={"capacity"}
                    type={"number"}
                    {...l
                      .focus("capacity")
                      .interop(({ register }, name) => register(name))}
                  />
                </div>

                <div className={"col-span-2 sm:col-span-1"}>
                  <IngredientLabel htmlFor={"unit"} index={index}>
                    Unit
                  </IngredientLabel>
                  <GroceryFormIngredientUnitSelect
                    control={control}
                    index={index}
                  />
                </div>
              </div>

              <div>
                <IngredientLabel htmlFor={"remove-ingredient"} index={index}>
                  Modify
                </IngredientLabel>
                <button
                  name={"remove-ingredient"}
                  className={
                    "flex min-h-10 w-full cursor-pointer flex-row items-center rounded-md bg-blue-100 px-[15px] text-black"
                  }
                  onClick={() => remove(index)}
                >
                  <CircleMinusIcon />
                </button>
              </div>
            </div>
          );
        })}
      </span>

      <span>
        <div className={"flex flex-row gap-4 pt-2 text-black lg:pt-0"}>
          <div
            className={
              "grid w-full grid-cols-2 grid-rows-1 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            }
          >
            <div className={"sm:col-start-2 lg:col-start-5"}>
              <button
                className={
                  "text-md flex h-10 w-full cursor-pointer items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
                }
                onClick={resetAction}
                type={"reset"}
              >
                <CircleResetIcon />
                Reset
              </button>
            </div>

            <div className={"sm:col-start-3 lg:col-start-6"}>
              <button
                className={
                  "text-md flex h-10 w-full cursor-pointer items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
                }
                onClick={submitAction}
                type={"button"}
              >
                <SaveCartIcon />
                Save
              </button>
            </div>
          </div>
          <div className={"flex flex-col justify-center"}>
            <button
              className={
                "flex min-h-10 w-full cursor-pointer flex-row items-center rounded-md bg-blue-100 px-[15px] text-black"
              }
              type="button"
              onClick={() =>
                append({
                  name: "",
                  capacity: "" as unknown as number,
                  quantity: "" as unknown as number,
                  unit: "" as UnitType,
                })
              }
            >
              <CircleAddIcon />
            </button>
          </div>
        </div>
      </span>
    </div>
  );
};