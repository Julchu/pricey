import { InputHTMLAttributes } from "react";
import { Field } from "@base-ui/react/field";
import { FieldRoot } from "@base-ui/react";

// TODO: swap with BaseUI input
export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      min={0}
      className={`text-md flex min-h-10 w-full rounded-md border border-gray-200 px-[15px] font-medium outline-none placeholder:font-normal placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
};

export const IngredientLabel = ({
  children,
  className,
  index,
  ...props
}: Field.Label.Props & { index: number }) => {
  return (
    <Field.Label
      className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Field.Label>
  );
};

export const IngredientRoot = ({
  isCurrentList,
  className,
  ...props
}: FieldRoot.Props & {
  isCurrentList?: boolean;
}) => {
  return (
    <Field.Root
      className={`${
        isCurrentList
          ? "col-span-2 sm:col-span-1 lg:col-span-2"
          : "col-span-1 sm:col-span-1"
      } ${className}`}
      {...props}
    />
  );
};