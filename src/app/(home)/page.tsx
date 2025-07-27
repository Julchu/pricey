import { Ingredients } from "@/components/ingredients/ingredients";

const Home = async () => {
  return (
    <div className="flex h-full w-full snap-both snap-mandatory flex-row gap-4 overflow-x-scroll md:overflow-x-auto">
      <Ingredients />
    </div>
  );
};

export default Home;