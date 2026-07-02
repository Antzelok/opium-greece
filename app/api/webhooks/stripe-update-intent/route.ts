import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await req.json();

    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: "Missing paymentIntentId or orderId" },
        { status: 400 },
      );
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        orderId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment intent updated with orderId",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Stripe Error: ${message}` },
      { status: 500 },
    );
  }
}
