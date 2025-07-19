import { UserStoreProvider } from "./user-store-provider";
import { PropsWithChildren } from "react";
import { serverFetch } from "@/utils/server-actions/server-fetch";
import { UserFormData } from "@/utils/interfaces";

export const Providers = async ({ children }: PropsWithChildren) => {
  const userInfo = await serverFetch<UserFormData>({ endpoint: "user" });
  return <UserStoreProvider userInfo={userInfo}>{children}</UserStoreProvider>;
};