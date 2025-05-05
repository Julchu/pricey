"use client";
import { useCallback } from "react";
import { DropdownMenu } from "radix-ui";
import { LiquidType, MassType, Unit } from "@/utils/interfaces";
import { MenuLinks, MenuRadioItem } from "@/components/menu/items";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/providers/user-store-provider";

export const UserMenu = () => {
  const {
    mass,
    setMass,
    liquidVolume,
    setLiquidVolume,
    userInfo,
    login,
    logout,
  } = useUserStore((state) => state);

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

  const loginHandler = async () => {
    if (userInfo) logout();
    else
      login({
        email: "julianchutor@gmail.com",
      });
  };

  const activePage = usePathname();

  return (
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
          <DropdownMenu.RadioGroup value={mass} onValueChange={toggleMass}>
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
              "text-md relative flex h-[25px] cursor-pointer items-center rounded-md p-4 pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
            }
            onClick={loginHandler}
          >
            {userInfo ? "Logout" : "Login"}
          </DropdownMenu.Item>
        </section>

        <DropdownMenu.Arrow className="fill-white" />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};