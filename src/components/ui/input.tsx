import { InputHTMLAttributes } from "react";
import { LabelProps } from "@radix-ui/react-label";
import { Label } from "radix-ui";

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      min={0}
      className={`text-md flex min-h-10 w-full rounded-md border border-gray-200 px-[15px] outline-none placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
};

export const IngredientLabel = ({
  children,
  className,
  index,
  ...props
}: LabelProps & { index: number }) => {
  return (
    <Label.Root
      className={`text-xs text-black uppercase opacity-50 ${index !== 0 ? "lg:hidden" : ""} ${className}`}
      {...props}
    >
      {children}
    </Label.Root>
  );
};