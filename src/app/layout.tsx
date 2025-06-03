import type { Metadata } from "next";
import { geistMono, montserrat } from "@/components/fonts";
import "./globals.css";
import { Header } from "@/components/header";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { ReactScan } from "@/components/react-scan";
import { cookies } from "next/headers";
import { UserFormData } from "@/utils/interfaces";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Pricey App",
  description: "Don't get ripped off by your groceries",
};

export default async function Layout({ children }: { children: ReactNode }) {
  // const queryClient = new QueryClient();
  //
  // // Preload the user data
  // await queryClient.prefetchQuery({
  //   queryKey: userQueryKey,
  //   queryFn: userQueryFn,
  // });
  // const dehydratedState = dehydrate(queryClient);
  let userInfo: UserFormData | null | undefined = undefined;

  const browserCookies = await cookies();
  const token = browserCookies.get("pricey_access_token")?.value;

  try {
    const userResponse = await fetch(`${process.env.PRICEY_BACKEND_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { success, data, error } = await userResponse.json();
    if (success) userInfo = data;
  } catch (error) {
    console.log(error);
  }

  return (
    <html lang={"en"}>
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased`}
      >
        <ReactScan />
        <main
          className={
            "container mx-auto flex h-dvh w-screen flex-col gap-4 bg-gray-50 p-4"
          }
        >
          <UserStoreProvider userInfo={userInfo} />
          {/*<ReactQueryProvider dehydratedState={dehydratedState}>*/}

          <Header />
          {children}
          {/*</ReactQueryProvider>*/}
        </main>
      </body>
    </html>
  );
}