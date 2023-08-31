"use client";

import { env } from "@env";
import { nanoid } from "nanoid";
import { trpc } from "@utils/trpc";

export default function Homepage() {
  const paymentParamsGeneratorMutation =
    trpc.payment.genereatePaymentParams.useMutation();

  const handleSubmit = () => {
    paymentParamsGeneratorMutation
      .mutateAsync({
        orderId: nanoid(5),
        orderAmount: 10,
      })
      .then((res) => {
        if (res.data) {
          const userData = {
            first_name: "John",
            last_name: "Doe",
            email: "john@doe.com",
            contact_number: "0711236789",
            address_line_one: "No 18, Templers Road",
            address_line_two: "Mount Lavinia",
            city: "Colombo",
            state: "Western",
            country: "Sri Lanka",
            process_currency: "LKR",
          };

          const miscData = {
            secret_key: env.NEXT_PUBLIC_PAYMENT_GATEWAY_SECRET,
            cms: "NODE",
            payment: res.data.params,
            enc_method: "JCs3J+6oSz4V0LgE0zi/Bg==",
          };

          // create the form element
          const form = document.createElement("form");
          form.method = "POST";
          form.action = env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
          form.style.display = "none";
          form.style.visibility = "hidden";

          // add user data to form
          for (const [key, value] of Object.entries(userData)) {
            const inputField = document.createElement("input");
            inputField.value = value;
            inputField.type = "text";
            inputField.name = key;

            form.appendChild(inputField);
          }

          // attach misc and hidden fields
          for (const [key, value] of Object.entries(miscData)) {
            const inputField = document.createElement("input");
            inputField.value = value;
            inputField.type = "text";
            inputField.hidden = true;
            inputField.name = key;

            form.appendChild(inputField);
          }

          // append the form to document body and submit
          document.body.appendChild(form);
          form.submit();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="mx-auto my-auto grid h-[600px] w-[min(100%,1000px)] place-content-center rounded-lg bg-slate-50 p-12 shadow-lg shadow-black/10">
      <div className="flex flex-col items-center justify-center gap-y-9">
        <h1 className="text-center text-5xl font-bold tracking-tight text-orange-400">
          Rapid Adventures x WebXPay integration
        </h1>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg border-slate-800 bg-slate-800 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
