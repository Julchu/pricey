import { Results } from "@/components/results/results";
import { Calculator } from "@/components/calculator/calculator";

const Home = () => {
  return (
    <div className="h-full w-full flex-col gap-4 overflow-x-scroll bg-gray-100 md:overflow-x-auto">
      <div className="h-full w-full md:h-full md:w-1/2">
        <Calculator />
      </div>
      <div className="h-full w-full md:h-full md:w-1/2">
        <Results />
      </div>
    </div>
  );
};

export default Home;