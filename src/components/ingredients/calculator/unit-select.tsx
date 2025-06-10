import { Select } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Controller, useFormContext } from "react-hook-form";
import { UnitSelectDropdown } from "@/components/ingredients/calculator/inputs";

export const UnitSelect = ({ selectKey }: { selectKey: number }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  if (errors.root) {
    console.error("Errors in calc", errors);
  }
  return (
    <Controller
      control={control}
      name={"unit"}
      render={({ field }) => (
        <Select.Root
          onValueChange={field.onChange}
          key={selectKey}
          value={field.value}
        >
          <Select.Trigger
            className={
              "animate-slide-down-and-fade text-md flex h-10 w-full items-center justify-start gap-[5px] rounded-md bg-blue-100 px-[15px] leading-none outline-none data-[placeholder]:text-gray-400"
            }
            aria-label={"Unit"}
          >
            <Select.Value placeholder={"Kilogram"} id={"unit"} />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <UnitSelectDropdown />
          </Select.Portal>
        </Select.Root>
      )}
    />
  );
};