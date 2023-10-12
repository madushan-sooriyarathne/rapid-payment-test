import { env } from "@env";
import NodeRSA from "node-rsa";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // capture incoming data
    const signatureData = formData.get("signature");
    const paymentResponseData = formData.get("payment");

    if (!signatureData || !paymentResponseData) {
      const siteUrl = new URL("/payment/failed", env.NEXT_PUBLIC_SITE_URL);
      siteUrl.searchParams.set("reason", "invalid response");
      redirect(siteUrl.href);
    }

    // base64 decode them and convert to a Buffer
    const payment = Buffer.from(
      paymentResponseData.toString(),
      "base64"
    ).toString("utf-8");
    const signature = signatureData.toString();

    // decode & parse the public key (which is base64 encoded and stored as an env variable)
    const publicKey = Buffer.from(env.PAYMENT_GATEWAY_PUBLIC_KEY, "base64")
      .toString("utf-8")
      .replaceAll(/(\r\n|\n|\r)/gm, "");

    console.log({
      signature,
      payment,
      publicKey,
    });

    // initialize the public key
    const publickey = new NodeRSA(publicKey, "pkcs8-public");

    // is data verified
    const verified = publickey.verify(
      Buffer.from(payment.toString(), "utf-8"),
      signature.toString(),
      "utf8",
      "base64"
    );
    console.log({ verified });

    if (verified) {
      // redirect to success page with the order number
      // decode the payment Response
      const paymentData = payment.split("|") as [
        string,
        string,
        string,
        string,
        string,
        string
      ];

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
