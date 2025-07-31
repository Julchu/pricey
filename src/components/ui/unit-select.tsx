"use client";
import { Select } from "radix-ui";
import { CaretRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Control, Controller } from "react-hook-form";
import { UnitSelectDropdown } from "@/components/ingredients/calculator/unit-dropdown";
import { useShallow } from "zustand/react/shallow";
import { isMass, isVolume } from "@/utils/text-formatters";
import { useUserStore } from "@/providers/user-store-provider";
import { IngredientFormData } from "@/utils/interfaces";
import { ReactNode } from "react";

export const SelectItem = ({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) => {
  return (
    <Select.Item
      className={
        "text-md relative flex h-[25px] cursor-pointer items-center rounded-[3px] p-4 pl-[25px] leading-none outline-none select-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
      }
      value={value}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CaretRightIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

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
                "text-md flex h-10 w-full min-w-[130px] shrink-0 items-center justify-start gap-[5px] rounded-md bg-blue-100 px-[15px] leading-none outline-none data-[placeholder]:text-gray-400"
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
