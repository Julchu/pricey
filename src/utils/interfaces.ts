export const Unit = {
  // Mass
  KILOGRAM: "kg",
  GRAM: "g",
  POUND: "lb",
  OUNCE: "oz",

  // Volume
  LITRE: "L",
  MILLILITER: "ml",
  QUART: "qt",
  CUP: "cup",
  TABLESPOON: "tbsp",
  TEASPOON: "tsp",

  PIECES: "pcs",
} as const;

export const UnitValues = [
  Unit.KILOGRAM,
  Unit.GRAM,
  Unit.POUND,
  Unit.OUNCE,
  Unit.LITRE,
  Unit.MILLILITER,
  Unit.QUART,
  Unit.CUP,
  Unit.TABLESPOON,
  Unit.TEASPOON,
  Unit.PIECES,
  undefined,
];
export const UnitEnums = [...UnitValues] as const;

export const MassValues = [Unit.KILOGRAM, Unit.GRAM, Unit.POUND, Unit.OUNCE];
export const MassEnums = [...MassValues] as const;

export const VolumeValues = [
  Unit.LITRE,
  Unit.MILLILITER,
  Unit.QUART,
  Unit.CUP,
  Unit.TABLESPOON,
  Unit.TEASPOON,
];
export const VolumeEnums = [...VolumeValues] as const;

export type UnitType = (typeof UnitEnums)[number];
export type MassType = (typeof MassEnums)[number];
export type LiquidType = (typeof VolumeEnums)[number];

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
  publicId: string;
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
  publicId?: string;
  name: string;
  price?: number;
  capacity?: number;
  quantity?: number;
  unit: UnitType;
  image?: string;
  season?: SeasonType;
};

export type GroceryListIngredient = Omit<
  Ingredient & {
    groceryListId: string;
    ingredientPublicId?: string;
  },
  "price"
>;

export type GroceryList = {
  publicId: string;
  name: string;
  ingredients: GroceryListIngredient[];
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RecipeIngredient = Omit<
  Ingredient & {
    recipeId: string;
    ingredientPublicId?: string;
  },
  "price"
>;

export type Recipe = {
  publicId: string;
  name: string;
  ingredients: RecipeIngredient[];
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PantryIngredient = Omit<
  Ingredient & {
    ingredientPublicId?: string;
  },
  "price"
>;

type FormData<T> = Omit<T, "userId" | "groceryListId" | "recipeId">;

// TODO: fix types; form data might differ from public returned types, but ids should not be included in form submission types
export type UserFormData = FormData<User>;
export type IngredientFormData = FormData<Ingredient>;

export type GroceryListIngredientFormData = FormData<GroceryListIngredient>;

export type GroceryListFormData = {
  name: string;
  ingredients: GroceryListIngredientFormData[];
  publicId?: string;
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GroceryListUpdateFormData = {
  deletedIngredientIds: string[];
  newIngredients: GroceryListIngredientFormData[];
  updatedIngredients: GroceryListIngredientFormData[];
  groceryList: Omit<GroceryListFormData, "ingredients">;
};

export type RecipeIngredientFormData = FormData<RecipeIngredient>;

export type RecipeFormData = {
  name: string;
  ingredients: RecipeIngredientFormData[];
  publicId?: string;
  public?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type RecipeUpdateFormData = {
  deletedIngredientIds: string[];
  newIngredients: RecipeIngredientFormData[];
  updatedIngredients: RecipeIngredientFormData[];
  recipe: Omit<RecipeFormData, "ingredients">;
};

export type PantryIngredientFormData = FormData<PantryIngredient>;

export type PantryFormData = {
  ingredients: PantryIngredientFormData[];
};

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