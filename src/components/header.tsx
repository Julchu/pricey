import Link from "next/link";
import { Menu } from "@/components/menu/hamburger";

export const Header = () => {
  return (
    <header
      className={"flex h-[3rem] flex-row justify-between bg-gray-100 md:h-auto"}
    >
      <Link
        href={"/"}
        className={
          "flex cursor-pointer items-center rounded-md bg-blue-500 px-4 py-2 text-2xl font-bold tracking-widest text-white"
        }
      >
        Pricey
      </Link>
      <Menu firstName={"Pricey"} lastName={"App"} />
    </header>
  );
};