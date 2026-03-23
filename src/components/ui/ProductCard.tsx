import { HiOutlineShoppingBag, HiOutlineHeart, HiStar } from 'react-icons/hi2';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  rating?: number;
}

const ProductCard = ({ name, price, image, stock, category = 'Laptop', rating = 5 }: ProductCardProps) => {
  return (
    <div className="group relative bg-white rounded-[2rem] border border-transparent hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-500 overflow-hidden font-satoshi">
      {/* Badge */}
      <div className="absolute top-5 left-5 z-10">
        <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
          stock > 0 ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-400'
        }`}>
          {stock > 0 ? 'En Stock' : 'Agotado'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-5 right-5 z-10 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
        <button className="h-10 w-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors">
          <HiOutlineHeart className="text-xl" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#fbfbfb] p-10 flex items-center justify-center">
        <img
          src={image || 'https://via.placeholder.com/400'}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-7 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{category}</span>
          <div className="flex items-center gap-1">
            <HiStar className="text-black text-[10px]" />
            <span className="text-[11px] font-bold text-black">{rating}.0</span>
          </div>
        </div>

        <h3 className="text-gray-950 font-bold text-[16px] leading-[1.3] line-clamp-2 min-h-[42px] tracking-tight">
          {name}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-black tracking-tighter">
              <span className="text-[14px] align-top mr-0.5">$</span>
              {price.toLocaleString()}
            </span>
          </div>

          <button 
            disabled={stock === 0}
            className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
              stock === 0 
                ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/5'
            }`}
          >
            <HiOutlineShoppingBag className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
