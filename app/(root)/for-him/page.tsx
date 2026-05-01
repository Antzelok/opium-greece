import { getProductsByCategory } from "@/lib/actions/product.actions";
import ProductCard from "@/components/shared/product/product-card";
import { Product } from "@/types";

export const metadata = {
  title: "For Him | Luxury Collection",
};

const ForHimPage = async () => {
  const menProducts: Product[] = await getProductsByCategory("Men");

  return (
    <div className="min-h-screen bg-black py-12 px-4 ">
      {/* Header Section */}
      <header className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-[#C5A25D] text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase italic">
          For Him
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#C5A25D]/30" />
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">
            The Essence of Masculinity
          </p>
          <div className="h-px w-12 bg-[#C5A25D]/30" />
        </div>
      </header>

      {/* Products Grid */}
      <div className="container mx-auto">
        {menProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
            {menProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-[#C5A25D] text-sm uppercase tracking-widest opacity-50">
              Η συλλογή ενημερώνεται σύντομα.
            </p>
          </div>
        )}
      </div>

      {/* Subtle Background Decorative Element */}
      <div className="fixed bottom-0 left-0 w-full h-64 bg-linear-to-t from-[#C5A25D]/5 to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default ForHimPage;
