import { CTASection } from "./components/CTASection";
import { EndingSoonSection } from "./components/EndingSoonSection";
import { HeroSection } from "./components/HeroSection";
import { HighestPriceSection } from "./components/HighestPriceSection";
import { MostBidsSection } from "./components/MostBidsSection";
import {
  endingSoonProducts,
  highestPriceProducts,
  mostBidsProducts,
} from "@/data/mock-data";

const Home = () => {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <EndingSoonSection products={endingSoonProducts} />
      <MostBidsSection products={mostBidsProducts} />
      <HighestPriceSection products={highestPriceProducts} />
      <CTASection />
    </div>
  );
};

export default Home;
