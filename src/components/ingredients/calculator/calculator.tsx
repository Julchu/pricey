"use client";
import { Field } from "@base-ui/react/field";
import { IngredientUnitSelect } from "@/components/ui/unit-select";
import { Input } from "@/components/ui/input";
import {
  handleIngredientSubmit,
  ingredientControl,
  ingredientRegister,
  ingredientReset,
} from "@/providers/ingredient-form-provider";
import { SubmitHandler, useFormState } from "react-hook-form";
import { IngredientFormData } from "@/utils/interfaces";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { CircleResetIcon } from "@/components/icons/circle-reset-icon";
import { AnimatedCheckIcon } from "@/components/icons/animated-check-icon";
import { Separator } from "@base-ui/react";

export const Calculator = () => {
  const updateIngredients = useIngredientsStore(
    ({ updateIngredients }) => updateIngredients,
  );

  // Subscribe to live form errors from the singleton control
  const { errors } = useFormState({ control: ingredientControl });

  const onSubmitHandler: SubmitHandler<IngredientFormData> = async (
    ingredientFormData,
  ) => {
    console.log("ingredientFormData", ingredientFormData);
    const submitResponse = await fetch("/api/ingredient", {
      method: "POST",
      body: JSON.stringify(ingredientFormData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (ingredientFormData.image) {
      URL.revokeObjectURL(ingredientFormData.image);
    }

    if (submitResponse.status === 200 || submitResponse.status === 401) {
      const response = await submitResponse.json();
      const { ingredient } = response;
      updateIngredients(ingredient);
      ingredientReset();
    }
  };

  const labelClass = "text-xs font-medium text-black uppercase opacity-50";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div className={"flex h-2/3 flex-col gap-4"}>
      <div
        className={
          "flex grid-cols-1 flex-col gap-4 p-4 text-sm tracking-widest"
        }
      >
        {/* Name */}
        <Field.Root invalid={!!errors.name}>
          <Field.Label className={labelClass}>Name</Field.Label>
          <Input
            placeholder={"Pepsi"}
            type={"search"}
            {...ingredientRegister("name", {
              required: "Name is required",
            })}
          />
          <Field.Error className={errorClass}>
            {errors.name?.message}
          </Field.Error>
        </Field.Root>

        <div className={"grid grid-cols-2 gap-4"}>
          {/* Price */}
          <Field.Root invalid={!!errors.price}>
            <Field.Label className={labelClass}>Price</Field.Label>
            <div className="flex h-10 items-center rounded-md border border-gray-200 pl-3">
              <span className={"text-gray-400"}>$</span>
              <Input
                className={"border-none"}
                placeholder={"4.99"}
                step={"0.01"}
                type={"number"}
                {...ingredientRegister("price", {
                  min: { value: 0, message: "Must be ≥ 0" },
                  setValueAs: (val) => (val ? val * 100 : ""),
                })}
              />
            </div>
            <Field.Error className={errorClass}>
              {errors.price?.message}
            </Field.Error>
          </Field.Root>

          {/* Quantity */}
          <Field.Root invalid={!!errors.quantity}>
            <Field.Label className={labelClass}>(Quantity)</Field.Label>
            <Input
              placeholder={"1"}
              type={"number"}
              {...ingredientRegister("quantity", {
                min: { value: 0, message: "Must be ≥ 0" },
                setValueAs: (val) => (val ? Number(val) : ""),
              })}
            />
            <Field.Error className={errorClass}>
              {errors.quantity?.message}
            </Field.Error>
          </Field.Root>
        </div>

        <div className={"grid grid-cols-2 gap-4"}>
          {/* Capacity */}
          <Field.Root invalid={!!errors.capacity}>
            <Field.Label className={labelClass}>Capacity</Field.Label>
            <Input
              placeholder={"0.710"}
              step={"0.1"}
              type={"number"}
              {...ingredientRegister("capacity", {
                min: { value: 0, message: "Must be ≥ 0" },
                setValueAs: (val) => (val ? Number(val) : ""),
              })}
            />
            <Field.Error className={errorClass}>
              {errors.capacity?.message}
            </Field.Error>
          </Field.Root>

          <Field.Root>
            <Field.Label className={labelClass}>Unit</Field.Label>
            <IngredientUnitSelect />
          </Field.Root>
        </div>
      </div>

      <div className={"mt-auto"}>
        <Separator
          orientation={"horizontal"}
          className="h-px bg-gray-200 dark:bg-neutral-700"
        />

        <div className={"grid grid-cols-2 gap-4 p-4"}>
          <div className={"group"}>
            <button
              className={
                "flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-gray-200 font-medium tracking-widest group-hover:border-none group-hover:bg-red-500 group-hover:text-white"
              }
              onClick={() => ingredientReset()}
              type={"reset"}
            >
              <CircleResetIcon
                className={"fill-blue-500 group-hover:fill-white"}
              />
              Reset
            </button>
          </div>

          <div className={"group"}>
            <button
              className={
                "group-hover:white flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-blue-500 font-medium tracking-widest text-white group-hover:bg-green-500"
              }
              onClick={handleIngredientSubmit(onSubmitHandler)}
            >
              <AnimatedCheckIcon />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};