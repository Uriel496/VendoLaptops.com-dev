import { Link } from "react-router-dom";
import { useState } from "react";
import StarRating from "../ui/StarRating";
import ProductImage from "../ui/ProductImage";
import { products } from "../../constants/data";

function ProductsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 6;
  const maxStartIndex = Math.max(products.length - visibleCount + 1, 1);
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % maxStartIndex);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + maxStartIndex) % maxStartIndex);
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div className="vl-section">
      <div className="vl-section-header">
        <div className="vl-section-title">
          Nuevos Productos están <span>aquí</span>
        </div>
        <Link className="vl-view-all" to="/catalog">
          Ver Todos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>

      <div className="vl-carousel-container">
        <button className="vl-carousel-nav left" onClick={handlePrev}>
          ‹
        </button>

        <div className="vl-products vl-carousel">
          {visibleProducts.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="vl-product-card vl-carousel-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className={`vl-stock ${p.stock === "en stock" ? "green" : "amber"}`}>
                {p.stock}
              </div>
              <div className="vl-product-img">
                <ProductImage type={p.img} />
              </div>
              <div className="vl-reviews-row">
                <StarRating rating={p.rating} />
                <span className="vl-review-count">({p.reviews})</span>
              </div>
              <div className="vl-product-name">{p.name}</div>
              <div className="vl-price-old">${p.oldPrice}.00</div>
              <div className="vl-price">${p.price}.00</div>
            </Link>
          ))}
        </div>

        <button className="vl-carousel-nav right" onClick={handleNext}>
          ›
        </button>
      </div>
    </div>
  );
}

export default ProductsSection;
