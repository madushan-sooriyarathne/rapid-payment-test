"use client";

import React, { useState, type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { env } from "@env";

import { trpc } from "@utils/trpc";

export const TRPCProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5000 } },
      })
  );
  const getBaseURL = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (env.NEXT_PUBLIC_SITE_URL) return `https://${env.NEXT_PUBLIC_SITE_URL}`; // SSR should use vercel url
    return `http://localhost:300`; // dev SSR should use localhost
  };
  const url = `${getBaseURL()}/api/trpc`;

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
