import Hero from "@/components/home/hero";
import StatusBar from "@/components/home/status-bar";

const HomePage = () => {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <StatusBar />
      </main>
    </>
  );
};

export default HomePage;
