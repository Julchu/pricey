import { UserStoreProvider } from "./user-store-provider";
import { IngredientStoreProvider } from "./ingredient-store-provider";
import { GroceryListStoreProvider } from "./grocery-list-store-provider";
import { RecipeStoreProvider } from "./recipe-store-provider";
import { PropsWithChildren } from "react";
import { serverFetch } from "@/utils/server-actions/server-fetch";
import {
  GroceryList,
  Ingredient,
  Recipe,
  UserFormData,
} from "@/utils/interfaces";
import { headers } from "next/headers";

export const Providers = async ({ children }: PropsWithChildren) => {
  const headersList = await headers();
  const pathname = headersList.get("X-Current-Path") || "";

  const isHome =
    pathname === "/" || pathname === "" || pathname.startsWith("/ingredients");
  const isIngredients = pathname.startsWith("/ingredients");
  const isGroceries = pathname.startsWith("/groceries");
  const isRecipes = pathname.startsWith("/recipes");

  const userInfo = await serverFetch<UserFormData>({ endpoint: "user" });

  let ingredients: Ingredient[] = [];
  let groceryLists: GroceryList[] = [];
  let recipes: Recipe[] = [];

  if (isHome || isIngredients) {
    const fetchedIngredients = await serverFetch<Ingredient[]>({
      endpoint: "ingredient",
    });
    ingredients = fetchedIngredients ? fetchedIngredients : [];
  }

  if (isGroceries) {
    const fetchedGroceryLists = await serverFetch<GroceryList[]>({
      endpoint: "grocery-list",
    });
    groceryLists = fetchedGroceryLists ? fetchedGroceryLists : [];
  }

  if (isRecipes) {
    const fetchedRecipes = await serverFetch<Recipe[]>({ endpoint: "recipe" });
    recipes = fetchedRecipes ? fetchedRecipes : [];
  }

  return (
    <UserStoreProvider userInfo={userInfo}>
      <IngredientStoreProvider ingredients={ingredients}>
        <GroceryListStoreProvider groceryLists={groceryLists}>
          <RecipeStoreProvider recipes={recipes}>
            {children}
          </RecipeStoreProvider>
        </GroceryListStoreProvider>
      </IngredientStoreProvider>
    </UserStoreProvider>
  );
};