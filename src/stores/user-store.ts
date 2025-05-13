import { create } from "zustand";
import { LiquidType, MassType, Unit, UserFormData } from "@/utils/interfaces";

export type UserState = {
  mass: MassType;
  liquidVolume: LiquidType;
  userInfo?: UserFormData;
};

export type UserActions = {
  setUser: (userInfo: UserFormData) => void;
  setMass: (mass: MassType) => void;
  setLiquidVolume: (liquidType: LiquidType) => void;
  login: (loginInfo: UserFormData) => void;
  logout: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (userInfo?: UserFormData): UserState => {
  const userMass = userInfo?.preferences?.units?.mass;
  const userVolume = userInfo?.preferences?.units?.volume;

  return {
    mass: userMass ? userMass : Unit.KILOGRAM,
    liquidVolume: userVolume ? userVolume : Unit.LITRE,
  };
};

export const defaultInitState: UserState = {
  mass: Unit.KILOGRAM,
  liquidVolume: Unit.LITRE,
  userInfo: undefined,
};

export const useUserStore = create<UserStore>((set) => ({
  ...defaultInitState,
  setUser: (userInfo) => set(() => ({ userInfo })),
  setMass: (massType) => set(() => ({ mass: massType })),
  setLiquidVolume: (liquidType) => set(() => ({ liquidVolume: liquidType })),

  login: async (loginFormData) => {
    try {
      const { userInfo } = await tryLogin(loginFormData);
      const { mass, liquidVolume } = initUserStore(userInfo);
      set(() => ({ userInfo, mass, liquidVolume }));
    } catch (error) {
      throw new Error("Unable to login", { cause: error });
    }
  },

  logout: async () => {
    try {
      const { userInfo } = await tryLogout();
      const { mass, liquidVolume } = initUserStore(userInfo);
      set(() => ({ userInfo, mass, liquidVolume }));
    } catch (error) {
      throw new Error("Unable to logout", { cause: error });
    }
  },
}));

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