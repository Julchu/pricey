import { Label } from "radix-ui";
import { useFormContext } from "react-hook-form";
import { UnitSelect } from "@/components/ingredients/calculator/unit-select";
import { Input } from "@/components/ingredients/calculator/inputs";
import { useUserStore } from "@/stores/user-store";

export const CalculatorInputs = ({
  selectResetKey,
}: {
  selectResetKey: number;
}) => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const { register, reset } = useFormContext();

  const resetHandler = () => {
    reset();
  };

  return (
    <div
      className={
        "flex h-2/3 grid-cols-1 flex-col gap-4 rounded-md bg-purple-300 p-4"
      }
    >
      <div className={"grid grid-cols-1"}>
        <Label.Root className={"text-sm opacity-50"} htmlFor={"name"}>
          Name
        </Label.Root>
        <Input
          placeholder={"Pepsi"}
          id={"name"}
          type={"text"}
          {...register("name")}
        />
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"price"}>
            Price ($)
          </Label.Root>

          <Input
            placeholder={"4.99"}
            id={"price"}
            type={"number"}
            {...register("price", { setValueAs: (val) => val * 100 })}
          />
        </div>

        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"quantity"}>
            (Quantity)
          </Label.Root>

          <Input
            placeholder={"6"}
            id={"quantity"}
            type={"number"}
            {...register("quantity")}
          />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"capacity"}>
            Capacity
          </Label.Root>

          <Input
            placeholder={"0.710"}
            id={"capacity"}
            type={"number"}
            {...register("capacity")}
          />
        </div>

        <div>
          <Label.Root className={"text-md opacity-50"} htmlFor={"unit"}>
            Unit
          </Label.Root>
          <UnitSelect selectKey={selectResetKey} />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <button
            className={
              "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
            }
            onClick={resetHandler}
            type={"reset"}
          >
            Reset
          </button>
        </div>

        {userInfo ? (
          <div>
            <button
              className={
                "text-md flex h-10 w-full items-center justify-center gap-[5px] rounded-md bg-blue-100 leading-none font-medium tracking-widest outline-none"
              }
              type={"submit"}
            >
              Save
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};