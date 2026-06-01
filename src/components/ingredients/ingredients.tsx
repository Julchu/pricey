import { IngredientsList } from "@/components/ingredients/ingredients-list/ingredients-list";
import { Calculator } from "@/components/ingredients/calculator/calculator";
import { Calculations } from "@/components/ingredients/calculator/calculations";
import { Separator } from "@base-ui/react";

export const Ingredients = () => {
  return (
    <>
      <div className="w-full flex-none snap-x snap-center rounded-md bg-white md:h-full md:w-1/2 md:flex-initial md:snap-none md:snap-align-none md:flex-col">
        <form className={"flex h-full flex-col"}>
          <Calculations />

          <Separator
            orientation={"horizontal"}
            className="h-px bg-gray-200 dark:bg-neutral-700"
          />

          <Calculator />
        </form>
      </div>

      <div className="w-full flex-none snap-x snap-center overflow-auto tracking-widest md:h-full md:w-1/2 md:flex-initial md:snap-none md:snap-align-none md:flex-col">
        <IngredientsList />
      </div>
    </>
  );
};