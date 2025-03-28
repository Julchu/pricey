"use client";
import { Select } from "radix-ui";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Unit } from "@/utils/interfaces";
import { FC, ReactNode } from "react";

export const UnitSelect: FC<{ children: ReactNode }> = ({ children }) => {
  const onChangeHandler = (value: string) => {
    console.log(value);
  };
  return (
    <Select.Root onValueChange={onChangeHandler}>
      <Select.Trigger
        className={
          "shadow-normal hover:shadow-hover data-[state=open]:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-sm leading-none outline-none"
        }
        aria-label="Unit"
      >
        <Select.Value placeholder={"Kilogram"} defaultValue={Unit.KILOGRAM} />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>{children}</Select.Portal>
    </Select.Root>
  );
};