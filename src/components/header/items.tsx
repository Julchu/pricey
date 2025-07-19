import { DropdownMenu } from "radix-ui";
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
    <DropdownMenu.RadioItem
      className={
        "text-md relative flex h-[25px] items-center rounded-[3px] p-4 pr-[5px] pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
      }
      value={value}
      onSelect={(event) => event.preventDefault()}
    >
      <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CaretRightIcon />
      </DropdownMenu.ItemIndicator>
      {name}
    </DropdownMenu.RadioItem>
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
    { href: "/ingredients", title: "Ingredients" },
    { href: "/groceries", title: "Groceries" },
    { href: "/recipes", title: "Recipes" },
  ];

  return (
    <section>
      <DropdownMenu.Separator className={"m-[5px] h-px bg-black opacity-20"} />
      <DropdownMenu.Label
        className={"pl-4 text-xs leading-[25px] font-medium opacity-50"}
      >
        Links
      </DropdownMenu.Label>

      {publicLinks.map(({ href, title }, index) => {
        if (activePage == href) return;
        return <MenuLink key={`${title}_${index}`} href={href} title={title} />;
      })}

      {privateLinks.map(({ href, title }, index) => {
        if (activePage == href || !userInfo) return;
        return <MenuLink key={`${title}_${index}`} href={href} title={title} />;
      })}
    </section>
  );
};

export const MenuLink = ({ href, title }: { href: string; title: string }) => {
  return (
    <Link href={href}>
      <DropdownMenu.Item
        className={
          "text-md relative flex h-[25px] items-center rounded-[3px] p-4 pr-[5px] pl-[25px] leading-none outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
        }
      >
        {title}
      </DropdownMenu.Item>
    </Link>
  );
};