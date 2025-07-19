"use client";

import { Avatar } from "radix-ui";
import { HamburgerMenuIcon, PersonIcon } from "@radix-ui/react-icons";
import { useUserStore } from "@/providers/user-store-provider";

export const UserAvatar = () => {
  const userInfo = useUserStore(({ userInfo }) => userInfo);

  const imageUrl = userInfo?.image;

  if (!userInfo?.image)
    return <PersonIcon className={"size-1/2 rounded-full"} />;

  return (
    <>
      <Avatar.Image
        src={imageUrl}
        alt={"User avatar"}
        className={"rounded-full"}
      />
      <HamburgerMenuIcon
        className={"absolute h-1/2 w-1/2 text-blue-500 mix-blend-color-dodge"}
      />
    </>
  );
};