"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/user-store";
import { UserFormData } from "@/utils/interfaces";
import { useShallow } from "zustand/react/shallow";

export const UserStoreProvider = ({
  userInfo,
}: {
  userInfo?: UserFormData | null;
}) => {
  const [setUser, setMass, setLiquidVolume] = useUserStore(
    useShallow(({ setUser, setMass, setLiquidVolume }) => [
      setUser,
      setMass,
      setLiquidVolume,
    ]),
  );

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
      if (userInfo.preferences?.units) {
        setMass(userInfo.preferences?.units?.mass);
        setLiquidVolume(userInfo.preferences?.units?.volume);
      }
    }
  }, [setLiquidVolume, setMass, setUser, userInfo]);

  return null;
};