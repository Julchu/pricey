"use client";

import { useRouteData } from "@/hooks/use-route-data";

export const RouteDataFallback = () => {
  useRouteData();
  return null;
};
