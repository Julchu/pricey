import { InputHTMLAttributes } from "react";

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`text-md flex min-h-10 w-full rounded-md bg-blue-100 px-[15px] outline-none placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
};