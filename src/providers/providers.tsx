import { UserStoreProvider } from "./user-store-provider";
import { IngredientStoreProvider } from "./ingredient-store-provider";
import { GroceryListStoreProvider } from "./grocery-list-store-provider";
import { PropsWithChildren } from "react";
import { serverFetch } from "@/utils/server-actions/server-fetch";
import { GroceryList, Ingredient, UserFormData } from "@/utils/interfaces";
import { headers } from "next/headers";
import { RouteDataFallback } from "@/components/route-data-fallback";

export const Providers = async ({ children }: PropsWithChildren) => {
  const headersList = await headers();
  const pathname = headersList.get("X-Current-Path") || "";

  const userInfo = await serverFetch<UserFormData>({ endpoint: "user" });

  let ingredients: Ingredient[] | null = null;
  let groceryLists: GroceryList[] | null = null;

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

  return (
    <UserStoreProvider userInfo={userInfo}>
      <IngredientStoreProvider ingredients={ingredients} />
      <GroceryListStoreProvider groceryLists={groceryLists} />
      <RouteDataFallback />
      {children}
    </UserStoreProvider>
  );
};