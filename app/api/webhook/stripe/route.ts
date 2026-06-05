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

  // Πιάνουμε και τα δύο events (για κάρτες και Apple Pay)
  if (
    event.type === "payment_intent.succeeded" ||
    event.type === "charge.succeeded"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const object = event.data.object as any;

    const orderId = object.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 },
      );
    }

    await updateOrderToPaid({
      orderId: orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address:
          object.receipt_email || object.billing_details?.email || "",
        pricePaid: (object.amount / 100).toFixed(2),
      } as PaymentResult,
    });

    return NextResponse.json({
      message: "updateOrderToPaid was successful",
    });
  }

  return NextResponse.json({ message: "Event ignored" });
}
