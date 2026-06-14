"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { FaTruckFast, FaRegCreditCard } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface FormProps {
  paymentMethod: string;
  totalPrice: number;
}

const PlaceOrderForm = ({ paymentMethod, totalPrice }: FormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loadingIntent, setLoadingIntent] = useState(
    paymentMethod === "Stripe",
  );

  useEffect(() => {
    if (paymentMethod !== "Stripe") return;

    let isMounted = true;

    fetch("/api/webhooks/stripe-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setLoadingIntent(false);
        }
      })
      .catch((err) => {
        console.error("Stripe Intent Error:", err);
        if (isMounted) setLoadingIntent(false);
      });

    return () => {
      isMounted = false;
    };
  }, [paymentMethod, totalPrice]);

  if (paymentMethod === "COD") {
    return (
      <div className="space-y-4">
        <div className="p-5 border border-white/5 bg-black rounded-none flex items-center gap-4">
          <FaTruckFast className="w-5 h-5 text-[#c5a059]" />
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider block">
              ΑΝΤΙΚΑΤΑΒΟΛΗ
            </h4>
            <p className="text-zinc-500 text-xs">
              Η πληρωμή θα γίνει με μετρητά κατά την παράδοση.
            </p>
          </div>
        </div>
        <CODForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-5 border border-[#c5a059]/10 bg-[#c5a059]/5 rounded-none flex items-center gap-4">
        <FaRegCreditCard className="w-5 h-5 text-[#c5a059]" />
        <div>
          <h4 className="text-zinc-200 font-bold text-sm uppercase tracking-wider block">
            ΗΛΕΚΤΡΟΝΙΚΗ ΠΛΗΡΩΜΗ
          </h4>
          <p className="text-zinc-400 text-xs">
            Υποστηρίζει Apple Pay, Google Pay, Revolut Pay και Κάρτες.
          </p>
        </div>
      </div>

      {loadingIntent ? (
        <div className="flex items-center justify-center py-12 gap-3 text-zinc-500 text-xs uppercase tracking-widest font-medium">
          <AiOutlineLoading3Quarters className="animate-spin text-[#c5a059] w-4 h-4" />
          <span>Φόρτωση ασφαλούς περιβάλλοντος...</span>
        </div>
      ) : (
        clientSecret &&
        paymentIntentId && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "night",
                variables: { colorPrimary: "#c5a059", borderRadius: "0px" },
              },
            }}
          >
            <StripeForm
              paymentMethod={paymentMethod}
              paymentIntentId={paymentIntentId}
            />
          </Elements>
        )
      )}
    </div>
  );
};

function CODForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const orderRes = await createOrder("COD");
      if (orderRes.success && orderRes.redirectTo) {
        router.push(orderRes.redirectTo);
      } else {
        setError(orderRes.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-500/10 border-red-500/20 text-red-500 rounded-none p-4"
        >
          <AlertDescription className="text-xs font-mono leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#c5a059] text-black font-black text-[10px] tracking-[0.25em] hover:bg-white hover:text-black h-14 rounded-none transition-all uppercase shadow-none"
      >
        {isPending ? "ΕΠΕΞΕΡΓΑΣΙΑ..." : "ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ"}
      </Button>
    </form>
  );
}

function StripeForm({
  paymentMethod,
  paymentIntentId,
}: {
  paymentMethod: string;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    startTransition(async () => {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Σφάλμα στα στοιχεία κάρτας.");
        return;
      }

      const orderRes = await createOrder(paymentMethod);

      if (!orderRes.success || !orderRes.redirectTo) {
        setError(orderRes.message);
        return;
      }

      const orderId = orderRes.redirectTo.split("/").pop();

      await fetch("/api/webhooks/stripe-update-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, orderId }),
      });

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          clientSecret: paymentIntentId,
          confirmParams: {
            return_url: `${window.location.origin}${orderRes.redirectTo}?payment_success=true`,
          },
          redirect: "if_required",
        },
      );

      if (stripeError) {
        setError(stripeError.message || "Η πληρωμή απέτυχε.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        router.push(`${orderRes.redirectTo}?payment_success=true`);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-zinc-900/10 p-4 border border-white/5 rounded-none animate-in fade-in-50 duration-300"
    >
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-500/10 border-red-500/20 text-red-500 rounded-none p-4"
        >
          <AlertDescription className="text-xs font-mono leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <PaymentElement options={{ layout: "tabs" }} />

      <Button
        type="submit"
        disabled={isPending || !stripe || !elements}
        className="w-full bg-[#c5a059] text-black font-black text-[10px] tracking-[0.25em] hover:bg-white hover:text-black h-14 rounded-none transition-all uppercase mt-4 shadow-none"
      >
        {isPending ? "ΕΠΕΞΕΡΓΑΣΙΑ ΠΛΗΡΩΜΗΣ..." : "ΠΛΗΡΩΜΗ & ΟΛΟΚΛΗΡΩΣΗ"}
      </Button>
    </form>
  );
}

export default PlaceOrderForm;
