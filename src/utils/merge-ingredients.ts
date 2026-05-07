import {
  GroceryListIngredientFormData,
  LiquidType,
  MassType,
  UnitType,
} from "@/utils/interfaces";
import {
  isMass,
  isVolume,
  liquidToLitre,
  massToKg,
} from "@/utils/text-formatters";

const toBaseAmount = (
  quantity: number = 1,
  capacity: number = 1,
  unit: UnitType,
): number => {
  const total = quantity * capacity;
  if (isMass(unit)) return total * massToKg[unit as MassType];
  if (isVolume(unit)) return total * liquidToLitre[unit as LiquidType];
  return total;
};

const fromBaseAmount = (
  baseAmount: number,
  capacity: number = 1,
  unit: UnitType,
): number => {
  const factor = isMass(unit)
    ? massToKg[unit as MassType]
    : isVolume(unit)
      ? liquidToLitre[unit as LiquidType]
      : 1;
  return baseAmount / (capacity * factor);
};

export const mergeIngredients = (
  existing: GroceryListIngredientFormData[],
  incoming: GroceryListIngredientFormData[],
): GroceryListIngredientFormData[] => {
  const map = new Map<string, GroceryListIngredientFormData>();

  for (const item of existing) {
    map.set(item.name.trim().toLowerCase(), { ...item });
  }

  for (const item of incoming) {
    const key = item.name.trim().toLowerCase();
    const current = map.get(key);

    if (!current) {
      map.set(key, { ...item, publicId: undefined });
      continue;
    }

    const currentBase = toBaseAmount(
      current.quantity,
      current.capacity,
      current.unit,
    );
    const incomingBase = toBaseAmount(item.quantity, item.capacity, item.unit);
    const totalBase = currentBase + incomingBase;

    const chosenUnit = item.unit || current.unit;
    const chosenCapacity = item.capacity ?? current.capacity ?? 1;
    const chosenPrice = item.price ?? current.price;
    const chosenIngredientId =
      item.ingredientPublicId ?? current.ingredientPublicId;

    const mergedQuantity = fromBaseAmount(
      totalBase,
      chosenCapacity,
      chosenUnit,
    );

    map.set(key, {
      ...current,
      ...item,
      publicId: current.publicId,
      unit: chosenUnit,
      capacity: chosenCapacity,
      quantity: mergedQuantity,
      price: chosenPrice,
      ingredientPublicId: chosenIngredientId,
    });
  }

  return Array.from(map.values());
};