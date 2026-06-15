import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { OrderItem, ShippingAddress } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderPageProps {
  params: {
    id: string;
  };
  searchParams: {
    payment_success?: string;
  };
}

const OrderPage = async ({ params, searchParams }: OrderPageProps) => {
  const order = await getOrderById(params.id);

  if (!order) {
    redirect("/");
  }

  const session = await auth();
  const isOwnOrder = session?.user?.id === order.userId || order.guestEmail;

  const shippingAddress = order.shippingAddress as ShippingAddress;
  const paymentSuccess = searchParams.payment_success === "true";

  return (
    <div className="space-y-10 bg-black text-white w-full pr-0 lg:pr-6 py-8">
      {/* Order Status Section */}
      <div className="space-y-4">
        {paymentSuccess && (
          <Card className="bg-green-500/10 border-green-500/20 rounded-none p-4">
            <CardContent className="pt-0 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-500 font-bold text-sm uppercase tracking-wider">
                  Payment Completed Successfully!
                </h3>
                <p className="text-green-400 text-xs mt-1">
                  You will receive a confirmation email shortly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.isPaid ? (
          <Card className="bg-green-500/10 border-green-500/20 rounded-none p-4">
            <CardContent className="pt-0 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-green-500 font-bold text-sm uppercase tracking-wider">
                  Order Confirmed
                </h3>
                <p className="text-green-400 text-xs mt-1">
                  Order Number: <span className="font-mono">{order.id}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-yellow-500/10 border-yellow-500/20 rounded-none p-4">
            <CardContent className="pt-0 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-wider">
                  Awaiting Payment
                </h3>
                <p className="text-yellow-400 text-xs mt-1">
                  Your order is waiting for payment confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Shipping Details Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Shipping Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-4 text-zinc-300 pt-0">
          <Separator className="bg-white/5 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-relaxed">
            <p>
              <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                Name
              </span>
              <span className="text-white font-medium">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </span>
            </p>
            <p>
              <span className="text-zinc-500 font-medium block text-[10px] uppercase tracking-wider mb-0.5">
                Phone
              </span>
              <span className="text-white font-medium">
                {shippingAddress.phoneNumber}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">
              Method:
            </span>
            <Badge
              variant="outline"
              className="border-[#c5a059]/30 text-[#c5a059] font-bold uppercase bg-[#c5a059]/5 px-3 py-1 text-xs tracking-wider rounded-none"
            >
              {shippingAddress.shippingMethod}
            </Badge>
          </div>

          <Separator className="bg-white/5 my-4" />

          {shippingAddress.shippingMethod.toLowerCase() === "elta" ? (
            <div className="bg-zinc-900/20 p-4 border border-white/5 space-y-1">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                Delivery Address
              </span>
              <p className="text-white text-sm leading-relaxed">
                {shippingAddress.streetName} {shippingAddress.streetNumber},{" "}
                {shippingAddress.postalCode}
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900/20 p-4 border border-white/5 space-y-2">
              <span className="text-zinc-500 font-semibold block text-[10px] uppercase tracking-wider mb-1">
                BoxNow Locker
              </span>
              <p className="font-mono text-sm text-white bg-black px-3 py-2 border border-white/5 inline-block">
                {shippingAddress.boxnowLockerId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-6">
            {order.orderitems.map((item: OrderItem) => (
              <div key={item.variantId} className="space-y-6">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-5">
                    <div className="relative w-16 h-16 bg-zinc-900 border border-white/5 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <Badge
                          variant="secondary"
                          className="bg-zinc-900 text-zinc-400 font-medium text-xs px-2 py-0 rounded-none border border-white/5"
                        >
                          Qty: {item.qty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">
                      €{Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-zinc-500 text-xs">x{item.qty}</p>
                  </div>
                </div>
                <Separator className="bg-white/5 last:hidden" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-white font-medium">
              €{Number(order.itemsPrice).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Shipping</span>
            <span className="text-white font-medium">
              €{Number(order.shippingPrice).toFixed(2)}
            </span>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex justify-between text-lg">
            <span className="text-[#c5a059] font-bold uppercase tracking-wider">
              Total
            </span>
            <span className="text-[#c5a059] font-black text-xl">
              €{Number(order.totalPrice).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-wider">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery (COD)"
                  : "Online Payment (Stripe)"}
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                {order.isPaid ? "✓ Paid" : "⏳ Pending"}
              </p>
            </div>
            <Badge
              className={
                order.isPaid
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              }
              variant="outline"
            >
              {order.isPaid ? "PAID" : "PENDING"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Back to Shop Button */}
      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-none text-xs font-bold uppercase h-12">
            Back to Shop
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderPage;
