import Link from "next/link";
import { Hamburger } from "@/components/header/hamburger";
import { NavigationMenu } from "@base-ui/react";
import ExampleNavigationMenu from "@/components/header/links-navigation-menu";
import * as React from "react";
import { CaretDownIcon } from "@radix-ui/react-icons";

export const Header = () => {
  return (
    <header
      className={
        "flex h-[3rem] flex-row items-center justify-between drop-shadow-lg"
      }
    >
      <Link
        href={"/"}
        className={
          "flex cursor-pointer items-center rounded-md bg-blue-500 px-4 py-2 text-2xl font-bold tracking-widest text-white"
        }
      >
        Pricey
      </Link>

      <ExampleNavigationMenu />

      <LinkNavMenu />
      <Hamburger />
    </header>
  );
};

const triggerClassName =
  "flex h-8 items-center justify-center gap-1.5 bg-transparent px-2 text-sm font-normal text-neutral-950 no-underline select-none min-[501px]:px-3 hover:bg-neutral-100 data-popup-open:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white dark:text-white dark:hover:bg-neutral-800 dark:data-popup-open:bg-neutral-800";

const LinkNavMenu = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="relative flex gap-px">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClassName}>
            <div
              className={
                "flex cursor-pointer items-center rounded-md bg-blue-500 px-4 py-2 text-2xl font-bold tracking-widest text-white"
              }
            >
              Pricey
            </div>
            <NavigationMenu.Icon className="transition-transform duration-200 ease-[ease] data-popup-open:rotate-180">
              <CaretDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

//<ExampleNavigationMenu />