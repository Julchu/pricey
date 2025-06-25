"use client";

import { Avatar } from "radix-ui";
import { useUserStore } from "@/stores/user-store";
import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";

export const UserAvatar = () => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);

  const imageUrl = userInfo?.image;

  if (!userInfo?.image) return <PersonIcon className={"size-1/2 rounded-md"} />;

  return (
    <>
      <Avatar.Image
        src={imageUrl}
        alt={"User avatar"}
        className={"rounded-md border-1 border-blue-500"}
      />
      <HamburgerMenuIcon
        className={"absolute h-1/2 w-1/2 text-blue-500 mix-blend-color-dodge"}
      />
    </>
  );
};