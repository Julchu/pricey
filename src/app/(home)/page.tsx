import { Calculator } from "@/components/calculator/calculator";
import { Results } from "@/components/results/results";
import { FC } from "react";

const Home: FC = () => {
  return (
    <div className="flex h-full w-full flex-row gap-4 overflow-x-scroll md:overflow-x-auto">
      <div className="h-full w-full p-4 md:h-full md:w-1/2">
        <Calculator />
      </div>
      <div className="h-full w-full p-4 md:h-full md:w-1/2">
        <Results />
      </div>
    </div>
  );
};

export default Home;