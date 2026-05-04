import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import Link from "next/link";
import ProductDetails from "./product-details";
import { Product } from "@/types";

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

const ProductDetailsPage = async ({ params }: Props) => {
  const { slug } = await params;
  const rawProduct = await getProductBySlug(slug);
  const cart = await getMyCart();

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as Product;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#c5a059]/30 pt-10">
      {/* Header - Fixed or Sticky για καλύτερο UX */}
      <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center text-[10px] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Link>
          <h1 className="text-lg md:text-xl tracking-[0.3em] md:tracking-[0.4em] font-serif text-[#c5a059] uppercase">
            Opium
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left Side: Product Image */}
          <div className="relative aspect-4/5 w-full bg-[#0f0f0f] border border-white/5 flex items-center justify-center p-6 md:p-12 overflow-hidden">
            {/* Category Tag - Absolute */}
            <div className="absolute top-4 left-4 z-2 bg-[#c5a059] text-black text-[8px] md:text-[9px] font-bold px-2 py-1 tracking-tighter uppercase">
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
              <div className="text-neutral-700 text-xs uppercase tracking-widest">
                Image Unavailable
              </div>
            )}
          </div>

          {/* Right Side: Product Details & Configuration */}
          <div className="flex flex-col">
            <ProductDetails product={product} cart={cart} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailsPage;
