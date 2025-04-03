import { Results } from "@/components/results/results";
import { Calculator } from "@/components/calculator/calculator";

const Home = () => {
  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll bg-gray-100 md:overflow-x-auto">
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Calculator />
      </div>
      <div className="w-full flex-none snap-center md:h-full md:w-1/2 md:flex-initial md:flex-col">
        <Results />
      </div>
    </div>
  );
};

export default Home;