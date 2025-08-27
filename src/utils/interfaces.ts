export const Unit = {
  // Mass
  KILOGRAM: "kg",
  POUND: "lb",

  // Volume
  LITRE: "L",
  QUART: "qt",
  CUP: "cup",
  TABLESPOON: "tbsp",
  TEASPOON: "tsp",

  ITEM: "item",
} as const;

export const UnitValues = [
  Unit.KILOGRAM,
  Unit.POUND,
  Unit.LITRE,
  Unit.QUART,
  Unit.CUP,
  Unit.TABLESPOON,
  Unit.TEASPOON,
  Unit.ITEM,
] as const;
export const MassValues = [Unit.KILOGRAM, Unit.POUND] as const;
export const VolumeValues = [Unit.LITRE, Unit.QUART] as const;

export type UnitType = (typeof UnitValues)[number]; // "kg" | "lb" | "L" | "qt" | "cup" | "tbsp" | "tsp" | "item";
export type MassType = (typeof MassValues)[number]; // "kg" | "lb"
export type LiquidType = (typeof VolumeValues)[number]; // "L" | "qt"

export type UnitCategory = {
  mass: MassType;
  volume: LiquidType;
};

export const Color = {
  LIGHT: "light",
  DARK: "dark",
} as const;
export const ColorValues = [Color.LIGHT, Color.DARK] as const;
export type ColorMode = (typeof ColorValues)[number];

export const Season = {
  SPRING: "spring",
  WINTER: "winter",
  SUMMER: "summer",
  FALL: "fall",
} as const;

export const SeasonValues = [
  Season.SPRING,
  Season.WINTER,
  Season.SUMMER,
  Season.FALL,
] as const;
export type SeasonType = (typeof SeasonValues)[number];

export const Role = {
  admin: "admin",
  standard: "standard",
};
export const RoleValues = [Role.admin, Role.standard];
export type RoleType = (typeof RoleValues)[number];

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
  colorMode?: ColorMode;
  displayName?: string;
};

export type Ingredient = {
  id: number;
  name: string;
  userId: number;
  price: number;
  capacity: number;
  quantity?: number;
  unit: UnitType;
  image?: string;
  season?: SeasonType;
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
export type GroceryListFormData = {
  name: string;
  ingredients: IngredientFormData[];
  public?: boolean;
};
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
