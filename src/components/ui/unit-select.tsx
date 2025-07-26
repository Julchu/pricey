"use client";
import { Select } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Control, Controller } from "react-hook-form";
import { UnitSelectDropdown } from "@/components/ingredients/calculator/inputs";
import { useShallow } from "zustand/react/shallow";
import { isMass, isVolume } from "@/utils/text-formatters";
import { useUserStore } from "@/providers/user-store-provider";
import { IngredientFormData } from "@/utils/interfaces";

export const UnitSelect = ({
  control,
}: {
  control?: Control<IngredientFormData>;
}) => {
  const [setMass, setLiquidVolume] = useUserStore(
    useShallow(({ setMass, setLiquidVolume }) => [setMass, setLiquidVolume]),
  );

  return (
    <Controller
      control={control}
      name={"unit"}
      aria-label={"Unit"}
      render={({ field }) => {
        const onChangeHandler = (value: string) => {
          field.onChange(value);
          if (isMass(value)) setMass(value);
          else if (isVolume(value)) setLiquidVolume(value);
        };
        return (
          <Select.Root
            onValueChange={onChangeHandler}
            defaultValue={undefined}
            value={field.value || ""}
          >
            <Select.Trigger
              key={"select-trigger"}
              className={
                "text-md flex h-10 w-full items-center justify-start gap-[5px] rounded-md bg-blue-100 px-[15px] leading-none outline-none data-[placeholder]:text-gray-400"
              }
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