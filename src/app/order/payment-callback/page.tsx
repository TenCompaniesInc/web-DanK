"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

type Status = "checking" | "paid" | "failed" | "pending" | "error";

function PaymentCallbackInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("checking");
  const [orderDetails, setOrderDetails] = useState<{ total?: number; id?: string } | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const orderTrackingId = searchParams.get("OrderTrackingId");
    const merchantReference = searchParams.get("OrderMerchantReference");

    if (!orderTrackingId) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/payment/verify?orderTrackingId=${orderTrackingId}&merchantReference=${merchantReference}`
        );
        const data = await res.json();

        if (data.success) {
          if (data.paymentStatus === "paid") {
            setStatus("paid");
            setOrderDetails({ total: data.total, id: data.orderId });
          } else if (data.paymentStatus === "failed" || data.paymentStatus === "reversed") {
            setStatus("failed");
            setMessage(data.description || "Payment was not successful.");
          } else {
            setStatus("pending");
          }
        } else {
          setStatus("error");
          setMessage(data.error || "Could not verify payment.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Network error while verifying payment.");
      }
    };

    checkStatus();
  }, [searchParams]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.7)] p-10 text-center">
      <Link href="/" className="flex items-center justify-center gap-3 mb-8">
        <Image src="/emblem.png" alt="DAN K" width={44} height={44} className="object-contain" />
        <div className="text-left leading-tight">
          <p className="text-xl font-bold tracking-tight text-[#1a3d2b]">DAN K</p>
          <p className="text-[10px] font-bold tracking-[2.5px] uppercase text-[#c8961e]">Origin of Quality</p>
        </div>
      </Link>

      {status === "checking" && (
        <>
          <div className="w-12 h-12 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <h1 className="text-xl font-bold text-[#141414] mb-2">Confirming your payment...</h1>
          <p className="text-sm text-zinc-400">Please don&apos;t close this page. This usually takes a few seconds.</p>
        </>
      )}

      {status === "paid" && (
        <>
          <CheckCircle size={56} className="text-[#1a3d2b] mx-auto mb-5" />
          <h1 className="text-xl font-bold text-[#1a3d2b] mb-2">Payment Successful!</h1>
          <p className="text-sm text-zinc-400 mb-6">
            Thank you. Your order has been confirmed{orderDetails?.total ? ` for UGX ${orderDetails.total.toLocaleString()}` : ""}.
          </p>
          {orderDetails?.id && (
            <p className="text-xs text-zinc-300 mb-6">
              Order ID: <span className="font-mono text-zinc-400">{orderDetails.id.slice(-8).toUpperCase()}</span>
            </p>
          )}
          <Link href="/" className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
            Back to Home
          </Link>
        </>
      )}

      {status === "pending" && (
        <>
          <Clock size={56} className="text-[#e67e22] mx-auto mb-5" />
          <h1 className="text-xl font-bold text-[#e67e22] mb-2">Payment Pending</h1>
          <p className="text-sm text-zinc-400 mb-6">
            We haven&apos;t received confirmation yet. If you completed the payment on your phone, this can take a minute to reflect.
          </p>
          <Link href="/" className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
            Back to Home
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <XCircle size={56} className="text-red-500 mx-auto mb-5" />
          <h1 className="text-xl font-bold text-red-500 mb-2">Payment Failed</h1>
          <p className="text-sm text-zinc-400 mb-6">{message || "The payment was not completed."}</p>
          <Link href="/order" className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
            Try Again
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle size={56} className="text-red-500 mx-auto mb-5" />
          <h1 className="text-xl font-bold text-red-500 mb-2">Something Went Wrong</h1>
          <p className="text-sm text-zinc-400 mb-6">{message}</p>
          <a href="https://wa.me/256731496117" target="_blank" rel="noreferrer" className="inline-block bg-[#1a3d2b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition">
            Contact Support on WhatsApp
          </a>
        </>
      )}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f6] flex items-center justify-center px-6">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[rgba(200,230,210,0.7)] p-10 text-center">
            <div className="w-12 h-12 border-4 border-[#1a3d2b] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <PaymentCallbackInner />
      </Suspense>
    </main>
  );
}