import { EndingSoonSection } from "./components/EndingSoonSection";
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
      <EndingSoonSection products={endingSoonProducts} />
      <MostBidsSection products={mostBidsProducts} />
      <HighestPriceSection products={highestPriceProducts} />
    </div>
  );
};

export default Home;
