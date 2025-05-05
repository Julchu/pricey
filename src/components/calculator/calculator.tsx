"use client";
import { Label } from "radix-ui";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Ingredient, IngredientFormData } from "@/utils/interfaces";
import { UnitSelect } from "@/components/calculator/unit-select";
import { useState } from "react";

export const Calculator = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const methods = useForm<IngredientFormData>({
    defaultValues: {
      name: undefined,
      price: undefined,
      quantity: undefined,
      capacity: undefined,
      unit: undefined,
    },
  });
  const { reset, handleSubmit } = methods;
  const [selectResetKey, setSelectResetKey] = useState<number>(+new Date());

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (data) => {
    console.log(data);
    await fetch("api/ingredient", {
      method: "POST",
      body: JSON.stringify(data),
    });
    reset();
    setSelectResetKey(+new Date());
  };

  return (
    <FormProvider {...methods}>
      <form
        className={"flex h-full flex-col gap-4"}
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <CalculatorResults />
        <CalculatorInputs selectResetKey={selectResetKey} />
      </form>
    </FormProvider>
  );
};

export const CalculatorResults = () => {
  const { watch } = useFormContext();

  return (
    <div
      className={
        "flex h-1/3 flex-col items-center justify-center rounded-md bg-purple-600 p-4"
      }
    >
      {/* TODO: preview or existing ingredient card*/}
      <h2 className="mb-4 text-2xl font-bold">{watch("name")}</h2>
      <div>Upload image</div>
    </div>
  );
};

export const CalculatorInputs = ({
  selectResetKey,
}: {
  selectResetKey: number;
}) => {
  const {
    register,
    reset,
    resetField,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const resetHandler = () => {
    reset({
      name: "",
      price: "",
      quantity: "",
      capacity: "",
      unit: "",
    });
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
        <Input placeholder={"Pepsi"} id={"name"} type={"text"} /> {/*required*/}
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"price"}>
            Price ($)
          </Label.Root>

          <Input placeholder={"4.99"} id={"price"} type={"number"} />
        </div>

        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"quantity"}>
            (Quantity)
          </Label.Root>

          <Input placeholder={"6"} id={"quantity"} type={"number"} />
        </div>
      </div>

      <div className={"grid grid-cols-2 gap-4"}>
        <div>
          <Label.Root className={"text-sm opacity-50"} htmlFor={"capacity"}>
            Capacity
          </Label.Root>

          <Input placeholder={"0.710"} id={"capacity"} type={"number"} />
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
      </div>
    </div>
  );
};

export const Input = ({
  id,
  placeholder,
  type,
  required,
}: {
  id: string;
  placeholder?: string;
  type: string;
  required?: boolean;
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <input
      className={
        "text-md flex h-10 w-full rounded-md bg-blue-100 px-[15px] leading-none outline-none placeholder:text-gray-400"
      }
      id={id}
      placeholder={placeholder}
      type={type}
      required={required}
      {...register(id)}
    />
  );
};