import { IngredientRoot } from "@/components/ui/input";
import {
  AnimatedCheckIcon,
  EmptyCheckbox,
} from "@/components/icons/animated-check-icon";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";

export const IngredientToggle = ({
  publicId,
  checked,
}: {
  publicId: string;
  checked: boolean;
}) => {
  const updateChecklist = useGroceryListsStore(
    ({ updateChecklist }) => updateChecklist,
  );

  return (
    <IngredientRoot isCurrentList className={"w-full"}>
      <button
        id={"checked-ingredient"}
        className={`flex h-10 w-full cursor-pointer flex-row items-center justify-center rounded-md border border-gray-200 p-4 text-black`} // ${checked ? "opacity-10" : ""}
        onClick={() => updateChecklist(publicId)}
      >
        {checked ? (
          <AnimatedCheckIcon className={"h-6 stroke-blue-500"} />
        ) : (
          <EmptyCheckbox className={"h-6 stroke-blue-500"} />
        )}
      </button>
    </IngredientRoot>
  );
};