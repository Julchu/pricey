import { createStore } from "zustand/vanilla";
import { LiquidType, MassType, Unit } from "@/utils/interfaces";

export type UserState = {
  mass: MassType;
  liquidVolume: LiquidType;
  loggedIn: boolean;
};

export type UserActions = {
  setMass: (mass: MassType) => void;
  setLiquidVolume: (liquidType: LiquidType) => void;
  setLoggedIn: () => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return defaultInitState;
};

export const defaultInitState: UserState = {
  mass: Unit.KILOGRAM,
  liquidVolume: Unit.LITRE,
  loggedIn: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setMass: (massType) => set(() => ({ mass: massType })),
    setLiquidVolume: (liquidType) => set(() => ({ liquidVolume: liquidType })),
    setLoggedIn: () => set((state) => ({ loggedIn: !state.loggedIn })),
  }));
};