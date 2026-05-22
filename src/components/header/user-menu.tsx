"use client";
import { useCallback } from "react";
import { Menu } from "@base-ui/react/menu";
import { LiquidType, MassType, Unit } from "@/utils/interfaces";
import { MenuLinks, MenuRadioItem } from "@/components/header/items";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";
import { useUserStore } from "@/providers/user-store-provider";
import { useIngredientsStore } from "@/providers/ingredient-store-provider";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useGroceryListsStore } from "@/providers/grocery-list-store-provider";
import { useRecipesStore } from "@/providers/recipe-store-provider";
import { usePantryStore } from "@/providers/pantry-store-provider";

export const UserMenu = () => {
  const clearIngredients = useIngredientsStore(
    ({ clearIngredients }) => clearIngredients,
  );

  const clearGroceryLists = useGroceryListsStore(
    ({ clearGroceryLists }) => clearGroceryLists,
  );

  const clearRecipes = useRecipesStore(({ clearRecipes }) => clearRecipes);

  const setPantryOpen = usePantryStore(({ setPantryOpen }) => setPantryOpen);

  const { mass, setMass, liquidVolume, setLiquidVolume, userInfo, logout } =
    useUserStore(
      useShallow(
        ({
          mass,
          setMass,
          liquidVolume,
          setLiquidVolume,
          userInfo,
          logout,
        }) => ({
          mass,
          setMass,
          liquidVolume,
          setLiquidVolume,
          userInfo,
          logout,
        }),
      ),
    );

  const logoutHandler = () => {
    logout();
    clearIngredients();
    clearGroceryLists();
    clearRecipes();
  };

  const toggleMass = useCallback(
    (massType: string) => {
      setMass(massType as MassType);
    },
    [setMass],
  );

  const toggleLiquidVolume = useCallback(
    (liquidType: string) => {
      setLiquidVolume(liquidType as LiquidType);
    },
    [setLiquidVolume],
  );

  return (
    <>
      <Menu.Portal>
        <Menu.Positioner sideOffset={5} align="end">
          <Menu.Popup
            className={
              "data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-up-and-fade data-[side=top]:animate-slide-right-and-fade z-2 min-w-40 rounded-md bg-white p-1 tracking-widest shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] select-none"
            }
          >
            <Menu.Group>
              <Menu.GroupLabel
                className={"pl-4 text-xs leading-6 font-medium opacity-50"}
              >
                Mass
              </Menu.GroupLabel>
              <Menu.RadioGroup
                value={mass}
                onValueChange={toggleMass}
                className={"cursor-pointer"}
              >
                <MenuRadioItem value={Unit.KILOGRAM} name={"kg"} />
                <MenuRadioItem value={Unit.GRAM} name={"g"} />
                <MenuRadioItem value={Unit.POUND} name={"lb"} />
              </Menu.RadioGroup>

              <Menu.Separator
                className={"relative m-1 flex h-px bg-black opacity-20"}
              />

              <Menu.GroupLabel
                className={"pl-4 text-xs leading-6 font-medium opacity-50"}
              >
                Liquids
              </Menu.GroupLabel>
              <Menu.RadioGroup
                value={liquidVolume}
                onValueChange={toggleLiquidVolume}
                className={"cursor-pointer"}
              >
                <MenuRadioItem value={Unit.LITRE} name={"L"} />
                <MenuRadioItem value={Unit.MILLILITER} name={"ml"} />
                <MenuRadioItem value={Unit.QUART} name={"qt"} />
              </Menu.RadioGroup>
            </Menu.Group>

            <MenuLinks />

            <Menu.Group>
              <Menu.Separator className={"m-1 h-px bg-black opacity-20"} />
              <Menu.GroupLabel className="pl-4 text-xs leading-6 font-medium opacity-50">
                Kitchen
              </Menu.GroupLabel>
              <Menu.Item
                className={
                  "text-md relative flex h-6 content-center items-center rounded-md py-4 leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                }
                onClick={() => setPantryOpen(true)}
              >
                <p className={"ml-6 w-full cursor-pointer"}>Pantry</p>
              </Menu.Item>
            </Menu.Group>

            <Menu.Group>
              <Menu.Separator className={"m-1 h-px bg-black opacity-20"} />
              <Menu.GroupLabel className="pl-4 text-xs leading-6 font-medium opacity-50">
                Profile
              </Menu.GroupLabel>

              <Menu.Item
                className={
                  "text-md relative flex h-6 content-center items-center rounded-md py-4 leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                }
              >
                {userInfo ? (
                  <p
                    onClick={logoutHandler}
                    className={"ml-6 w-full cursor-pointer"}
                  >
                    Logout
                  </p>
                ) : (
                  <Link
                    href={"/api/login"}
                    className={
                      "flex w-full items-center justify-center gap-x-2 p-2"
                    }
                  >
                    <GoogleIcon />
                    <p>Sign in with Google</p>
                  </Link>
                )}
              </Menu.Item>
            </Menu.Group>

            <Menu.Arrow className="fill-white" />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </>
  );
};