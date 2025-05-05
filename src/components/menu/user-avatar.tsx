"use client";

import { useUserStore } from "@/providers/user-store-provider";
import { Avatar } from "radix-ui";
import { AvatarIcon } from "@radix-ui/react-icons";

export const UserAvatar = () => {
  const { userInfo } = useUserStore((state) => state);

  const imageUrl = userInfo?.image;
  const [firstName, lastName] = userInfo?.name?.split(" ") ?? [];

  if (!userInfo) return <AvatarIcon className={"size-1/2 rounded-full"} />;

  return imageUrl ? (
    <Avatar.Image
      src={imageUrl}
      alt={"User avatar"}
      className={"rounded-full"}
    />
  ) : (
    <>
      {firstName[0]} {lastName[0]}
    </>
  );
};