"use client";
import { useCallback } from "react";
import { DropdownMenu } from "radix-ui";
import { LiquidType, MassType, Unit } from "@/utils/interfaces";
import { MenuLinks, MenuRadioItem } from "@/components/header/items";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

export const UserMenu = () => {
  const [mass, setMass, liquidVolume, setLiquidVolume, userInfo, logout] =
    useUserStore(
      useShallow(
        ({
          mass,
          setMass,
          liquidVolume,
          setLiquidVolume,
          userInfo,
          logout,
        }) => [mass, setMass, liquidVolume, setLiquidVolume, userInfo, logout],
      ),
    );

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

  const activePage = usePathname();

  return (
    <>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={
            "data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-up-and-fade data-[side=top]:animate-slide-right-and-fade min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] select-none"
          }
          sideOffset={5}
          align={"end"}
        >
          <section>
            <DropdownMenu.Label
              className={"pl-4 text-xs leading-[25px] font-medium opacity-50"}
            >
              Mass
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={mass}
              onValueChange={toggleMass}
              className={"cursor-pointer"}
            >
              <MenuRadioItem value={Unit.KILOGRAM} name={"Kilograms (kg)"} />
              <MenuRadioItem value={Unit.POUND} name={"Pounds (lb)"} />
            </DropdownMenu.RadioGroup>

            <DropdownMenu.Separator
              className={"relative m-[5px] flex h-px bg-black opacity-20"}
            />

            <DropdownMenu.Label
              className={"pl-4 text-xs leading-[25px] font-medium opacity-50"}
            >
              Liquids
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={liquidVolume}
              onValueChange={toggleLiquidVolume}
              className={"cursor-pointer"}
            >
              <MenuRadioItem value={Unit.LITRE} name={"Litres (L)"} />
              <MenuRadioItem value={Unit.QUART} name={"Quarts (qt)"} />
            </DropdownMenu.RadioGroup>
          </section>

          <MenuLinks activePage={activePage} />

          <section>
            <DropdownMenu.Separator
              className={"m-[5px] h-px bg-black opacity-20"}
            />
            <DropdownMenu.Label className="pl-4 text-xs leading-[25px] font-medium opacity-50">
              Profile
            </DropdownMenu.Label>

            <DropdownMenu.Item
              className={
                "text-md relative flex h-[25px] content-center items-center rounded-md py-4 leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
              }
            >
              {userInfo ? (
                <p
                  onClick={logout}
                  className={"ml-[25px] w-full cursor-pointer"}
                >
                  Logout
                </p>
              ) : (
                <Link
                  href={"/api/login"}
                  className={"flex w-full items-center justify-center gap-x-2"}
                >
                  <GoogleIcon />
                  <p>Sign in with Google</p>
                </Link>
              )}
            </DropdownMenu.Item>
          </section>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </>
  );
};

const GoogleIcon = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
      <g clipPath="url(#clip0_710_6217)">
        <path
          d="M29.6 20.2273C29.6 19.5182 29.5364 18.8364 29.4182 18.1818H20V22.05H25.3818C25.15 23.3 24.4455 24.3591 23.3864 25.0682V27.5773H26.6182C28.5091 25.8364 29.6 23.2727 29.6 20.2273Z"
          fill="#4285F4"
        />
        <path
          d="M20 30C22.7 30 24.9636 29.1045 26.6181 27.5773L23.3863 25.0682C22.4909 25.6682 21.3454 26.0227 20 26.0227C17.3954 26.0227 15.1909 24.2636 14.4045 21.9H11.0636V24.4909C12.7091 27.7591 16.0909 30 20 30Z"
          fill="#34A853"
        />
        <path
          d="M14.4045 21.9C14.2045 21.3 14.0909 20.6591 14.0909 20C14.0909 19.3409 14.2045 18.7 14.4045 18.1V15.5091H11.0636C10.3864 16.8591 10 18.3864 10 20C10 21.6136 10.3864 23.1409 11.0636 24.4909L14.4045 21.9Z"
          fill="#FBBC04"
        />
        <path
          d="M20 13.9773C21.4681 13.9773 22.7863 14.4818 23.8227 15.4727L26.6909 12.6045C24.9591 10.9909 22.6954 10 20 10C16.0909 10 12.7091 12.2409 11.0636 15.5091L14.4045 18.1C15.1909 15.7364 17.3954 13.9773 20 13.9773Z"
          fill="#E94235"
        />
      </g>
      <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#747775" />
      <defs>
        <clipPath id="clip0_710_6217">
          <rect
            width="20"
            height="20"
            fill="white"
            transform="translate(10 10)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};