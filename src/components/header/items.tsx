"use client";
import { Menu } from "@base-ui/react/menu";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/providers/user-store-provider";
import { MenuLink } from "@/components/header/links";

export const MenuLinks = () => {
  const activePage = usePathname();
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const publicLinks = [
    { href: "/", title: "Ingredients" },
    { href: "/about", title: "About" },
  ];

  const privateLinks = [
    // { href: "/ingredients", title: "Ingredients" },
    { href: "/groceries", title: "Groceries" },
    { href: "/recipes", title: "Recipes" },
  ];

  return (
    <Menu.Group>
      {publicLinks.map(({ href, title }, index) => {
        if (activePage == href) return;
        return (
          <div key={`${title}_${index}`}>
            <MenuLink href={href} title={title} />
          </div>
        );
      })}

      {privateLinks.map(({ href, title }, index) => {
        if (activePage == href || !userInfo) return;
        return (
          <div key={`${title}_${index}`}>
            <MenuLink key={`${title}_${index}`} href={href} title={title} />
          </div>
        );
      })}
    </Menu.Group>
  );
};