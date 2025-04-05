// TODO: similar ingredient card to Calculator card
import { Ingredient } from "@/utils/interfaces";

export const Card = ({ name }: Ingredient) => {
  return (
    <div className={"rounded-md border-2 border-amber-50 bg-red-900"}>
      {name}
    </div>
  );
};