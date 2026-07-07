import { getProductsByCategory } from "@/lib/actions/product.actions";
import ProductCard from "@/components/shared/product/product-card";
import { Product } from "@/types";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "Niche",
};

const NichePage = async () => {
  const nicheProducts: Product[] = await getProductsByCategory("Niche");

  return (
    <div className="min-h-screen bg-black py-12 px-4 ">
      {/* Header Section */}
      <header className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-[#C5A25D] text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase italic">
          Niche
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#C5A25D]/30" />
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">
            BEYOND COMMON SCENTS
          </p>
          <div className="h-px w-12 bg-[#C5A25D]/30" />
        </div>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto">
        {nicheProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
            {nicheProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>

      {/* Subtle Background Decorative Element */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-linear-to-t from-[#C5A25D]/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default NichePage;
