import { paymentRouter } from "@server/api/routers/payment";
import { createTRPCRouter } from "@server/api/trpc";

export const appRouter = createTRPCRouter({
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
