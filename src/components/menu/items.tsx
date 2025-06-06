import { DropdownMenu } from "radix-ui";
import { CaretRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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

export const MenuLinks = ({ activePage }: { activePage: string }) => {
  const links = [
    { href: "/", title: "Ingredients" },
    { href: "/groceries", title: "Groceries" },
    { href: "/recipes", title: "Recipes" },
    { href: "/about", title: "About" },
  ];
  return (
    <section>
      <DropdownMenu.Separator className={"m-[5px] h-px bg-black opacity-20"} />
      <DropdownMenu.Label
        className={"pl-4 text-xs leading-[25px] font-medium opacity-50"}
      >
        Links
      </DropdownMenu.Label>

      {links.map(({ href, title }, index) => {
        if (activePage != href)
          return (
            <MenuLink key={`${title}_${index}`} href={href} title={title} />
          );
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