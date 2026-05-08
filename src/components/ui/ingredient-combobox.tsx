"use client";

import { Popover } from "radix-ui";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { Ingredient } from "@/utils/interfaces";
import { useShallow } from "zustand/react/shallow";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";

export const IngredientCombobox = ({ index }: { index: number }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>();

  useLayoutEffect(() => {
    if (!triggerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setTriggerWidth(entries[0].contentRect.width);
    });
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  const [open, setOpen] = useState(false);

  const { setValue, control } = useFormContext();

  const ingredients = useIngredientsStore(
    useShallow(({ ingredients }) => ingredients),
  );

  const [name, ingredientPublicId] = useWatch({
    control,
    name: [
      `ingredients.${index}.name`,
      `ingredients.${index}.ingredientPublicId`,
    ],
  });

  const selectedIngredient = ingredients.find(
    ({ publicId }) => publicId === ingredientPublicId,
  );

  const [debouncedName, setDebouncedName] = useState(name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name);
    }, 150);
    return () => clearTimeout(timer);
  }, [name]);

  const filtered = useMemo(() => {
    if (!debouncedName) return ingredients;
    const q = debouncedName.toLowerCase().trim();
    if (!q) return ingredients;

    // Filter ingredients that contain the search term
    const matchingIngredients = ingredients.filter((i) =>
      i.name.toLowerCase().includes(q),
    );

    // Sort by relevance: exact match first, then starts with, then includes
    return matchingIngredients.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      // Exact match gets highest priority
      if (nameA === q && nameB !== q) return -1;
      if (nameB === q && nameA !== q) return 1;

      // Starts with search term gets second priority
      const aStartsWith = nameA.startsWith(q);
      const bStartsWith = nameB.startsWith(q);
      if (aStartsWith && !bStartsWith) return -1;
      if (bStartsWith && !aStartsWith) return 1;

      // Alphabetical order for same-priority items
      return nameA.localeCompare(nameB);
    });
  }, [ingredients, debouncedName]);

  const {
    field: { onChange },
  } = useController({
    name: `ingredients.${index}.name`,
    control,
  });

  const handleSelect = (ingredient: Ingredient) => {
    setOpen(false);
    onSelect(ingredient);
  };

  const onClickHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;

    // If user types away from a previously selected master ingredient,
    // clear the link so it becomes a custom ingredient.
    if (selectedIngredient && text !== selectedIngredient.name) {
      onSelect(null);
    }

    if (!open) setOpen(true);

    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onSelect = (ingredient: Ingredient | null) => {
    if (ingredient) {
      setValue(`ingredients.${index}.name`, ingredient.name, {
        shouldDirty: true,
      });
      setValue(`ingredients.${index}.unit`, ingredient.unit, {
        shouldDirty: true,
      });
      setValue(`ingredients.${index}.ingredientPublicId`, ingredient.publicId, {
        shouldDirty: true,
      });
    } else {
      setValue(`ingredients.${index}.ingredientPublicId`, undefined, {
        shouldDirty: true,
      });
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor ref={triggerRef}>
        <Input
          placeholder={"Pepsi"}
          id={"ingredient-name"}
          type={"search"}
          value={name}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onChange={onClickHandler}
        />
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          style={{ width: triggerWidth }}
          className="text-md z-50 flex min-h-10 rounded-md border border-gray-200 bg-white font-medium shadow-lg outline-none placeholder:font-normal placeholder:text-gray-400 sm:col-span-2 lg:col-span-4"
          sideOffset={4}
          align={"start"}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-60 w-full overflow-auto p-2">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">
                No ingredients found
              </div>
            ) : (
              filtered.map((ingredient) => (
                <div
                  key={ingredient.publicId}
                  role="option"
                  aria-selected={ingredient.publicId === ingredientPublicId}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium capitalize hover:bg-blue-500 hover:text-white"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(ingredient)}
                >
                  {ingredient.name}
                </div>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};