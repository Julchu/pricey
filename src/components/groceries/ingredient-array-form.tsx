"use client";
import { IngredientFormData, UnitType } from "@/utils/interfaces";
// TODO: test if can remove * as React
import * as React from "react";
import { Lens } from "@hookform/lenses";
import { useFieldArray } from "@hookform/lenses/rhf";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "radix-ui";
import { Input } from "@/components/ingredients/calculator/inputs";
import { UnitSelect } from "@/components/ingredients/calculator/unit-select";

export const IngredientArrayForm = ({
  lens,
}: {
  lens: Lens<IngredientFormData[]>;
}) => {
  const { fields, append, remove } = useFieldArray(lens.interop());

  return (
    <div className={"flex h-full w-full flex-row gap-4"}>
      {lens.map(fields, (value, l, index) => {
        return (
          <div key={value.id} className={"flex h-full w-full flex-row gap-4"}>
            <Label.Root className={"opacity-50"} htmlFor={"name"}>
              Name
            </Label.Root>
            <Input
              autoComplete={"name"}
              placeholder={"Pepsi"}
              id={"name"}
              type={"text"}
              {...l
                .focus("name")
                .interop(({ register }, name) => register(name))}
            />
            <Label.Root className={"opacity-50"} htmlFor={"price"}>
              Price ($)
            </Label.Root>
            <Input
              placeholder={"4.99"}
              step={"0.01"}
              id={"price"}
              type={"number"}
              {...l
                .focus("price")
                .interop(({ register }, name) => register(name))}
            />
            <Label.Root className={"opacity-50"} htmlFor={"quantity"}>
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
            <Label.Root className={"opacity-50"} htmlFor={"capacity"}>
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
            <Label.Root className={"opacity-50"} htmlFor={"unit"}>
              Unit
            </Label.Root>
            <UnitSelect />;
            <input
              {...l
                .focus("unit")
                .interop(({ register }, name) => register(name))}
            />
            <button className={"text-black"} onClick={() => remove(index)}>
              <MinusCircledIcon />
              Remove ingredient
            </button>
          </div>
        );
      })}

      <button
        className={"text-black"}
        type="button"
        onClick={() =>
          append({
            name: "",
            price: 0,
            capacity: 0,
            unit: "" as UnitType,
          })
        }
      >
        <PlusCircledIcon />
        Add an ingredient
      </button>
    </div>
  );
};