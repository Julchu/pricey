import { Menu } from "@base-ui/react/menu";
import { UserMenu } from "@/components/header/user-menu";
import { UserAvatar } from "@/components/header/user-avatar";
import { UserFormData } from "@/utils/interfaces";
import { PersonIcon } from "@radix-ui/react-icons";
import { PantryDrawer } from "@/components/pantry/pantry-drawer";

export const Hamburger = ({ userInfo }: { userInfo?: UserFormData }) => {
  const [firstName, lastName] = userInfo?.name?.split(" ") ?? [];
  return (
    <Menu.Root>
      <Menu.Trigger
        className="relative inline-flex aspect-square h-full cursor-pointer items-center justify-center rounded-full bg-blue-500 font-bold text-white select-none"
        aria-label="User menu"
      >
        <UserAvatar />
        {!userInfo?.image && (
          <>
            {firstName && lastName ? (
              <>
                {firstName[0]} {lastName[0]}
              </>
            ) : (
              <PersonIcon className={"size-1/2 rounded-full"} />
            )}
          </>
        )}
      </Menu.Trigger>

      <UserMenu />

      <PantryDrawer />
    </Menu.Root>
  );
};