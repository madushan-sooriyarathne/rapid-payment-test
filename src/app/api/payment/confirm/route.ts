import { env } from "@env";
import { createVerify } from "crypto";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const signature = formData.get("signature");
    const paymentResponse = formData.get("payment");

    if (!signature || !paymentResponse) {
      const siteUrl = new URL("/payment/failed", env.NEXT_PUBLIC_SITE_URL);
      siteUrl.searchParams.set("reason", "invalid response");
      redirect(siteUrl.href);
    }

    // decode & parse the public key (which is base64 encoded and stored as an env variable)
    const publicKey = Buffer.from(
      env.PAYMENT_GATEWAY_PUBLIC_KEY,
      "base64"
    ).toString("utf-8");

    const verifer = createVerify("RSA-SHA256");
    verifer.update(paymentResponse.toString());
    const verified = verifer.verify(publicKey, signature.toString());

    if (verified) {
      // redirect to success page with the order number
      // decode the payment Response
      const paymentData = Buffer.from(paymentResponse as string, "base64")
        .toString("utf-8")
        .split("|") as [string, string, string, string, string, string];

      if (paymentData[3] && paymentData[3] === "0") {
        // transaction approved
        const siteUrl = new URL("/payment/success", env.NEXT_PUBLIC_SITE_URL);
        siteUrl.searchParams.set("orderId", paymentData[0]);
        redirect(siteUrl.href);
      } else {
        // trnasation failed
        const siteUrl = new URL("/payment/failed", env.NEXT_PUBLIC_SITE_URL);
        siteUrl.searchParams.set("reason", paymentData[4]);
        redirect(siteUrl.href);
      }
    } else {
      // redirect to error page with error reason
      const siteUrl = new URL("/payment/failed", env.NEXT_PUBLIC_SITE_URL);
      siteUrl.searchParams.set("reason", "Could not vefiy the signature");
      redirect(siteUrl.href);
    }
  } catch (error: unknown) {
    console.log(error);

    const siteUrl = new URL("/payment/failed", env.NEXT_PUBLIC_SITE_URL);
    siteUrl.searchParams.set("reason", "invalid response");
    redirect(siteUrl.href);
  }
}
