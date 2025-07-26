"use client";
import { IngredientFormData, UnitType } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { Lens } from "@hookform/lenses";
import { useFieldArray } from "@hookform/lenses/rhf";
import { Label } from "radix-ui";
import { Input } from "@/components/ingredients/calculator/inputs";
import { UnitSelect } from "@/components/ui/unit-select";
import { CircleMinusIcon } from "@/components/icons/circle-minus-icon";
import { CircleAddIcon } from "@/components/icons/circle-add-icon";

export const IngredientArrayForm = ({
  lens,
}: {
  lens: Lens<IngredientFormData[]>;
}) => {
  const { fields, append, remove } = useFieldArray(lens.interop());

  return (
    <div className={"flex h-full w-full flex-col gap-4 bg-red-500"}>
      {lens.map(fields, (value, l, index) => {
        return (
          <div key={value.id} className={"flex h-full w-full flex-row gap-4"}>
            <div>
              {index === 0 ? (
                <Label.Root className={"opacity-50"} htmlFor={"name"}>
                  Name
                </Label.Root>
              ) : null}
              <Input
                autoComplete={"name"}
                placeholder={"Pepsi"}
                id={"name"}
                type={"text"}
                {...l
                  .focus("name")
                  .interop(({ register }, name) => register(name))}
              />
            </div>

            <div>
              {index === 0 ? (
                <Label.Root className={"opacity-50"} htmlFor={"price"}>
                  Price ($)
                </Label.Root>
              ) : null}
              <Input
                placeholder={"4.99"}
                step={"0.01"}
                id={"price"}
                type={"number"}
                {...l
                  .focus("price")
                  .interop(({ register }, name) => register(name))}
              />
            </div>

            <div>
              {index === 0 ? (
                <Label.Root className={"opacity-50"} htmlFor={"quantity"}>
                  (Quantity)
                </Label.Root>
              ) : null}
              <Input
                placeholder={"6"}
                id={"quantity"}
                type={"number"}
                {...l
                  .focus("quantity")
                  .interop(({ register }, name) => register(name))}
              />
            </div>

            <div>
              {index === 0 ? (
                <Label.Root className={"opacity-50"} htmlFor={"capacity"}>
                  Capacity
                </Label.Root>
              ) : null}
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

            <div>
              {index === 0 ? (
                <Label.Root className={"opacity-50"} htmlFor={"unit"}>
                  Unit
                </Label.Root>
              ) : null}
              <UnitSelect />
            </div>

            <div className={"flex flex-col items-center justify-center"}>
              {index === 0 ? (
                <Label.Root htmlFor={"remove-ingredient"}>&nbsp;</Label.Root>
              ) : null}
              <button
                name={"remove-ingredient"}
                className={"flex flex-row text-black"}
                onClick={() => remove(index)}
              >
                <CircleMinusIcon />
              </button>
            </div>
          </div>
        );
      })}

      <button
        className={"flex flex-row text-black"}
        type="button"
        onClick={() =>
          append({
            name: "",
            price: "" as unknown as number,
            capacity: "" as unknown as number,
            unit: "" as UnitType,
          })
        }
      >
        <CircleAddIcon />
      </button>
    </div>
  );
};