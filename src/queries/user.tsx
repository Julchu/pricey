export const userQueryKey = ["user"];

export const userQueryClientFn = async () => {
  const res = await fetch("/api/login", {
    method: "POST",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};

export const userQueryServerFn = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRICEY_BASE_URL}/api/login`,
    {
      method: "POST",
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
};