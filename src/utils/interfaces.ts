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

export type MassType = Unit.KILOGRAM | Unit.POUND;

export type VolumeType =
  | Unit.LITRE
  | Unit.QUART
  | Unit.CUP
  | Unit.TABLESPOON
  | Unit.TEASPOON;

export type UnitCategory = {
  mass: MassType;
  volume: VolumeType;
};

export enum Color {
  LIGHT = "light",
  DARK = "dark",
}

export type ColorMode = Color.LIGHT | Color.DARK;

export enum Season {
  spring = "spring",
  winter = "winter",
  summer = "summer",
  fall = "fall",
}

export enum Role {
  admin = "admin",
  standard = "standard",
}

export interface Ingredient {
  name: string;
  price?: number;
  unit?: Unit;
  image?: string;
  /** @param capacity and @param quantity used for @interfaceGroceryList */
  capacity?: number;
  quantity?: number;
  userId: string;
  season?: Season;
  // createdAt?: Timestamp | FieldValue;
  // lastUpdated?: Timestamp | FieldValue;
}

export interface PersonalIngredient extends Ingredient {
  price: number;
  unit: Unit;
}

export interface GroceryList {
  name: string;
  ingredients: Ingredient[];
  viewable?: boolean;
  userId: string;
  // createdAt?: Timestamp | FieldValue;
}

// Public user data (aka not private auth data)
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  name?: string;
  location?: Address;
  // createdAt?: Timestamp;
  role: Role;
  /**
   * @param: prefered units
   * @param: dark/light mode
   * @param: display name
   * @param: publically viewable grocery list profile */
  preferences?: {
    units?: UnitCategory;
    colorMode?: Color;
    displayName?: string;
    dismissedTutorial?: boolean;
    public?: boolean;
  };
}

/* TODO: create Time-to-live (TTL) grocery list w/ ingredients */

/* Logged in user features:
 * Save grocery list
 * Save price thresholds per ingredient
 *
 */

/* TODO: ask user if they want to save address of lowest ingredient
 * City, province/state, country
 */
export interface Address {
  locality: string;
  administrative_area_level_1: string;
  country: string;
}