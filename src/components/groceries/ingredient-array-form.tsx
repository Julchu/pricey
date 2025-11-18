"use client";
import { GroceryListFormData, UnitType } from "@/utils/interfaces";
import { useFieldArray } from "@hookform/lenses/rhf";
import { Label } from "radix-ui";
import { Input } from "@/components/ui/input";
import { GroceryFormIngredientUnitSelect } from "@/components/ui/unit-select";
import { CircleMinusIcon } from "@/components/icons/circle-minus-icon";
import { CircleAddIcon } from "@/components/icons/circle-add-icon";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { SaveCartIcon } from "@/components/icons/cart/save-cart-icon";
import { Control, SubmitHandler } from "react-hook-form";
import {
  groceryListReset,
  handleGroceryListSubmit,
} from "@/providers/new-grocery-list-form-provider";
import { useLens } from "@hookform/lenses";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";

export const IngredientArrayForm = ({
  control,
}: {
  control: Control<GroceryListFormData>;
}) => {
  const ingredientsLens = useLens({ control }).focus("ingredients");

  const { fields, append, remove } = useFieldArray(ingredientsLens.interop());

  const addGroceryList = useGroceryListsStore(
    ({ addGroceryList }) => addGroceryList,
  );

  const onSubmitHandler: SubmitHandler<GroceryListFormData> = async (
    groceryListData,
  ) => {
    console.log(groceryListData);

    const submitResponse = await fetch("/api/grocery-list", {
      method: "POST",
      body: JSON.stringify(groceryListData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (groceryListData.image) {
    //   URL.revokeObjectURL(groceryListData.image);
    // }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { groceryList } = response;
      addGroceryList(groceryList);
      groceryListReset();
    }
  };

  // const onError: SubmitErrorHandler<GroceryListFormData> = async (errors) =>
  //   console.log(errors);

  return (
    <div className={"flex flex-col gap-4"}>
      {ingredientsLens.map(fields, (value, l, index) => {
        return (
          <div className={"flex w-full flex-row gap-4"} key={value.id}>
            <div
              className={
                "grid w-full grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-3 sm:grid-rows-2 lg:grid-cols-6 lg:grid-rows-1"
              }
            >
              <div className={"col-span-2 sm:col-span-3"}>
                <Label.Root
                  className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  htmlFor={"name"}
                >
                  Name
                </Label.Root>

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
                <Label.Root
                  className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  htmlFor={"quantity"}
                >
                  (Quantity)
                </Label.Root>
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
                <Label.Root
                  className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  htmlFor={"capacity"}
                >
                  Capacity
                </Label.Root>
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
                <Label.Root
                  className={`text-black opacity-50 ${index !== 0 ? "lg:hidden" : ""}`}
                  htmlFor={"unit"}
                >
                  Unit
                </Label.Root>
                <GroceryFormIngredientUnitSelect
                  control={control}
                  index={index}
                />
              </div>
            </div>

            <div className={"flex flex-col items-center justify-center"}>
              {index === 0 ? (
                <Label.Root htmlFor={"remove-ingredient"}>&nbsp;</Label.Root>
              ) : null}
              <button
                name={"remove-ingredient"}
                className={"flex cursor-pointer flex-row text-black"}
                onClick={() => remove(index)}
              >
                <CircleMinusIcon />
              </button>
            </div>
          </div>
        );
      })}

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
              onClick={groceryListReset}
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
              onClick={handleGroceryListSubmit(onSubmitHandler)}
              type={"button"}
            >
              <SaveCartIcon />
              Save
            </button>
          </div>
        </div>
        <div className={"flex flex-col items-center justify-center"}>
          <button
            className={"flex cursor-pointer flex-row text-black"}
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
    </div>
  );
};