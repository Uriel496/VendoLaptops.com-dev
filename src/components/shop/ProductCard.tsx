import { useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { HiShoppingCart, HiSparkles } from 'react-icons/hi2';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  highlights: string[];
  availability: string;
  label?: string;
}

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' });

export default function ProductCard({ id, name, price, image, category, highlights, availability, label }: ProductCardProps) {
  const { addToCart } = useCart();
  const formattedPrice = useMemo(() => currency.format(price), [price]);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>

      {label && (
        <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-primary/20 bg-black/80 px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-widest text-primary backdrop-blur-md">
          <HiSparkles className="text-sm animate-pulse" />
          {label}
        </span>
      )}

      <div className="relative mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] bg-black/40 p-6 transition-all duration-500 group-hover:bg-black/60 group-hover:shadow-inner group-hover:shadow-primary/5">
        <img
          className="h-full w-full scale-100 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-transform duration-700 group-hover:scale-110"
          alt={name}
          src={image}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative flex flex-grow flex-col space-y-3">
        <header className="space-y-1">
          <p className="inline-block text-[0.55rem] font-bold uppercase tracking-[0.25em] text-primary/80">
            {category}
          </p>
          <h4 className="text-lg font-bold leading-tight text-white transition-colors group-hover:text-primary/90">{name}</h4>
        </header>

        <div className="flex flex-wrap gap-1.5 min-h-[48px] content-start">
          {highlights.map((highlight) => (
            <span key={highlight} className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-wider text-white/30 transition-colors group-hover:border-white/10 group-hover:text-white/60">
              {highlight}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="mb-4 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/30">{availability}</span>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors">{formattedPrice}</span>
            </div>
          </div>
          
          <button
            className="group/btn relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-white/[0.04] py-3.5 text-xs font-black uppercase tracking-widest text-white border border-white/10 transition-all hover:border-primary/50 hover:bg-primary hover:text-black active:scale-[0.98]"
            onClick={() => addToCart({ id, name, price, image })}
          >
            <HiShoppingCart className="text-lg transition-transform group-hover/btn:scale-110" />
            Add to Grid
          </button>
        </div>
      </div>
    </div>
  );
}
