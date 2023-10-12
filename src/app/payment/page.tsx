"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams();

  return (
    <div className="mx-auto my-auto grid h-[600px] w-[min(100%,1000px)] place-content-center rounded-lg bg-slate-50 p-12 shadow-lg shadow-black/10">
      {searchParams.get("status") === "success" &&
      searchParams.get("status_code") === "0" ? (
        <div className="flex flex-col items-center justify-center gap-y-9">
          <h1 className="text-center text-5xl font-bold tracking-tight text-slate-700">
            Transation successful!
          </h1>
          <p className="text-center text-lg text-black">{`Order Id: ${searchParams.get(
            "order_id"
          )}`}</p>
          <p className="text-center text-lg text-black">{`Order Ref: ${searchParams.get(
            "order_ref"
          )}`}</p>

          <p className="text-center text-lg text-black">{`Transction Timestamp: ${searchParams.get(
            "transction_time"
          )}`}</p>

          <p className="text-center text-lg text-black">{`Amount: LKR ${searchParams.get(
            "amount"
          )}`}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-9">
          <h1 className="text-center text-5xl font-bold tracking-tight text-red-700">
            Transation unsuccessful!
          </h1>
          <p className="text-center text-lg text-black">{`Reason: ${searchParams.get(
            "reason"
          )}`}</p>
        </div>
      )}
    </div>
  );
}
