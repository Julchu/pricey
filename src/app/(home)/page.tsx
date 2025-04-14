import { Results } from "@/components/results/results";
import { Calculator } from "@/components/calculator/calculator";
import { Ingredient, Season, Unit } from "@/utils/interfaces";

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

const tempIngredientList: Ingredient[] = [
  {
    id: 0,
    name: "Tomato",
    price: 2.5,
    unit: Unit.KILOGRAM,
    image: "https://example.com/tomato.jpg",
    capacity: 5,
    quantity: 2,
    userId: 0,
    season: Season.SUMMER,
  },
  {
    id: 1,
    name: "Olive Oil",
    price: 10,
    unit: Unit.LITRE,
    image: "https://example.com/olive_oil.jpg",
    capacity: 1,
    quantity: 0.5,
    userId: 1,
  },
  {
    id: 2,
    name: "Basil",
    price: 1.5,
    unit: Unit.ITEM,
    image: "https://example.com/basil.jpg",
    capacity: 3,
    quantity: 1,
    userId: 2,
    season: Season.SPRING,
  },
  {
    id: 3,
    name: "Chicken Breast",
    price: 7,
    unit: Unit.KILOGRAM,
    image: "https://example.com/chicken.jpg",
    capacity: 2,
    quantity: 1,
    userId: 3,
  },
  {
    id: 4,
    name: "Garlic",
    price: 3,
    unit: Unit.KILOGRAM,
    image: "https://example.com/garlic.jpg",
    capacity: 2,
    quantity: 1,
    userId: 4,
  },
];

export default Home;