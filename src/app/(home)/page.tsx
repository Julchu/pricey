import { Results } from "@/components/results/results";
import { Calculator } from "@/components/calculator/calculator";
import { cookies } from "next/headers";
import { Ingredient } from "@/utils/interfaces";

const Home = async () => {
  let ingredients: Ingredient[] = [];

  try {
    const browserCookies = await cookies();
    const token = browserCookies.get("pricey_access_token")?.value;
    if (token) {
      const ingredientsResponse = await fetch(
        `${process.env.PRICEY_BACKEND_URL}/ingredient`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const {
        success,
        data,
        error: responseError,
      } = await ingredientsResponse.json();

      if (success) ingredients = data;
      else console.error(responseError);
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll bg-gray-100 md:overflow-x-auto">
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Calculator ingredients={ingredients} />
      </div>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Results ingredients={ingredients} />
      </div>
    </div>
  );
};

export default Home;