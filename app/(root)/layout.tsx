import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "sonner";
import { getMyCart } from "@/lib/actions/cart.actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getMyCart();
  return (
    <div className="flex min-h-dvh flex-col bg-black pt-15">
      <Header cart={cart} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
      <Toaster position="top-left" />
    </div>
  );
}
