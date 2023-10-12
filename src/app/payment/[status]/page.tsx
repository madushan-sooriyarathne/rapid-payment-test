"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentConfirmationPage({
  params,
}: {
  params: { status: "success" | "failed" };
}) {
  const searchParams = useSearchParams();

  return (
    <div className="mx-auto my-auto grid h-[600px] w-[min(100%,1000px)] place-content-center rounded-lg bg-slate-50 p-12 shadow-lg shadow-black/10">
      {params.status === "success" ? (
        <div className="flex flex-col items-center justify-center gap-y-9">
          <h1 className="text-center text-5xl font-bold tracking-tight text-slate-700">
            Transation successful!
          </h1>
          <p className="text-center text-lg text-black">{`Order Id: ${searchParams.get(
            "order_id"
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
