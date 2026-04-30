import CategoryGrid from "@/components/home/categoryGrid";
import Hero from "@/components/home/hero";
import StatusBar from "@/components/home/status-bar";

const HomePage = () => {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <StatusBar />
        <CategoryGrid />
      </main>
    </>
  );
};

export default HomePage;
