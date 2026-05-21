import { Menu } from "@base-ui/react/menu";
import { CaretRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/providers/user-store-provider";

export const MenuRadioItem = ({
  value,
  name,
}: {
  value: string;
  name: string;
}) => {
  return (
    <Menu.RadioItem
      className={
        "text-md relative flex h-[25px] items-center rounded-[3px] p-4 pr-[5px] pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
      }
      value={value}
      closeOnClick={false}
    >
      <Menu.RadioItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CaretRightIcon />
      </Menu.RadioItemIndicator>
      {name}
    </Menu.RadioItem>
  );
};

export const MenuLinks = () => {
  const activePage = usePathname();
  const userInfo = useUserStore(({ userInfo }) => userInfo);
  const publicLinks = [
    { href: "/", title: "Home" },
    { href: "/about", title: "About" },
  ];

  const privateLinks = [
    // { href: "/ingredients", title: "Ingredients" },
    { href: "/groceries", title: "Groceries" },
    { href: "/recipes", title: "Recipes" },
  ];

  return (
    <Menu.Group>
      <Menu.Separator className={"m-[5px] h-px bg-black opacity-20"} />
      <Menu.GroupLabel
        className={"pl-4 text-xs leading-[25px] font-medium opacity-50"}
      >
        Links
      </Menu.GroupLabel>
      {publicLinks.map(({ href, title }, index) => {
        if (activePage == href) return;
        return <MenuLink key={`${title}_${index}`} href={href} title={title} />;
      })}

      {privateLinks.map(({ href, title }, index) => {
        if (activePage == href || !userInfo) return;
        return <MenuLink key={`${title}_${index}`} href={href} title={title} />;
      })}
    </Menu.Group>
  );
};

export const MenuLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link href={href}>
      <Menu.Item
        className={
          "text-md relative flex h-[25px] items-center rounded-[3px] p-4 pr-[5px] pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
        }
      >
        {title}
      </Menu.Item>
    </Link>
  );
};