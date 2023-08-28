import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    PAYMENT_GATEWAY_PUBLIC_KEY: z.string().min(1),
    PAYMENT_GATEWAY_MERCHENT_ID: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_PAYMENT_GATEWAY_SECRET: z.string().min(1),
    NEXT_PUBLIC_PAYMENT_GATEWAY_URL: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PAYMENT_GATEWAY_PUBLIC_KEY: process.env.PAYMENT_GATEWAY_PUBLIC_KEY,
    PAYMENT_GATEWAY_MERCHENT_ID: process.env.PAYMENT_GATEWAY_MERCHENT_ID,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_PAYMENT_GATEWAY_SECRET:
      process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_SECRET,
    NEXT_PUBLIC_PAYMENT_GATEWAY_URL:
      process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
