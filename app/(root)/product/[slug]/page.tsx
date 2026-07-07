import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import Link from "next/link";
import ProductDetails from "./product-details";
import { Product } from "@/types";
import ProductDetailsPage from "./product-details";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name,
  };
}

const ProductPage = async ({ params }: Props) => {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);
  const cart = await getMyCart();

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as Product;

  return (
    <div className="min-h-screen  text-white font-sans selection:bg-[#c5a059]/30 pt-10">
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left Side: Product Image */}
          <div className="relative aspect-4/5 w-full bg-[#0f0f0f] border border-white/5 flex items-center justify-center p-6 md:p-12 overflow-hidden">
            {/* Category Tag - Absolute */}
            <div className="absolute top-4 left-4 z-2 bg-[#c5a059] text-black text-[12px] md:text-[9px] font-bold px-2 py-1 tracking-tighter uppercase">
              {product.category}
            </div>

            {product.images && product.images.length > 0 ? (
              <div className="relative w-full h-full transform hover:scale-105 transition-transform duration-700">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="text-neutral-700 text-xs tracking-widest">
                IMAGE UNAVAILABLE
              </div>
            )}
          </div>

          {/* Right Side: Product Details & Configuration */}
          <div className="flex flex-col">
            <ProductDetailsPage product={product} cart={cart} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
