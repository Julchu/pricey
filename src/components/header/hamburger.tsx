import { Avatar, DropdownMenu } from "radix-ui";
import { UserMenu } from "@/components/header/user-menu";
import { UserAvatar } from "@/components/header/user-avatar";
import { UserFormData } from "@/utils/interfaces";
import { PersonIcon } from "@radix-ui/react-icons";

export const Hamburger = ({ userInfo }: { userInfo?: UserFormData }) => {
  const [firstName, lastName] = userInfo?.name?.split(" ") ?? [];
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="relative inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded-full bg-blue-500 font-bold text-white select-none">
          <UserAvatar />
          <Avatar.Fallback aria-label={"User menu"}>
            {firstName && lastName ? (
              <>
                {firstName[0]} {lastName[0]}
              </>
            ) : (
              <Avatar.Image
                alt={"User avatar"}
                className={"rounded-full object-contain"}
              >
                <PersonIcon className={"size-1/2 rounded-full"} />
              </Avatar.Image>
            )}
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <UserMenu />
    </DropdownMenu.Root>
  );
};