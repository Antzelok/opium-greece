import Carousel from "@/components/home/carousel";
import Hero from "@/components/home/hero";
import StatusBar from "@/components/home/status-bar";
import StoreLocations from "@/components/home/store-locations";

const HomePage = () => {
  return (
    <>
      <main className="h-full w-full">
        <Hero />
        <StatusBar />
        <Carousel />
        <StoreLocations />
      </main>
    </>
  );
};

export default HomePage;
