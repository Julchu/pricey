import { Ingredients } from "@/components/ingredients/calculator/ingredients";
import { Ingredient } from "@/utils/interfaces";
import { fetchIngredient } from "@/components/ingredients/calculator/fetch-ingredient";

const Home = async () => {
  const ingredients: Ingredient[] = (await fetchIngredient()) || [];

  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll bg-gray-100 md:overflow-x-auto">
      <Ingredients ingredients={ingredients} />
    </div>
  );
};

export default Home;