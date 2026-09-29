import { RecipeAccordion } from "@/components/recipes/recipe-accordion";

const Recipes = async () => {
  return (
    <div className="flex w-full flex-col overflow-scroll rounded-md drop-shadow-lg">
      <RecipeAccordion />
    </div>
  );
};

export default Recipes;