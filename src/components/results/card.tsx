export type IngredientsFetch = {
  count: number;
  next: string;
  previous: string;
  results: Ingredient[];
};

export type Ingredient = {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: number;
  max_atmosphering_speed: number;
  crew: number;
  passengers: number;
  cargo_capacity: number;
  consumables: string;
  vehicle_class: string;
  pilots: string[];
  films: string[];
  created: string; //"2014-12-10T15:36:25.724000Z";
  edited: string; //"2014-12-20T21:30:21.661000Z";
  url: string;
};

// TODO: similar ingredient card to Calculator card
export const Card = ({ name }: Ingredient) => {
  return (
    <div className={"rounded-md border-2 border-amber-50 bg-red-900"}>
      {name}
    </div>
  );
};