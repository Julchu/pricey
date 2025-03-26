import { Calculator } from "@/components/calculator";
import { Results } from "@/components/results";
import { FC } from "react";

const Home: FC = () => {
  return (
    <div className="flex h-full flex-col bg-gray-200 md:flex-row">
      <div className="h-screen overflow-x-hidden overflow-y-scroll bg-gray-300 p-4 md:h-full md:w-1/2">
        <Calculator />
      </div>
      <div className="h-full p-4 md:w-1/2">
        <Results />
      </div>
    </div>
  );
};

export default Home;