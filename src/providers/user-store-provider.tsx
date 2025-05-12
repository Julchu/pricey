"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/user-store";
import { UserFormData } from "@/utils/interfaces";

export const UserStoreProvider = ({
  userInfo,
}: {
  userInfo?: UserFormData;
}) => {
  const { setUser, setMass, setLiquidVolume } = useUserStore();

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