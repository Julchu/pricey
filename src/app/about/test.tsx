"use client";

import { Auvik } from "@/components/test/auvik";

export const TestComponent = () => {
  const testHandler = async () => {
    const testFetch = await fetch("/api/ingredient");
    const data = await testFetch.json();
    console.log(data);
  };
  // return <button onClick={testHandler}>Test</button>;
  return <Auvik />;
};