import { useState } from "react";
import Hero from "../components/home/Hero";
import ProductsSection from "../components/home/ProductsSection";
import BrandsSection from "../components/home/BrandsSection";
import CategoriesSection from "../components/home/CategoriesSection";
import BuildPromo from "../components/home/BuildPromo";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <Hero currentSlide={currentSlide} onSlideChange={setCurrentSlide} />
      <ProductsSection />
      <BrandsSection />
      <CategoriesSection />
      <BuildPromo />
    </>
  );
}
