import { Suspense } from "react";
import OrderSummary from "@/components/shared/order-summary";
import Script from "next/script";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">{children}</div>
        <Suspense fallback={<div className="lg:col-span-4" />}>
          <OrderSummary />
        </Suspense>
      </div>
    </div>
  );
}
