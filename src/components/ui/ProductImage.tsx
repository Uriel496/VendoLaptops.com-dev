import img1 from "../../assets/img/img-products/image 29.svg";
import img2 from "../../assets/img/img-products/image 29-1.svg";
import img3 from "../../assets/img/img-products/image 29-2.svg";
import img4 from "../../assets/img/img-products/image 29-3.svg";
import imgMonitor from "../../assets/img/img-products/image 32.svg";

function ProductImage({ type }: { type: string }) {
  const imageMap: Record<string, string> = {
    monitor: imgMonitor,
    tower: img2,
    "gaming-tower": img3,
    laptop: img4,
    "gaming-tower2": img1,
  };
  
  const imageSrc = imageMap[type] || img1;
  
  return (
    <img 
      src={imageSrc} 
      alt={type} 
      style={{ width: '120px', height: '100px', objectFit: 'contain' }} 
    />
  );
}

export default ProductImage;
