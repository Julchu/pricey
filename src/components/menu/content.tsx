"use client";
import { useCallback, useEffect, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { LiquidType, MassType, Unit } from "@/utils/interfaces";
import { MenuLinks, MenuRadioItem } from "@/components/menu/items";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import Script from "next/script";

export const UserMenu = () => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (node && google.accounts.id.renderButton) {
      google.accounts.id.renderButton(
        node,
        { type: "icon", theme: "outline", size: "small" }, // customization attributes
      );
      // also display the One Tap dialog
      google.accounts.id.prompt();
    }
  }, [node]);

  const [
    mass,
    setMass,
    liquidVolume,
    setLiquidVolume,
    userInfo,
    loginGoogle,
    logout,
  ] = useUserStore(
    useShallow(
      ({
        mass,
        setMass,
        liquidVolume,
        setLiquidVolume,
        userInfo,
        loginGoogle,
        logout,
      }) => [
        mass,
        setMass,
        liquidVolume,
        setLiquidVolume,
        userInfo,
        loginGoogle,
        logout,
      ],
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
      <Script
        strategy="afterInteractive"
        src="https://accounts.google.com/gsi/client"
        onLoad={() => {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: loginGoogle,
          });
        }}
      />
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
            {userInfo ? (
              <DropdownMenu.Item
                className={
                  "text-md relative flex h-[25px] cursor-pointer items-center rounded-md p-4 pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                }
                onClick={logout}
              >
                Logout
              </DropdownMenu.Item>
            ) : null}

            {!userInfo ? (
              <DropdownMenu.Item
                className={
                  "text-md relative flex h-[25px] cursor-pointer items-center rounded-md p-4 leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
                }
              >
                <div ref={setNode} className={"m-0 p-0"} />
                <div>Login with Google</div>
              </DropdownMenu.Item>
            ) : null}
          </section>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </>
  );
};