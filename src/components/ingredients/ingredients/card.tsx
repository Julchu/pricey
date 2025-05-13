// TODO: similar ingredient card to Ingredients card
import { Ingredient } from "@/utils/interfaces";
import { useFormContext } from "react-hook-form";

export const Card = ({ name, price, quantity, unit, capacity }: Ingredient) => {
  const { setValue } = useFormContext();

  const cardClickHandler = () => {
    setValue("name", name);
    setValue("price", price);
    setValue("quantity", quantity);
    setValue("unit", unit);
    setValue("capacity", capacity);
  };

  return (
    <div
      className={"rounded-md border-2 border-amber-50 bg-red-900"}
      onClick={cardClickHandler}
    >
      {name}
    </div>
  );
};