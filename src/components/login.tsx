"use client";

import { useEffect } from "react";

export const LoginLoader = () => {
  useEffect(() => {
    window.location.href = "/";
  }, []);
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
