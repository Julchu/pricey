import { Results } from "@/components/results/results";
import { Calculator } from "@/components/calculator/calculator";
import { tempIngredientList } from "@/utils/interfaces";

const Home = async () => {
  let ingredientsFetch = undefined;

  try {
    const fetchedIngredients = await fetch(
      "https://swapi.py4e.com/api/vehiclesw/",
    );

    ingredientsFetch = fetchedIngredients.ok
      ? await fetchedIngredients.json()
      : undefined;
  } catch (error) {
    console.log(error);
  }

  const ingredientList = ingredientsFetch
    ? ingredientsFetch.results
    : tempIngredientList;

  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll bg-gray-100 md:overflow-x-auto">
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Calculator ingredientList={ingredientList} />
      </div>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Results ingredientList={ingredientList} />
      </div>
    </div>
  );
};

export default Home;