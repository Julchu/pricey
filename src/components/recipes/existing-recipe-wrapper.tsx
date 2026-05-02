"use client";
import { RecipeFormData } from "@/utils/interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { ExistingRecipeForm } from "@/components/recipes/existing-recipe-form";
import { ExistingRecipeDisplay } from "@/components/recipes/existing-recipe-display";

export const ExistingRecipe = ({
  recipe,
  setOpenRecipe,
  last,
}: {
  recipe: RecipeFormData;
  setOpenRecipe: Dispatch<SetStateAction<string>>;
  last: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const deleteRecipeCallback = () => {
    setIsEditing(false);
    setOpenRecipe((currentlyOpenRecipe) => {
      if (currentlyOpenRecipe === recipe.publicId) return "new-recipe";
      return currentlyOpenRecipe;
    });
  };

  const closeEditingCallback = () => {
    setIsEditing(false);
  };

  const startEditingCallback = () => {
    setIsEditing(true);
    if (recipe.publicId) setOpenRecipe(recipe.publicId);
  };

  if (isEditing) {
    return (
      <ExistingRecipeForm
        recipe={recipe}
        closeEditingCallbackAction={closeEditingCallback}
        deleteRecipeCallbackAction={deleteRecipeCallback}
        last={last}
      />
    );
  }

  return (
    <ExistingRecipeDisplay
      recipe={recipe}
      startEditingAction={startEditingCallback}
      last={last}
    />
  );
};
