import { Hamburger } from "@/components/header/hamburger";
import { Menu } from "@base-ui/react/menu";
import { MenuLinks } from "@/components/header/items";

export const Header = () => {
  return (
    <header
      className={
        "flex h-12 flex-row items-center justify-between drop-shadow-lg"
      }
    >
      <Links />
      <Hamburger />
    </header>
  );
};

const Links = () => {
  return (
    <Menu.Root>
      <Menu.Trigger
        className="relative inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded-full bg-blue-500 font-bold text-white select-none"
        aria-label="User menu"
      >
        <div
          className={
            "flex cursor-pointer items-center rounded-md bg-blue-500 px-4 py-2 text-2xl font-bold tracking-widest text-white"
          }
        >
          Pricey
        </div>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={10} align="start">
          <Menu.Popup
            className={
              "data-[side=bottom]:animate-slide-down-and-fade data-[side=left]:animate-slide-left-and-fade data-[side=right]:animate-slide-up-and-fade data-[side=top]:animate-slide-right-and-fade z-2 rounded-md bg-white p-1 tracking-widest shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] select-none"
            }
          >
            <MenuLinks />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};