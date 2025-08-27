"use client";

import { createContext, PropsWithChildren, useContext, useRef } from "react";

import {
  createUserStore,
  defaultInitState,
  initUserStore,
  UserStore,
  UserStoreApi,
} from "@/stores/user-store";
import { UserFormData } from "@/utils/interfaces";
import { useStore } from "zustand";

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export type UserStoreProviderProps = PropsWithChildren<{
  userInfo: UserFormData | null;
}>;

export const UserStoreProvider = ({
  children,
  userInfo,
}: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null);
  if (storeRef.current === null) {
    const initialState = userInfo ? initUserStore(userInfo) : defaultInitState;
    storeRef.current = createUserStore(initialState);
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
