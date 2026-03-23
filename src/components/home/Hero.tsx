import { useEffect } from "react";
import laptopImage from "../../assets/pngwing.com 1.svg";

interface HeroProps {
  currentSlide: number;
  onSlideChange: (slide: number) => void;
}

const heroSlides = [
  {
    tag: "VENDO LAPTOPS",
    title: "TU PRÓXIMA LAPTOP\nESTÁ AQUÍ",
    subtitle: "HASTA 80% DE DESCUENTO"
  },
  {
    tag: "GAMING XTREME",
    title: "PODER SUPREMO\nPARA GAMERS",
    subtitle: "RTX 40 SERIES - STOCK LIMITADO"
  },
  {
    tag: "WORKSTATION PRO",
    title: "RENDIMIENTO\nSIN LÍMITES",
    subtitle: "INTEL i9 + 32GB RAM - DESDE $899"
  },
  {
    tag: "ULTRABOOKS",
    title: "PORTABILIDAD\nY ESTILO",
    subtitle: "DISEÑO PREMIUM - 12 MSI"
  },
  {
    tag: "ESTUDIANTES",
    title: "TU ALIADO\nACADÉMICO",
    subtitle: "FINANCIAMIENTO 0% - 12 MESES"
  },
  {
    tag: "CYBER WEEK",
    title: "OFERTAS\nRELÁMPAGO",
    subtitle: "ENVÍO GRATIS + MOCHILA DE REGALO"
  }
];

export default function Hero({ currentSlide,onSlideChange }: HeroProps) {
  const slide = heroSlides[currentSlide];
  
  // Autoplay cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      onSlideChange((currentSlide + 1) % 6);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, onSlideChange]);
  
  return (
    <div className="vl-hero">
      <button className="vl-hero-nav left" onClick={() => onSlideChange((currentSlide - 1 + 6) % 6)}>‹</button>

      <div className="vl-hero-content" key={currentSlide}>
        <div className="vl-hero-tag">{slide.tag}</div>
        <div className="vl-hero-title">
          {slide.title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < slide.title.split('\n').length - 1 && <br />}
            </span>
          ))}
        </div>
        <div className="vl-hero-sub">{slide.subtitle}</div>
        <div className="vl-hero-dots">
          {[0,1,2,3,4,5].map(i => (
            <div key={i} className={`vl-hero-dot${currentSlide === i ? " active" : ""}`} onClick={() => onSlideChange(i)} />
          ))}
        </div>
      </div>

      {/* Hero visual */}
      <div className="vl-hero-visual">
        <div className="vl-hero-circle" />
        <div className="vl-hero-laptop">
          <img src={laptopImage} alt="Laptop" style={{ width: '260px', height: '180px', objectFit: 'contain' }} />
        </div>
      </div>

      <button className="vl-hero-nav right" onClick={() => onSlideChange((currentSlide + 1) % 6)}>›</button>
    </div>
  );
}

