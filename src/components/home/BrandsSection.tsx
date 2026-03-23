import { useEffect, useRef } from "react";
import logo1 from "../../assets/Marcas/image 33.svg";
import logo2 from "../../assets/Marcas/image 33-1.svg";
import logo3 from "../../assets/Marcas/image 33-2.svg";
import logo4 from "../../assets/Marcas/image 33-3.svg";
import logo5 from "../../assets/Marcas/image 33-4.svg";
import logo6 from "../../assets/Marcas/image 33-5.svg";
import logo7 from "../../assets/Marcas/image 33-6.svg";

function BrandsSection() {
  const brandLogos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      position -= speed;
      
      // Reset position when first list completes
      const firstList = track.querySelector('.logoloop__list');
      if (firstList) {
        const listWidth = firstList.getBoundingClientRect().width;
        if (Math.abs(position) >= listWidth) {
          position = 0;
        }
      }
      
      track.style.transform = `translate3d(${position}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="vl-brands">
      <div className="logoloop logoloop--fade">
        <div className="logoloop__track" ref={trackRef}>
          {/* Render list twice for seamless loop */}
          {[0, 1].map((set) => (
            <div key={set} className="logoloop__list">
              {brandLogos.map((logo, index) => (
                <div key={`${set}-${index}`} className="logoloop__item">
                  <div className="logoloop__node">
                    <img src={logo} alt={`Brand ${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandsSection;
