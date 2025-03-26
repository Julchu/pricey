import { Label } from "radix-ui";
import { FC } from "react";

export const Calculator: FC = async () => {
  return (
    <div className={"flex h-full flex-col bg-gray-400"}>
      <CalculatorResults />
      <CalculatorInputs />
    </div>
  );
};

export const CalculatorResults: FC = () => {
  return (
    <div className={"h-1/3"}>
      <h2 className="mb-4 text-2xl font-bold">Calculator</h2>
      <div>Upload image</div>
    </div>
  );
};
export const CalculatorInputs: FC = () => {
  return (
    <div className={"flex h-2/3 flex-col bg-red-500"}>
      <Label.Root className={"text-muted-foreground"} htmlFor={"name"}>
        Name
      </Label.Root>
      <input placeholder={"Pepsi"} id={"name"} type="text" />

      <div className={"flex flex-row justify-evenly"}>
        <div className={"flex flex-col"}>
          <Label.Root className={"text-muted-foreground"} htmlFor={"price"}>
            Price ($)
          </Label.Root>
          <input
            className={"w-full"}
            placeholder={"4.99"}
            id={"price"}
            type={"number"}
          />
        </div>

        <div className={"flex flex-row justify-evenly"}>
          <div className={"flex flex-col"}>
            <Label.Root
              className={"text-muted-foreground"}
              htmlFor={"quantity"}
            >
              (Quantity)
            </Label.Root>
            <input
              className={"w-full"}
              placeholder={"6"}
              id={"quantity"}
              defaultValue={1}
            />
          </div>
        </div>
      </div>

      <div className={"flex flex-row justify-evenly"}>
        <div className={"flex flex-col"}>
          <Label.Root className={"text-muted-foreground"} htmlFor={"capacity"}>
            Capacity
          </Label.Root>
          <input placeholder={"0.710"} id={"capacity"} defaultValue={1} />
        </div>

        <div className={"flex flex-col"}>
          <Label.Root className={"text-muted-foreground"}>Unit</Label.Root>
          <input placeholder={"L"} id={"unit"} />
        </div>
      </div>

      <div className={"flex flex-row justify-evenly"}>
        <div className={"bg-red-600"}>Reset</div>
        <div>Save</div>
      </div>
    </div>
  );
};