import { createStore } from "zustand/vanilla";
import { LiquidType, MassType, Unit, UserFormData } from "@/utils/interfaces";

export type UserState = {
  mass: MassType;
  liquidVolume: LiquidType;
  userInfo?: UserFormData;
};

export type UserActions = {
  setMass: (mass: MassType) => void;
  setLiquidVolume: (liquidType: LiquidType) => void;
  login: (loginInfo: UserFormData) => void;
  logout: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (userInfo?: UserFormData): UserState => {
  return {
    userInfo,
    mass: userInfo?.preferences?.units?.mass,
    liquidVolume: userInfo?.preferences?.units?.volume,
  };
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
      try {
        const { userInfo } = await tryLogin(loginFormData);
        set(() => ({ userInfo }));
      } catch (error) {
        throw new Error("Unable to login", { cause: error });
      }
    },

    logout: async () => {
      try {
        const { userInfo } = await tryLogout();
        set(() => ({ userInfo }));
      } catch (error) {
        throw new Error("Unable to logout", { cause: error });
      }
    },
  }));
};

const tryLogin = async (loginFormData: UserFormData) => {
  try {
    const fetchUser = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(loginFormData),
    });
    return await fetchUser.json();
  } catch (error) {
    throw new Error("Unable to fetch login", { cause: error });
  }
};

const tryLogout = async () => {
  try {
    const fetchUser = await fetch("/api/logout", {
      method: "POST",
    });
    return await fetchUser.json();
  } catch (error) {
    throw new Error("Unable to fetch logout", { cause: error });
  }
};