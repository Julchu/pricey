import { IngredientsList } from "@/components/ingredients/ingredients-list/ingredients-list";
import { Calculator } from "@/components/ingredients/calculator/calculator";
import { Calculations } from "@/components/ingredients/calculator/calculations";

export const Ingredients = () => {
  return (
    <>
      <div className="w-full flex-none snap-x snap-center md:h-full md:w-1/2 md:flex-initial md:snap-none md:snap-align-none md:flex-col">
        <form className={"flex h-full flex-col gap-4"}>
          <Calculations />

          <Calculator />
        </form>
      </div>

      <div className="w-full flex-none snap-x snap-center overflow-auto md:h-full md:w-1/2 md:flex-initial md:snap-none md:snap-align-none md:flex-col">
        <IngredientsList />
      </div>
    </>
  );
};

//[&::-webkit-scrollbar]:hidden
/* Custom scrollbar
 * [&::-webkit-scrollbar]:w-2
 * [&::-webkit-scrollbar-track]:rounded-full
 * [&::-webkit-scrollbar-track]:bg-gray-100
 * [&::-webkit-scrollbar-thumb]:rounded-full
 * [&::-webkit-scrollbar-thumb]:bg-gray-300
 * dark:[&::-webkit-scrollbar-track]:bg-neutral-700
 * dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
 * */