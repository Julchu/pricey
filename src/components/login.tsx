"use client";
import { useEffect, useTransition } from "react";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

export const LoginLoader = () => {
  const [isLoading, startTransition] = useTransition();
  const [userInfo, setUser] = useUserStore(
    useShallow(({ userInfo, setUser }) => [userInfo, setUser]),
  );

  const router = useRouter();
  useEffect(() => {
    startTransition(async () => {
      if (!userInfo) {
        try {
          const res = await fetch("/api/login", { method: "POST" });
          const { userInfo } = await res.json();
          setUser(userInfo);
        } catch (error) {
          console.error(error);
        }
      }
      router.replace("/");
    });
  }, [setUser, router, userInfo]);

  if (isLoading) return <div className={"animate-pulse"} />;
  return null;
};

/*// components/User.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { userQueryFn, userQueryKey } from "@/lib/queries/user";

export function UserInfo() {
  const { data, isLoading } = useQuery({
    queryKey: userQueryKey,
    queryFn: userQueryFn,
  });

  if (isLoading) return <p>Loading...</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}*/