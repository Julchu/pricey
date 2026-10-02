import { LinksNavigationMenu } from "@/components/header/links-navigation-menu";
import { Hamburger } from "@/components/header/hamburger";

export const Header = () => {
  return (
    <header
      className={
        "flex h-12 flex-row items-center justify-between gap-3 drop-shadow-lg"
      }
    >
      <LinksNavigationMenu />
      <Hamburger />
    </header>
  );
};