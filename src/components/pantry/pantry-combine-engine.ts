/**
 * pantry-combine-engine.ts
 *
 * A smarter engine for merging pantry items that refer to the same ingredient.
 *
 * Semantic model (differs from grocery-list / recipe ingredients):
 *   quantity — total count of discrete containers/packages on the shelf.
 *              An undefined quantity is treated as 1 (item is present).
 *   capacity — total stock amount in a canonical unit (mass or volume),
 *              i.e. the SUM of all (quantity × per-item-capacity) across every
 *              combined entry. Items with no capacity contribute 0 to this total.
 *   unit     — canonical unit chosen for the combined total (see pickCanonicalUnit).
 *
 * Example:
 *   stub from ingredient list:  { quantity: undefined, capacity: undefined, unit: undefined }
 *   add from grocery list A:    { quantity: 1, capacity: 2,     unit: 'L' }
 *   add from grocery list B:    { quantity: 1, capacity: 0.710, unit: 'L' }
 *   ─────────────────────────────────────────────────────────────────────────
 *   result:                     { quantity: 3, capacity: 2.710, unit: 'L' }
 *     └─ 3 bottles on the shelf, 2.710 L of Pepsi in total
 *
 * Cross-unit conversion (same category only):
 *   { quantity: 1, capacity: 500, unit: 'ml' }  +
 *   { quantity: 2, capacity: 1,   unit: 'L'  }
 *   → canonical 'ml' (first measurable unit encountered)
 *   → total base = 0.5 L + 2 L = 2.5 L → 2 500 ml
 *   → { quantity: 3, capacity: 2500, unit: 'ml' }
 *
 * IMPORTANT: capacity in the merged result means TOTAL STOCK, not per-item size.
 * This differs from GroceryListIngredient / RecipeIngredient where capacity = per-item.
 *
 * This file is intentionally NOT integrated into pantry-store.ts.
 * Drop addItemToPantry / addItems in the store to swap in upsertPantryItem /
 * upsertPantryIngredients when ready.
 */

import {
  LiquidType,
  MassType,
  PantryIngredient,
  Unit,
  UnitType,
} from "@/utils/interfaces";
import {
  isMass,
  isVolume,
  liquidToLitre,
  massToKg,
} from "@/utils/text-formatters";

// ---------------------------------------------------------------------------
// Internal unit helpers
// ---------------------------------------------------------------------------

type MeasureCategory = "mass" | "volume" | "pieces" | "none";

function getCategory(unit: UnitType): MeasureCategory {
  if (!unit) return "none";
  if (isMass(unit)) return "mass";
  if (isVolume(unit)) return "volume";
  if (unit === Unit.PIECES) return "pieces";
  return "none";
}

/**
 * Convert an amount in the given unit to the base unit for its category.
 *   mass    → kg
 *   volume  → L
 *   pieces  → count (factor 1, no conversion needed)
 * Returns null for unknown / undefined units.
 */
function toBase(amount: number, unit: UnitType): number | null {
  if (!unit) return null;
  if (isMass(unit)) return amount * massToKg[unit as MassType];
  if (isVolume(unit)) return amount * liquidToLitre[unit as LiquidType];
  if (unit === Unit.PIECES) return amount;
  return null;
}

/**
 * Convert a base-unit amount (kg / L / count) back to the given target unit.
 */
function fromBase(baseAmount: number, targetUnit: UnitType): number {
  if (!targetUnit) return baseAmount;
  if (isMass(targetUnit)) return baseAmount / massToKg[targetUnit as MassType];
  if (isVolume(targetUnit))
    return baseAmount / liquidToLitre[targetUnit as LiquidType];
  return baseAmount; // PIECES or unknown — 1-to-1
}

/**
 * Pick the canonical unit for a combined entry.
 *
 * Priority:
 *   1. First item that has a measurable unit (mass or volume) — preserves the
 *      unit already in the pantry so existing display labels don't change.
 *   2. PIECES if no measurable unit exists but at least one is PIECES.
 *   3. undefined — all items have no unit information.
 */
function pickCanonicalUnit(items: PantryIngredient[]): UnitType {
  for (const item of items) {
    const cat = getCategory(item.unit);
    if (cat === "mass" || cat === "volume") return item.unit;
  }
  for (const item of items) {
    if (item.unit === Unit.PIECES) return Unit.PIECES;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Core: collapse an array of same-ingredient items into one merged entry
// ---------------------------------------------------------------------------

/**
 * Merge an array of PantryIngredient entries that all refer to the same
 * ingredient into a single combined entry.
 *
 * The last item in the array wins for display metadata (name, image, season,
 * ingredientPublicId) so the most-recently-added source is reflected.
 *
 * @throws if items is empty
 */
export function combineIngredientItems(
  items: PantryIngredient[],
): PantryIngredient {
  if (items.length === 0)
    throw new Error("combineIngredientItems: items array must not be empty");

  const canonical = pickCanonicalUnit(items);
  const canonicalCategory = getCategory(canonical);

  let totalQuantity = 0;
  let totalBase = 0; // kg, L, or count depending on canonicalCategory

  for (const item of items) {
    // undefined quantity → treat as 1 (item is present on the shelf)
    const qty = item.quantity ?? 1;
    totalQuantity += qty;

    // Only accumulate capacity when:
    //   • item has a capacity value
    //   • item has a unit
    //   • item's unit category matches the canonical (avoids mixing L + kg)
    if (
      item.capacity != null &&
      item.unit != null &&
      canonicalCategory !== "none" &&
      getCategory(item.unit) === canonicalCategory
    ) {
      const itemBase = toBase(qty * item.capacity, item.unit);
      if (itemBase !== null) totalBase += itemBase;
    }
  }

  // Only store a capacity if we actually accumulated something measurable
  const totalCapacity =
    canonicalCategory !== "none" && totalBase > 0
      ? fromBase(totalBase, canonical)
      : undefined;

  // Most-recently-added item provides the display metadata
  const representative = items[items.length - 1];

  return {
    ...representative,
    quantity: totalQuantity,
    capacity: totalCapacity,
    unit: canonical,
  };
}

// ---------------------------------------------------------------------------
// Public upsert API
// ---------------------------------------------------------------------------

/**
 * Upsert a single incoming PantryIngredient into an existing pantry list.
 *
 * Match priority:
 *   1. ingredientPublicId (case-insensitive) — primary key; assumes the item
 *      exists in the master ingredient list (as per domain assumption).
 *   2. name (case-insensitive, trimmed) — fallback for items without a publicId.
 *
 * If a match is found the existing entry and the incoming item are combined
 * via combineIngredientItems. Otherwise the incoming item is appended.
 */
export function upsertPantryItem(
  pantryIngredients: PantryIngredient[],
  incoming: PantryIngredient,
): PantryIngredient[] {
  const matchIndex = findMatchIndex(pantryIngredients, incoming);

  if (matchIndex === -1) {
    return [...pantryIngredients, incoming];
  }

  const merged = combineIngredientItems([
    pantryIngredients[matchIndex],
    incoming,
  ]);

  return [
    ...pantryIngredients.slice(0, matchIndex),
    merged,
    ...pantryIngredients.slice(matchIndex + 1),
  ];
}

/**
 * Upsert multiple incoming items into the pantry list in a single pass.
 * Equivalent to calling upsertPantryItem for each item sequentially.
 */
export function upsertPantryIngredients(
  pantryIngredients: PantryIngredient[],
  incoming: PantryIngredient[],
): PantryIngredient[] {
  return incoming.reduce(
    (acc, item) => upsertPantryItem(acc, item),
    pantryIngredients,
  );
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function findMatchIndex(
  pantryIngredients: PantryIngredient[],
  incoming: PantryIngredient,
): number {
  // Prefer ingredientPublicId — stable cross-source identity
  if (incoming.ingredientPublicId) {
    const idx = pantryIngredients.findIndex(
      (item) =>
        item.ingredientPublicId?.toLowerCase() ===
        incoming.ingredientPublicId!.toLowerCase(),
    );
    if (idx !== -1) return idx;
  }
  // Fallback: name match (handles blank items added without a publicId)
  return pantryIngredients.findIndex(
    (item) =>
      item.name.trim().toLowerCase() === incoming.name.trim().toLowerCase(),
  );
}