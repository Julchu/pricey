"use client";

import { Avatar } from "radix-ui";
import { useUserStore } from "@/stores/user-store";
import { PersonIcon } from "@radix-ui/react-icons";
// import { AvatarIcon } from "@radix-ui/react-icons";

// TODO: check faster load from prop vs store render
export const UserAvatar = () => {
  const { userInfo } = useUserStore();

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