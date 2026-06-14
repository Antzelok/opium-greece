import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Δημιουργία του Payment Intent στη Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Μετατροπή σε cents (π.χ. 10.50€ -> 1050)
      currency: "eur",
      // Ενεργοποιεί αυτόματα Revolut Pay, Apple Pay, Google Pay και Κάρτες
      // ανάλογα με τι έχεις ανάψει στο Stripe Dashboard σου
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: "", // Αρχικά άδειο, θα πάρει τιμή στο επόμενο step
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Stripe Error: ${message}` },
      { status: 500 },
    );
  }
}
