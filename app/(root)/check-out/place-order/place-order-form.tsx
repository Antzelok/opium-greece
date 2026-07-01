"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createOrder, updateOrderToPaid } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { FaTruckFast, FaRegCreditCard } from "react-icons/fa6";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
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
  stripeClientSecret: string | null;
  stripePaymentIntentId: string | null;
}

const PlaceOrderForm = ({
  paymentMethod,
  stripeClientSecret,
  stripePaymentIntentId,
}: FormProps) => {
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
          <h4 className="text-zinc-200 font-bold text-sm block">
            ΗΛΕΚΤΡΟΝΙΚΗ ΠΛΗΡΩΜΗ
          </h4>
          <p className="text-zinc-400 text-xs">
            Υποστηρίζει Apple Pay, Google Pay, Revolut Pay και Κάρτες.
          </p>
        </div>
      </div>

      {stripeClientSecret && stripePaymentIntentId ? (
        <Elements
          key={stripeClientSecret}
          stripe={stripePromise}
          options={{
            clientSecret: stripeClientSecret,
            appearance: {
              theme: "night",
              variables: { colorPrimary: "#c5a059", borderRadius: "0px" },
            },
          }}
        >
          <StripeForm
            clientSecret={stripeClientSecret}
            paymentIntentId={stripePaymentIntentId}
            paymentMethod={paymentMethod}
          />
        </Elements>
      ) : (
        <Alert
          className="bg-red-500/10 border-red-500/20 text-red-500 rounded-none p-4"
          variant="destructive"
        >
          <AlertDescription className="text-xs font-mono">
            Αδυναμία φόρτωσης του συστήματος πληρωμής. Παρακαλώ ανανεώστε τη
            σελίδα.
          </AlertDescription>
        </Alert>
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
        toast.success("Η παραγγελία σας καταχωρήθηκε με επιτυχία!", {
          style: {
            background: "#0A0A0A",
            color: "#C5A25D",
            border: "1px solid #C5A25D",
          },
        });
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
          className="bg-red-500/10 border-red-500/20 text-red-500 rounded-none p-4"
          variant="destructive"
        >
          <AlertDescription className="text-xs font-mono leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Button
        className="w-full bg-[#c5a059] text-black font-black text-[10px] tracking-[0.25em] hover:bg-white hover:text-black h-14 rounded-none transition-all uppercase shadow-none"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "ΕΠΕΞΕΡΓΑΣΙΑ..." : "ΟΛΟΚΛΗΡΩΣΗ ΠΑΡΑΓΓΕΛΙΑΣ"}
      </Button>
    </form>
  );
}

interface StripeFormProps {
  paymentMethod: string;
  paymentIntentId: string;
  clientSecret: string;
}

function StripeForm({
  paymentMethod,
  paymentIntentId,
  clientSecret,
}: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setError(null);

    startTransition(async () => {
      try {
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setError(submitError.message || "Σφάλμα στα στοιχεία κάρτας.");
          return;
        }

        const orderRes = await createOrder(paymentMethod);

        if (!orderRes.success || !orderRes.redirectTo) {
          setError(
            orderRes.message ||
              "Απέτυχε η δημιουργία της παραγγελίας στη βάση δεδομένων.",
          );
          return;
        }

        const orderId = orderRes.redirectTo.split("/").pop();
        if (!orderId) {
          setError("Δεν βρέθηκε έγκυρο ID παραγγελίας.");
          return;
        }

        try {
          const updateRes = await fetch("/api/webhooks/stripe-update-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentIntentId, orderId }),
          });

          if (!updateRes.ok) {
            throw new Error("Το Stripe update endpoint απέτυχε");
          }
        } catch (fetchErr) {
          console.error("❌ Σφάλμα στο stripe-update-intent:", fetchErr);
          setError("Απέτυχε η σύνδεση της πληρωμής με την παραγγελία σας.");
          return;
        }

        const result = await stripe.confirmPayment({
          elements,
          clientSecret: clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}${orderRes.redirectTo}?payment_success=true`,
          },
          redirect: "if_required",
        });

        if (result.error) {
          console.error("Stripe confirmPayment Error:", result.error);
          setError(
            result.error.message || "Η πληρωμή απορρίφθηκε από τη Stripe.",
          );
        } else if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          await updateOrderToPaid({
            orderId,
            paymentResult: {
              id: result.paymentIntent.id,
              status: "COMPLETED",
              email_address: "",
              pricePaid: (result.paymentIntent.amount / 100).toFixed(2),
            },
          });
          toast.success(
            "Η πληρωμή ολοκληρώθηκε και η παραγγελία καταχωρήθηκε!",
            {
              style: {
                background: "#0A0A0A",
                color: "#C5A25D",
                border: "1px solid #C5A25D",
              },
            },
          );
          router.push(`${orderRes.redirectTo}?payment_success=true`);
        }
      } catch (err) {
        console.error("Γενικό σφάλμα:", err);
        setError(
          "Προέκυψε απρόσμενο σφάλμα κατά την επεξεργασία της πληρωμής.",
        );
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
          className="bg-red-500/10 border-red-500/20 text-red-500 rounded-none p-4"
          variant="destructive"
        >
          <AlertDescription className="text-xs font-mono leading-relaxed">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <PaymentElement options={{ layout: "tabs" }} />

      <Button
        className="w-full bg-[#c5a059] text-black font-black text-[10px] tracking-[0.25em] hover:bg-white hover:text-black h-14 rounded-none transition-all uppercase mt-4 shadow-none"
        disabled={isPending || !stripe || !elements}
        type="submit"
      >
        {isPending ? "ΕΠΕΞΕΡΓΑΣΙΑ ΠΛΗΡΩΜΗΣ..." : "ΠΛΗΡΩΜΗ & ΟΛΟΚΛΗΡΩΣΗ"}
      </Button>
    </form>
  );
}

export default PlaceOrderForm;
