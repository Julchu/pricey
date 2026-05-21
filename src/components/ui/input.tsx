import { InputHTMLAttributes } from "react";
import { Field } from "@base-ui/react/field";

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