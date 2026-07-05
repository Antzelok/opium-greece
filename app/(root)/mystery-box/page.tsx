import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mystery Box",
};

const MysteryBoxPage = async () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 ">
      {/* Header Section */}
      <header className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h1 className="text-[#C5A25D] text-4xl md:text-5xl font-extralight tracking-[0.2em] uppercase italic">
          Mystery Box
        </h1>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#C5A25D]/30" />
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.4em]">
            COMING SOON
          </p>
          <div className="h-px w-12 bg-[#C5A25D]/30" />
        </div>
      </header>
    </div>
  );
};

export default MysteryBoxPage;
