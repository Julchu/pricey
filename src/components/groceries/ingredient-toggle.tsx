import { AnimatedCheckIcon, EmptyCheckbox, } from "@/components/icons/animated-check-icon";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { ReactNode } from "react";

export const IngredientToggle = ({
  publicId,
  checked,
  children,
}: {
  publicId: string;
  checked: boolean;
  children?: ReactNode;
}) => {
  const updateChecklist = useGroceryListsStore(
    ({ updateChecklist }) => updateChecklist,
  );

  return (
    <button
      id={"checked-ingredient"}
      className={`group flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-x-2 rounded-md border border-gray-200 p-4 text-black hover:bg-green-500 hover:text-white`} // ${checked ? "opacity-10" : ""}
      onClick={() => updateChecklist(publicId)}
    >
      {checked ? (
        <AnimatedCheckIcon
          className={"h-6 stroke-blue-500 group-hover:stroke-white"}
        />
      ) : (
        <EmptyCheckbox
          className={"h-6 stroke-blue-500 group-hover:stroke-white"}
        />
      )}
      {children}
    </button>
  );
};