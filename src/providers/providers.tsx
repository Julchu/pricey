import { UserStoreProvider } from "./user-store-provider";
import { IngredientStoreProvider } from "./ingredient-store-provider";
import { GroceryListStoreProvider } from "./grocery-list-store-provider";
import { RecipeStoreProvider } from "./recipe-store-provider";
import { RouteDataFallback } from "@/components/route-data-fallback";
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

  const userInfo = await serverFetch<UserFormData>({ endpoint: "user" });

  let ingredients: Ingredient[] | null = null;
  let groceryLists: GroceryList[] | null = null;
  let recipes: Recipe[] | null = null;

  if (
    pathname === "/" ||
    pathname.includes("/ingredients") ||
    pathname === ""
  ) {
    ingredients = await serverFetch<Ingredient[]>({ endpoint: "ingredient" });
  }

  if (pathname.includes("/groceries")) {
    groceryLists = await serverFetch<GroceryList[]>({
      endpoint: "grocery-list",
    });
  }

  if (pathname.includes("/recipes")) {
    recipes = await serverFetch<Recipe[]>({ endpoint: "recipes" });
  }

  return (
    <UserStoreProvider userInfo={userInfo}>
      <IngredientStoreProvider ingredients={ingredients}>
        <GroceryListStoreProvider groceryLists={groceryLists}>
          <RecipeStoreProvider recipes={recipes}>
            <RouteDataFallback />
            {children}
          </RecipeStoreProvider>
        </GroceryListStoreProvider>
      </IngredientStoreProvider>
    </UserStoreProvider>
  );
};