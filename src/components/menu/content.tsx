"use client";
import { FC, useCallback, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { MassType, Unit, VolumeType } from "@/utils/interfaces";
import { MenuLinks, MenuRadioItem } from "@/components/menu/items";
import { usePathname } from "next/navigation";

export const HamburgerContent: FC = () => {
  const [mass, setMass] = useState<MassType>(Unit.KILOGRAM);
  const [liquidVolume, setLiquidVolume] = useState<VolumeType>(Unit.LITRE);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const toggleMass = useCallback((massType: string) => {
    setMass(massType as MassType);
  }, []);

  const toggleLiquidVolume = useCallback((liquidType: string) => {
    setLiquidVolume(liquidType as VolumeType);
  }, []);

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
            className={
              "animate-fadein pl-4 text-xs leading-[25px] font-medium opacity-50"
            }
          >
            Unit toggles
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={mass} onValueChange={toggleMass}>
            <MenuRadioItem value={Unit.KILOGRAM} name={"Kilograms (kg)"} />
            <MenuRadioItem value={Unit.POUND} name={"Pounds (lb)"} />
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Separator
            className={
              "animate-waggle relative m-[5px] flex h-px bg-black opacity-20"
            }
          />

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
              "relative flex h-[25px] cursor-pointer items-center rounded-[3px] p-4 pr-[5px] pl-[25px] text-sm leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
            }
            onClick={() => setLoggedIn((current) => !current)}
          >
            {loggedIn ? "Login" : "Logout"}
          </DropdownMenu.Item>
        </section>

        <DropdownMenu.Arrow className="fill-white" />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
};