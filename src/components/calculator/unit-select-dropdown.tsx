import { FC, ReactNode } from "react";
import { Unit } from "@/utils/interfaces";
import { Select } from "radix-ui";
import { CaretRightIcon } from "@radix-ui/react-icons";

export const UnitSelectDropdown: FC = () => {
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
    <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
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
    </Select.Content>
  );
};

const SelectItem: FC<{
  children: ReactNode;
  value: string;
}> = ({ children, value }) => {
  return (
    <Select.Item
      className={
        "relative flex h-[25px] cursor-pointer items-center rounded-[3px] p-4 pl-[25px] text-sm leading-none outline-none select-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
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