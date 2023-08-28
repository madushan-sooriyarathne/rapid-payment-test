import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";

import { appRouter } from "@server/api/root";

import { env } from "@env";

const handler = (request: Request) => {
  if (env.NODE_ENV === "development") {
    console.log(`Incoming Request: ${request.url}`);
  }
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      opts: FetchCreateContextFnOptions
    ): object | Promise<object> {
      return {};
    },
  });
};

export { handler as GET, handler as POST };
