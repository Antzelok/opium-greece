import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";
import { PaymentResult } from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  // 👑 Ακούμε ΜΟΝΟ το payment_intent.succeeded που καλύπτει Κάρτες, Apple/Google Pay & Revolut
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error(
        "❌ Webhook Error: Missing orderId in metadata for PI:",
        paymentIntent.id,
      );
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 },
      );
    }

    try {
      await updateOrderToPaid({
        orderId: orderId,
        paymentResult: {
          id: paymentIntent.id,
          status: "COMPLETED",
          // Στο PaymentIntent, το email βρίσκεται συνήθως στο receipt_email
          email_address: paymentIntent.receipt_email || "",
          pricePaid: (paymentIntent.amount / 100).toFixed(2),
        } as PaymentResult,
      });

      return NextResponse.json({
        message: "updateOrderToPaid was successful",
      });
    } catch (dbError) {
      console.error("❌ Database Update Failed:", dbError);
      return NextResponse.json(
        { error: "Internal Database Error" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: "Event ignored" });
}
