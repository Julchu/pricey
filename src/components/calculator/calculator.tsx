import { Label } from "radix-ui";
import { FC } from "react";
import { UnitSelect } from "@/components/calculator/unit-select";
import { UnitSelectDropdown } from "@/components/calculator/unit-select-dropdown";

export const Calculator: FC = () => {
  return (
    <div className={"flex h-full flex-col p-4"}>
      <CalculatorResults />
      <CalculatorInputs />
    </div>
  );
};

export const CalculatorResults: FC = () => {
  return (
    <div
      className={
        "flex h-1/3 flex-col items-center justify-center bg-purple-600"
      }
    >
      {/* TODO: preview or existing ingredient card*/}
      <h2 className="mb-4 text-2xl font-bold">Ingredient name</h2>
      <div>Upload image</div>
    </div>
  );
};

export const CalculatorInputs: FC = () => {
  return (
    <div className={"flex h-2/3 flex-col gap-4"}>
      <div className={"flex flex-col"}>
        <Label.Root className={"text-muted-foreground"} htmlFor={"name"}>
          Name
        </Label.Root>
        <input
          className={
            "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
          }
          placeholder={"Pepsi"}
          id={"name"}
          type={"text"}
        />
      </div>

      <div className={"flex flex-row gap-4"}>
        <div className={"flex w-1/2 flex-col"}>
          <Label.Root className={"text-muted-foreground"} htmlFor={"price"}>
            Price ($)
          </Label.Root>
          <input
            className={
              "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
            }
            placeholder={"4.99"}
            id={"price"}
            type={"number"}
          />
        </div>

        <div className={"flex w-1/2 flex-col"}>
          <Label.Root className={"text-muted-foreground"} htmlFor={"quantity"}>
            (Quantity)
          </Label.Root>
          <input
            className={
              "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
            }
            placeholder={"6"}
            id={"quantity"}
            defaultValue={1}
          />
        </div>
      </div>

      <div className={"flex flex-row gap-4"}>
        <div className={"flex w-1/2 flex-col"}>
          <Label.Root className={"text-muted-foreground"} htmlFor={"capacity"}>
            Capacity
          </Label.Root>
          <input
            className={
              "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
            }
            placeholder={"0.710"}
            id={"capacity"}
            defaultValue={1}
          />
        </div>

        <div className={"flex w-1/2 flex-col"}>
          <Label.Root className={"text-muted-foreground"}>Unit</Label.Root>
          <UnitSelect>
            <UnitSelectDropdown />
          </UnitSelect>
        </div>
      </div>

      <div className={"flex flex-row justify-evenly"}>
        <button
          className={
            "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
          }
        >
          Reset
        </button>
        <button
          className={
            "shadow-normal hover:shadow-hover focus:shadow-focus inline-flex h-[35px] items-center justify-center gap-[5px] rounded px-[15px] text-sm leading-none outline-none"
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};