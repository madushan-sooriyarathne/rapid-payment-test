import { z } from "zod";
import crypto from "crypto";
import { env } from "@env";
import { createTRPCRouter, publicProcedure } from "@server/api/trpc";

export const paymentRouter = createTRPCRouter({
  genereatePaymentParams: publicProcedure
    .input(
      z.object({
        orderId: z
          .string({ required_error: "field 'orderId' is required" })
          .min(1, {
            message: "lenght of orderId must be more than 1 character",
          }),
        orderAmount: z.number({
          required_error: "field 'orderAmount is required'",
        }),
      })
    )
    .output(
      z.object({
        status: z.enum(["success", "failed"]),
        message: z.string(),
        data: z.object({ params: z.string().min(1) }).nullable(),
      })
    )
    .mutation(({ input }) => {
      const publicKey = Buffer.from(env.PAYMENT_GATEWAY_PUBLIC_KEY, "base64")
        .toString("utf-8")
        .split(String.raw`\n`)
        .join("\n");

      const paymentString = Buffer.from(
        `${input.orderId}|${input.orderAmount}`,
        "utf-8"
      );

      try {
        const publicEncrypted = crypto
          .publicEncrypt(
            {
              key: publicKey,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            paymentString
          )
          .toString("base64");

        return {
          status: "success",
          data: {
            params: publicEncrypted,
          },
          message: "payment paramentrs generated",
        };
      } catch (error) {
        console.error(error);
        return {
          status: "failed",
          data: null,
          message: "Could not generate the payment paramentrs",
        };
      }
    }),
});
