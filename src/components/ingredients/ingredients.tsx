import { IngredientsList } from "@/components/ingredients/ingredients-list/ingredients-list";
import { Calculator } from "@/components/ingredients/calculator/calculator";
import { Calculations } from "@/components/ingredients/calculator/calculations";

export const Ingredients = () => {
  return (
    <>
      <div className="w-full flex-none snap-x snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <form className={"flex h-full flex-col gap-4"}>
          <Calculations />

          <Calculator />
        </form>
      </div>

      <div className="w-full flex-none snap-x snap-center overflow-y-scroll md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <IngredientsList />
      </div>
    </>
  );
};