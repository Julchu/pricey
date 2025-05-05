import { Avatar, DropdownMenu } from "radix-ui";
import { UserMenu } from "@/components/menu/content";
import { UserAvatar } from "@/components/menu/user-avatar";
import { AvatarIcon } from "@radix-ui/react-icons";

export const Hamburger = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded-full bg-blue-500 font-bold text-white select-none">
          <UserAvatar />
          <Avatar.Fallback aria-label={"User menu"}>
            <Avatar.Image
              alt={"User avatar"}
              className={"rounded-full object-contain"}
            >
              <AvatarIcon className={"size-1/2 rounded-full"} />
            </Avatar.Image>
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <UserMenu />
    </DropdownMenu.Root>
  );
};