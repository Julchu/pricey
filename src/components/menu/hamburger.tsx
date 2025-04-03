import { Avatar, DropdownMenu } from "radix-ui";
import { UserMenu } from "@/components/menu/content";

export const Menu = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded-full bg-blue-500 font-bold text-white select-none">
          <Avatar.Fallback aria-label={"User menu"}>
            {firstName[0]} {lastName[0]}
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <UserMenu />
    </DropdownMenu.Root>
  );
};