// "use client";
import { Select } from "radix-ui";
import {
  CaretRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { Unit } from "@/utils/interfaces";
import { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const UnitSelect = ({ selectKey }: { selectKey: number }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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

/*
* <Select.Root
      onValueChange={onChangeHandler}
      value={watch("unit")}
      key={selectKey}
    >
      <Select.Trigger
        className={
          "animate-slide-down-and-fade text-md flex h-10 w-full items-center justify-start gap-[5px] rounded-md bg-blue-100 px-[15px] leading-none outline-none data-[placeholder]:text-gray-400"
        }
        aria-label={"Unit"}
      >
        <Select.Value
          placeholder={"Kilogram"}
          id={"unit"}
          {...register("unit")}
        />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <UnitSelectDropdown />
      </Select.Portal>
    </Select.Root>
  );
   />
  *
* */

export const UnitSelectDropdown = () => {
  const units = {
    mass: [
      { name: "Kilogram", value: Unit.KILOGRAM },
      { name: "Pound", value: Unit.POUND },
    ],
    liquidVolume: [
      { name: "Litre", value: Unit.LITRE },
      { name: "Quart", value: Unit.QUART },
    ],
    volume: [
      { name: "Cup", value: Unit.CUP },
      { name: "Tablespoon", value: Unit.TABLESPOON },
      { name: "Teaspoon", value: Unit.TEASPOON },
    ],
    other: [{ name: "Item", value: Unit.ITEM }],
  };

  return (
    <Select.Content
      className={
        "animate-slide-down-and-fade rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
      }
    >
      <Select.ScrollUpButton
        className={
          "flex h-[25px] cursor-default items-center justify-center bg-white text-blue-500"
        }
      >
        <ChevronUpIcon />
      </Select.ScrollUpButton>
      <Select.Viewport className="p-[5px]">
        <Select.Group>
          <Select.Label className="pl-4 text-xs leading-[25px] font-medium opacity-50">
            Mass
          </Select.Label>
          {units.mass.map(({ name, value }, index) => {
            return (
              <SelectItem key={`${name}_${index}`} value={value}>
                {name}
              </SelectItem>
            );
          })}
        </Select.Group>

        <Select.Group>
          <Select.Separator className="m-[5px] h-px bg-black opacity-20" />
          <Select.Label className="pl-4 text-xs leading-[25px] font-medium opacity-50">
            Liquids
          </Select.Label>
          {units.liquidVolume.map(({ name, value }, index) => {
            return (
              <SelectItem key={`${name}_${index}`} value={value}>
                {name}
              </SelectItem>
            );
          })}
        </Select.Group>

        <Select.Group>
          <Select.Separator className="m-[5px] h-px bg-black opacity-20" />
          <Select.Label className="pl-4 text-xs leading-[25px] font-medium opacity-50">
            Volume
          </Select.Label>
          {units.volume.map(({ name, value }, index) => {
            return (
              <SelectItem key={`${name}_${index}`} value={value}>
                {name}
              </SelectItem>
            );
          })}
        </Select.Group>

        <Select.Group>
          <Select.Separator className="m-[5px] h-px bg-black opacity-20" />
          {units.other.map(({ name, value }, index) => {
            return (
              <SelectItem key={`${name}_${index}`} value={value}>
                {name}
              </SelectItem>
            );
          })}
        </Select.Group>
      </Select.Viewport>
      <Select.ScrollDownButton
        className={
          "flex h-[25px] cursor-default items-center justify-center bg-white text-blue-500"
        }
      >
        <ChevronDownIcon />
      </Select.ScrollDownButton>
    </Select.Content>
  );
};

const SelectItem = ({
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