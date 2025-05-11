"use client";

import { useUserStore } from "@/providers/user-store-provider";
import { Avatar } from "radix-ui";
// import { AvatarIcon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";

// TODO: check faster load from prop vs store render
export const UserAvatar = () => {
  const { userInfo } = useUserStore((state) => state);

  const imageUrl = userInfo?.image;

  if (!userInfo) return <PersonIcon className={"size-1/2 rounded-full"} />;

  return (
    <Avatar.Image
      src={imageUrl}
      alt={"User avatar"}
      className={"rounded-full"}
    />
  );
};