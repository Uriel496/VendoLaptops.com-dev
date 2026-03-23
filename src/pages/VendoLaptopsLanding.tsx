import { useState } from "react";
import Hero from "../components/home/Hero";
import ProductsSection from "../components/home/ProductsSection";
import BrandsSection from "../components/home/BrandsSection";
import "../styles/vendo-laptops.css";

function VendoLaptopsLanding() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="vl-root">
      {/* Hero Section */}
      <Hero currentSlide={currentSlide} onSlideChange={setCurrentSlide} />

      {/* Products Section */}
      <ProductsSection />

      {/* Brands Section */}
      <BrandsSection />
    </div>
  );
}

export default VendoLaptopsLanding;
