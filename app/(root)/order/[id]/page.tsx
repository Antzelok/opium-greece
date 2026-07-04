import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { OrderItem, ShippingAddress } from "@/types";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    payment_success?: string;
  }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  const resolvedParams = await params;
  const order = await getOrderById(resolvedParams.id);

  if (!order) {
    redirect("/");
  }

  const shippingAddress = order.shippingAddress as ShippingAddress;
  const isElta =
    shippingAddress.shippingMethod?.trim().toLowerCase() === "elta";

  const displayEmail =
    order.user?.email || order.guestEmail || shippingAddress.email;

  return (
    <div className="space-y-10 bg-black text-white pr-0 lg:pr-6 py-15 px-5">
      {/* Order Status Section */}
      <div className="space-y-4 ">
        <Card className="bg-green-500/10 border-green-500/20 rounded-none p-4">
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-green-500 font-bold text-sm tracking-wider">
              ORDER COMPLETED SUCCESSFULLY!
            </h3>
          </div>
        </Card>
      </div>

      {/* Shipping Details Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader>
          <CardTitle className="text-[#c5a059] text-[12px] font-bold tracking-[0.2em] italic">
            SHIPPING DETAILS
          </CardTitle>
        </CardHeader>
        <div className="text-sm space-y-4 text-zinc-300 p-4 pt-0">
          <Separator className="bg-white/5 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 leading-relaxed">
            <p>
              <span className="text-zinc-400 font-medium block text-[11px] tracking-wider mb-0.5">
                FIRST NAME
              </span>
              <span className="text-white font-medium">
                {shippingAddress.firstName}
              </span>
            </p>
            <p>
              <span className="text-zinc-400 font-medium block text-[11px] tracking-wider mb-0.5">
                LAST NAME
              </span>
              <span className="text-white font-medium">
                {shippingAddress.lastName}
              </span>
            </p>
            <p>
              <span className="text-zinc-400 font-medium block text-[11px] tracking-wider mb-0.5">
                PHONE
              </span>
              <span className="text-white font-medium">
                {shippingAddress.phoneNumber}
              </span>
            </p>
            <p>
              <span className="text-zinc-400 font-medium block text-[11px] tracking-wider mb-0.5">
                EMAIL
              </span>
              <span className="text-white font-medium break-all">
                {displayEmail || "-"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-zinc-400 text-[12px] font-semibold tracking-wider">
              SHIPPING METHOD:
            </span>
            <Badge
              variant="outline"
              className="border-[#c5a059]/30 text-[#c5a059] font-bold uppercase bg-[#c5a059]/5 px-3 py-1 text-xs tracking-wider rounded-none"
            >
              {shippingAddress.shippingMethod}
            </Badge>
          </div>

          <Separator className="bg-white/5 my-4" />

          {isElta ? (
            <div>
              <span className="text-zinc-400 font-semibold block text-[12px] italic tracking-wider mb-5">
                DELIVERY ADDRESS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-400 block text-[11px] tracking-wider mb-1">
                    COUNTRY
                  </span>
                  <p className="text-white">{shippingAddress.country || "-"}</p>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px] tracking-wider mb-1">
                    MUNICIPALITY / CITY
                  </span>
                  <p className="text-white">
                    {shippingAddress.municipality || "-"} /{" "}
                    {shippingAddress.city || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-zinc-400 block text-[11px] tracking-wider mb-1">
                    STREET ADDRESS
                  </span>
                  <p className="text-white">
                    {shippingAddress.streetName} {shippingAddress.streetNumber},{" "}
                    {shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/20 p-4 border border-white/5 space-y-2">
              <span className="text-zinc-400 font-semibold block text-[12px] tracking-wider mb-5">
                BOXNOW LOCKER
              </span>
              <p className="font-mono text-sm text-white bg-black px-3 py-2 border border-white/5 inline-block">
                {shippingAddress.boxnowLockerId}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Order Items Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em] italic">
            ORDER ITEMS
          </CardTitle>
        </CardHeader>
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
                    <h4 className="font-bold text-sm text-[#c5a059] uppercase tracking-wide">
                      {item.name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-zinc-900 text-zinc-400 font-medium text-xs px-2 py-0 rounded-none border border-white/5"
                    >
                      Qty: {item.qty}
                    </Badge>
                    <h4 className="font-bold text-sm text-[#c5a059] uppercase tracking-wide"></h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">
                    {formatCurrency(Number(item.price) * item.qty)}
                  </p>
                </div>
              </div>
              <Separator className="bg-white/5 last:hidden" />
            </div>
          ))}
        </div>
      </Card>

      {/* Cost Summary Section */}
      <Card className="bg-zinc-950 border-white/5 rounded-none p-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#c5a059] text-[11px] font-bold tracking-[0.2em] italic">
            COST SUMMARY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-white font-medium">
              {formatCurrency(Number(order.itemsPrice))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Shipping</span>
            <span className="text-white font-medium">
              {formatCurrency(Number(order.shippingPrice))}
            </span>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex justify-between text-lg">
            <span className="text-[#c5a059] font-bold tracking-wider">
              TOTAL
            </span>
            <span className="text-[#c5a059] font-black text-xl">
              {formatCurrency(Number(order.totalPrice))}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href="/" className="flex-1">
          <Button className="w-full bg-zinc-800 text-white hover:bg-[#c5a059] rounded-none text-xs font-bold h-12">
            BACK TO SHOP
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderPage;
