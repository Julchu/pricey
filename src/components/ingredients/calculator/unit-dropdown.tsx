import { Select } from "radix-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Unit } from "@/utils/interfaces";
import { SelectItem } from "@/components/ui/unit-select";

export const UnitSelectDropdown = () => {
  const units = {
    mass: [
      { name: "kg", value: Unit.KILOGRAM },
      { name: "g", value: Unit.GRAM },
      { name: "lb", value: Unit.POUND },
      { name: "oz", value: Unit.OUNCE },
    ],
    liquidVolume: [
      { name: "L", value: Unit.LITRE },
      { name: "ml", value: Unit.MILLILITER },
      { name: "qt", value: Unit.QUART },
    ],
    volume: [
      { name: "cup", value: Unit.CUP },
      { name: "tbsp", value: Unit.TABLESPOON },
      { name: "tsp", value: Unit.TEASPOON },
    ],
    other: [{ name: "pcs", value: Unit.PIECES }],
  };

  return (
    <Select.Content
      className={
        "animate-slide-down-and-fade z-1 rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
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