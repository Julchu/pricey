"use client";
import { Accordion } from "@base-ui/react/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import { NewRecipeForm } from "./new-recipe-form";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { useState } from "react";
import { ExistingRecipe } from "@/components/recipes/existing-recipe-wrapper";

export const RecipeAccordion = () => {
  const recipes = useRecipesStore(({ recipes }) => recipes);
  const [openRecipe, setOpenRecipe] = useState<string>("new-recipe");

  return (
    <Accordion.Root
      className={"flex w-full flex-col gap-px"}
      value={[openRecipe]}
      onValueChange={(values) => setOpenRecipe(values[0] ?? "")}
    >
      <AccordionItem value={"new-recipe"}>
        <NewRecipeForm setOpenRecipe={setOpenRecipe} />
      </AccordionItem>

      {recipes.map((recipe, index) => (
        <AccordionItem
          key={`${recipe.name}_${index}`}
          value={`${recipe.publicId}`}
        >
          <ExistingRecipe
            recipe={recipe}
            setOpenRecipe={setOpenRecipe}
            last={index === recipes.length - 1}
          />
        </AccordionItem>
      ))}
    </Accordion.Root>
  );
};