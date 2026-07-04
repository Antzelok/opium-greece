import Header from "@/components/layout/header/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import { getMyCart } from "@/lib/actions/cart.actions";
import { auth } from "@/auth";
import Script from "next/script";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getMyCart();
  const session = await auth();
  return (
    <div className="flex min-h-dvh flex-col bg-black pt-15">
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      <Header cart={cart} user={session?.user} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
      <Toaster position="top-left" />
    </div>
  );
}
