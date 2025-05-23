export enum Unit {
  // Mass
  KILOGRAM = "kg",
  POUND = "lb",

  // Volume
  LITRE = "L",
  QUART = "qt",
  CUP = "cup",
  TABLESPOON = "tbsp",
  TEASPOON = "tsp",

  ITEM = "item",
}

export type UnitType = MassType | LiquidType | OtherType;

export type OtherType = Unit.ITEM | Unit.CUP | Unit.TABLESPOON | Unit.TEASPOON;

export type MassType = Unit.KILOGRAM | Unit.POUND;

export type LiquidType = Unit.LITRE | Unit.QUART;

export type UnitCategory = {
  mass: MassType;
  volume: LiquidType;
};

export enum Color {
  LIGHT = "light",
  DARK = "dark",
}

export type ColorMode = Color.LIGHT | Color.DARK;

export enum Season {
  SPRING = "spring",
  WINTER = "winter",
  SUMMER = "summer",
  FALL = "fall",
}

export enum Role {
  admin = "admin",
  standard = "standard",
}

// Public user data (aka not private auth data)
export type User = {
  email: string;
  image?: string;
  name?: string;
  location?: Address;
  preferences?: UserPreferences;
};

/**
 * @param: prefered units
 * @param: dark/light mode
 * @param: display name
 * @param: publically viewable grocery list profile */
export type UserPreferences = {
  units?: UnitCategory;
  colorMode?: Color;
  displayName?: string;
};

export type Ingredient = {
  id: number;
  name: string;
  userId: number;
  price: number;
  capacity: number;
  quantity?: number;
  unit: Unit;
  image?: string;
  season?: Season;
};

export type GroceryList = {
  id: number;
  name: string;
  ingredients: Ingredient[];
  userId: number;
  public?: boolean;
};

export type Recipe = {
  id: number;
  name: string;
  ingredients: Ingredient[];
  userId: number;
  public?: boolean;
};

type FormData<T> = Omit<T, "id" | "userId">;

// TODO: fix types; form data might differ from public returned types, but ids aren't included
export type IngredientFormData = FormData<Ingredient>;
export type UserFormData = FormData<User>;
export type GroceryListFormData = FormData<GroceryList>;
export type RecipeFormData = FormData<Recipe>;

/* TODO: create Time-to-live (TTL) grocery list w/ ingredients */

/* Logged in user features:
 * Save grocery list
 * Save price thresholds per ingredient
 *
 */

/* TODO: ask user if they want to save address of lowest ingredient
 * City, province/state, country
 */
export type Address = {
  locality: string;
  administrative_area_level_1: string;
  country: string;
};