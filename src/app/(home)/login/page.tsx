"use client";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const setUser = useUserStore(({ setUser }) => setUser);
  const router = useRouter();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/login", { method: "POST" });
        const { userInfo } = await res.json();
        setUser(userInfo);
      } catch (error) {
        console.error(error);
      }
      router.replace("/");
    });
  }, [setUser, router]);

  return null;
}