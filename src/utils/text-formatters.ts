import {
  Ingredient,
  LiquidType,
  MassEnums,
  MassType,
  Unit,
  UnitCategory,
  UnitType,
  VolumeEnums,
} from "@/utils/interfaces";

export const filterNullableObject = (
  obj: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.entries(obj).reduce<Record<string, unknown>>(
    (previousObject, [key, value]) => {
      if (value) previousObject[key] = value;
      return previousObject;
    },
    {},
  );
};

export const isMass = (unit?: string): unit is MassType =>
  MassEnums.includes(unit as MassType);

export const isVolume = (unit?: string): unit is LiquidType =>
  VolumeEnums.includes(unit as LiquidType);

// Conversion factors to base units (kg for mass, L for liquid volume)
export const massToKg: Record<MassType, number> = {
  [Unit.KILOGRAM]: 1,
  [Unit.GRAM]: 0.001,
  [Unit.POUND]: 0.453592,
  [Unit.OUNCE]: 0.0283495,
};

export const liquidToLitre: Record<LiquidType, number> = {
  [Unit.LITRE]: 1,
  [Unit.MILLILITER]: 0.001,
  [Unit.QUART]: 0.946353,
  [Unit.CUP]: 0.236588,
  [Unit.TABLESPOON]: 0.0147868,
  [Unit.TEASPOON]: 0.00492892,
};

export const priceConverter = (
  price?: number,
  fromUnit?: UnitType,
  toUnits?: UnitCategory,
): number | undefined => {
  if (!price) return;

  if (isMass(fromUnit) && toUnits?.mass) {
    return price * (massToKg[toUnits.mass] / massToKg[fromUnit]);
  }
  if (isVolume(fromUnit) && toUnits?.volume) {
    return price * (liquidToLitre[toUnits.volume] / liquidToLitre[fromUnit]);
  }

  return price;
};

/* Gets current individual unit and converts to individual toUnit based on category
 * If selected unit is mass (Unit.pound) and currentUnits = { mass: Unit.kilogram, volume: Unit.litres }
 * Return opposite mass (Unit.litres)
 */
export const unitConverter = (
  fromUnit?: UnitType,
  toUnits: UnitCategory = { mass: Unit.KILOGRAM, volume: Unit.LITRE },
): UnitType => {
  if (isMass(fromUnit)) return toUnits.mass;
  else if (isVolume(fromUnit)) return toUnits.volume;
  return Unit.PIECES;
};

// TODO: verify amount cents
// Price per measurement per unit; takes care of float by multiplying by 100 to cents
export const calcIndividualPrice = (
  priceCents?: number,
  capacity: number = 1, // default 1 for GroceryList ingredients that might not have measurements added
  quantity: number = 1,
): number | undefined => {
  if (!priceCents) return;
  return (
    priceCents /
    (capacity > 0 ? capacity : 1) /
    (quantity > 0 ? quantity : 1) /
    100
  );
};

// TODO: verify amount cents
// Total price based on price per measurement and capacity/quantity
export const calcTotalPrice = (
  priceCents?: number,
  capacity?: number,
  quantity?: number,
): number | undefined => {
  if (!priceCents) return;
  return priceCents * (capacity ? capacity : 1) * (quantity ? quantity : 1);
};

export const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (price?: number) => {
  if (!price) return "";
  return CurrencyFormatter.format(price);
};

export const PriceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (price?: number) => {
  if (!price) return "0.00";
  return PriceFormatter.format(price);
};

export const getPercentChange = (
  earlierPrice?: number,
  laterPrice?: number,
): number | null => {
  if (!earlierPrice || !laterPrice) return null;
  return ((laterPrice - earlierPrice) / earlierPrice) * 100;
};

export const PercentageFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const validateIsNumber = (value?: number): boolean => {
  return !!value;
};

/**
 * Computes the derived total price for a grocery-list ingredient
 * based on its linked master ingredient, user-preferred units,
 * and the grocery item's own capacity / quantity.
 *
 * Steps:
 * 1. price per unit of capacity for the master ingredient
 * 2. convert to user's preferred measurement unit
 * 3. multiply by grocery item's capacity and quantity
 */
export const calcGroceryIngredientPrice = (
  masterIngredient: Ingredient | undefined,
  groceryCapacity: number,
  groceryQuantity: number,
  userUnits: UnitCategory,
): number | undefined => {
  if (!masterIngredient?.price) return undefined;

  const pricePerCapacity = calcIndividualPrice(
    masterIngredient.price,
    masterIngredient.capacity,
    masterIngredient.quantity,
  );

  if (pricePerCapacity === undefined) return undefined;

  const convertedPrice = priceConverter(
    pricePerCapacity,
    masterIngredient.unit,
    userUnits,
  );

  return calcTotalPrice(convertedPrice, groceryCapacity, groceryQuantity);
};