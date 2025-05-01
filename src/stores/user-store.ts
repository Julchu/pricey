import { createStore } from "zustand/vanilla";
import { LiquidType, MassType, Unit, UserFormData } from "@/utils/interfaces";

export type UserState = {
  mass: MassType;
  liquidVolume: LiquidType;
  userInfo: UserFormData | undefined;
};

export type UserActions = {
  setMass: (mass: MassType) => void;
  setLiquidVolume: (liquidType: LiquidType) => void;
  login: (loginInfo: UserFormData) => void;
  logout: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return defaultInitState;
};

export const defaultInitState: UserState = {
  mass: Unit.KILOGRAM,
  liquidVolume: Unit.LITRE,
  userInfo: undefined,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setMass: (massType) => set(() => ({ mass: massType })),
    setLiquidVolume: (liquidType) => set(() => ({ liquidVolume: liquidType })),

    login: async (loginFormData) => {
      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(loginFormData),
      });
      set(() => ({ userInfo: loginFormData }));
    },

    logout: async () => {
      await fetch("/api/logout", {
        method: "POST",
      });
      set(() => ({ userInfo: undefined }));
    },
  }));
};