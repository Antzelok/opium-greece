import { updateOrderToPaid } from "@/lib/actions/order.actions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Webhook Error" }), {
      status: 400,
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    console.log("DEBUG: Webhook Succeeded! OrderID in metadata:", orderId);

    if (!orderId) {
      console.error(
        "DEBUG: ERROR! No orderId found in Stripe metadata for PI:",
        paymentIntent.id,
      );
      return new Response(JSON.stringify({ error: "No orderId" }), {
        status: 400,
      });
    }

    try {
      const result = await updateOrderToPaid({
        orderId: orderId,
        paymentResult: {
          id: paymentIntent.id,
          status: "COMPLETED",
          email_address: paymentIntent.receipt_email || "",
          pricePaid: (paymentIntent.amount / 100).toFixed(2),
        },
      });
      console.log("DEBUG: Database update result:", result);
      return new Response(JSON.stringify({ message: "Success" }), {
        status: 200,
      });
    } catch (dbError) {
      console.error("DEBUG: DB Update failed:", dbError);
      return new Response(JSON.stringify({ error: "DB Error" }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
