import { Select } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Controller } from "react-hook-form";
import { UnitSelectDropdown } from "@/components/ingredients/calculator/inputs";
import { ingredientControl } from "@/providers/ingredient-form-provider";

export const UnitSelect = () => {
  return (
    <Controller
      control={ingredientControl}
      name={"unit"}
      render={({ field }) => {
        return (
          <Select.Root
            {...field}
            onValueChange={field.onChange}
            defaultValue={undefined}
            value={field.value}
          >
            <Select.Trigger
              key={"select-trigger"}
              className={
                "animate-slide-down-and-fade text-md flex h-10 w-full items-center justify-start gap-[5px] rounded-md bg-blue-100 px-[15px] leading-none outline-none data-[placeholder]:text-gray-400"
              }
              aria-label={"Unit"}
              {...field}
            >
              <Select.Value placeholder={"Kilogram"} id={"unit"} />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal key={"select-portal"}>
              <UnitSelectDropdown />
            </Select.Portal>
          </Select.Root>
        );
      }}
    />
  );
};