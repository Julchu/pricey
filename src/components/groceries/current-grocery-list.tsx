import { IngredientLabel } from "@/components/ui/input";
import {
  AnimatedCheckIcon,
  EmptyCheckbox,
} from "@/components/icons/animated-check-icon";
import { useState } from "react";

export const CurrentGroceryList = ({ index }: { index: number }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <IngredientLabel htmlFor={"checked-ingredient"} index={index}>
        Added
      </IngredientLabel>
      <div
        id={"checked-ingredient"}
        className={`flex min-h-10 w-full cursor-pointer flex-row items-center rounded-md bg-blue-100 px-[15px] text-black ${checked ? "opacity-10" : ""}`}
        onClick={() => setChecked((currentlyChecked) => !currentlyChecked)}
      >
        {checked ? <AnimatedCheckIcon /> : <EmptyCheckbox />}
      </div>
    </div>
  );
};