"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { Ingredient } from "@/utils/interfaces";

export const IngredientCombobox = ({ index }: { index: number }) => {
  const { setValue, control } = useFormContext();

  const ingredients = useIngredientsStore(
    useShallow(({ ingredients }) => ingredients),
  );

  const [name] = useWatch({
    control,
    name: [`ingredients.${index}.name`],
  });

  const {
    field: { ref, onBlur },
  } = useController({
    name: `ingredients.${index}.name`,
    control,
    rules: { required: "Name is required" },
  });

  const filteredItems = useMemo(() => {
    const q = (name ?? "").toLowerCase().trim();
    if (!q) return ingredients;

    const matching = ingredients.filter((i) =>
      i.name.toLowerCase().includes(q),
    );

    return matching.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA === q && nameB !== q) return -1;
      if (nameB === q && nameA !== q) return 1;
      const aStarts = nameA.startsWith(q);
      const bStarts = nameB.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (bStarts && !aStarts) return 1;
      return nameA.localeCompare(nameB);
    });
  }, [ingredients, name]);

  const handleValueChange = (inputValue: string) => {
    setValue(`ingredients.${index}.name`, inputValue, { shouldDirty: true });

    const match = ingredients.find(
      (i) => i.name.toLowerCase() === inputValue.toLowerCase(),
    );

    if (match) {
      setValue(`ingredients.${index}.unit`, match.unit, { shouldDirty: true });
      setValue(`ingredients.${index}.ingredientPublicId`, match.publicId, {
        shouldDirty: true,
      });
    } else {
      setValue(`ingredients.${index}.ingredientPublicId`, undefined, {
        shouldDirty: true,
      });
    }
  };

  return (
    <Autocomplete.Root
      value={name ?? ""}
      onValueChange={handleValueChange}
      items={filteredItems}
      itemToStringValue={(item) => item.name}
      mode="list"
      openOnInputClick
    >
      <Autocomplete.Input
        ref={ref}
        onBlur={onBlur}
        placeholder="Pepsi"
        type="search"
        className="text-md flex min-h-10 w-full rounded-md border border-gray-200 px-[15px] font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
      />

      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={10} align="start">
          <Autocomplete.Popup className="text-md z-50 w-[var(--anchor-width)] max-w-[var(--available-width)] rounded-md border border-gray-200 bg-white font-medium shadow-lg outline-none">
            <Autocomplete.Empty>
              <p className={"m-2 px-3 py-2 text-sm text-gray-400"}>
                No ingredients found
              </p>
            </Autocomplete.Empty>
            <Autocomplete.List className={"max-h-60 overflow-y-auto"}>
              {(item: Ingredient) => (
                <Autocomplete.Item
                  key={item.publicId}
                  value={item}
                  className={
                    "m-2 cursor-pointer rounded-md px-3 py-2 text-sm font-medium capitalize hover:bg-blue-500 hover:text-white data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                  }
                >
                  {item.name}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};