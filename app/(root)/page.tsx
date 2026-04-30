import Hero from "@/components/home/hero";
import StatusBar from "@/components/home/status-bar";

const HomePage = () => {
  return (
    <>
      <main className="h-full w-full">
        <Hero />
        <StatusBar />
      </main>
    </>
  );
};

export default HomePage;
