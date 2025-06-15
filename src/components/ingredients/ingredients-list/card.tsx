// TODO: similar ingredient card to Ingredients card
import { Ingredient } from "@/utils/interfaces";
import { ingredientSetValue } from "@/providers/ingredient-form-provider";

export const Card = ({ name, price, quantity, unit, capacity }: Ingredient) => {
  const cardClickHandler = () => {
    ingredientSetValue("name", name);
    ingredientSetValue("price", price / 100);
    ingredientSetValue("quantity", quantity);
    ingredientSetValue("unit", unit);
    ingredientSetValue("capacity", capacity);
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