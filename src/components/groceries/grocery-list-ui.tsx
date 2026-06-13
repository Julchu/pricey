// TODO: replace with BaseUI Field/Fieldset
import { ComponentPropsWithoutRef } from "react";

export const ExistingGroceryListField = ({
  children,
  className,
  checked,
  ...props
}: ComponentPropsWithoutRef<"div"> & { checked?: boolean }) => {
  return (
    <div
      id={"unit"}
      className={`text-md flex min-h-10 w-full items-center rounded-md bg-blue-100 px-[15px] leading-none outline-none ${checked ? "opacity-10" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};