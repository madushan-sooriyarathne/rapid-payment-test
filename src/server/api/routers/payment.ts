import { z } from "zod";
import crypto from "crypto";
import { env } from "@env";
import { createTRPCRouter, publicProcedure } from "@server/api/trpc";

export const paymentRouter = createTRPCRouter({
  /**
   * Generate Payment Parameters
   * This trpc route handler generates public key encrypted payment parameter for a given orderId and Amount.
   * This function takes two input parameters, orderId and orderAmount, and generates payment parameters
   * by encrypting them with a public key. It returns an object with the status of the operation
   * (success or failed), a message, and the encrypted payment parameters as data.
   *
   * @param {Object} input - Input parameters for generating payment parameters.
   * @param {string} input.orderId - The ID of the order (must be more than 1 character).
   * @param {number} input.orderAmount - The order amount.
   *
   * @returns {Object} - An object containing payment parameters.
   * @returns {string} Object.status - The status of the payment (success or failed).
   * @returns {string} Object.message - A message regarding the payment.
   * @returns {Object|null} Object.data - Additional data, including payment parameters.
   * @returns {string|null} Object.data.params - The payment parameters as a string (nullable).
   */
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
