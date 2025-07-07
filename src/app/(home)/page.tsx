import { Ingredients } from "@/components/ingredients/ingredients";
import { Ingredient } from "@/utils/interfaces";
import { fetchIngredient } from "@/utils/server-actions/fetch-ingredient";
import { IngredientStoreProvider } from "@/providers/ingredient-store-provider";

export const dynamic = "force-dynamic";

const Home = async () => {
  const ingredients: Ingredient[] = (await fetchIngredient()) || [];
  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll md:overflow-x-auto">
      <IngredientStoreProvider ingredients={ingredients} />
      <Ingredients />
    </div>
  );
};

export default Home;