import ProductCard from '../ui/ProductCard';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const PRODUCTS = [
  {
    id: 1,
    category: 'Oficina / Estudiante',
    name: 'DELL LATITUDE 7490 CORE I7-8650U 1.9GHZ 16GB 256GB SSD 14" FHD',
    price: 350,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByAyhPekr68121yIdgv0a5m82EPeAHshlgsGQGrv2-zX8vie9xSYdhpH5Yx5AnWaxJRjrISoHo1cfOn0RxSaUMbKv0aTRZBNvl8P4Gtj6HO6uOHoY7zR8Gp-cZTy2-Mz01AOFtECRigRED7os0y-x0a_bDb41qfCDjQAFav5RhxGqY6ICiyzDH_D6OaB8XIhEQ7A9_hw8UbvxAAQXjMQ1LdYT8FE6py3TGye3v6HVtESyQ8pzhEIHgtbwFvZXrwjVP9PAgRfz8BfM',
    stock: 5,
  },
  {
    id: 2,
    category: 'Empresarial',
    name: 'LAPTOP HP ELITEBOOK 840 G5 CORE I5-8350U 1.7GHZ 8GB 256GB SSD 14"',
    price: 280,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVcrEGxjthEEszBDRLxMmgj-vlTYZWrEhE9GSD6Tph2BvjPjo9c228d_xDJETQ9Vg8CtY0oGaoPv5ZnJ2j4GbYfLV8hyeVTLv_c-MTd_SHt6o8Eaj9b6-mzIud829xAq4HoloMyNt0cleC0GV_HI7UzuPp2vK3tU4oT1LTvjefP-p28E4cR2FKifAjmBS9JqI8QcKHgstIpw67Fyo4GCOgZ5ynYyO52Ua6QqKgFgzdsu_Sf6eMIbhQa7KqentljB7T8sb7lEcc5BY',
    stock: 2,
  },
  {
    id: 3,
    category: 'Gaming',
    name: 'LAPTOP LENOVO THINKPAD T480 CORE I7-8650U 1.9GHZ 16GB 512GB SSD 14"',
    price: 399,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS0NK7SXnhch9YJoPCAf6knzJg6lJHhwMO6wtlERHKLcXDF-Vaz-JAmryyZHoGrrvckFGye0ZibXveskotJrTpq9pMxbKNjxskfbdGyF-AHgOxUPf7QHZsfDI0Mj97LXHuO5ReFy-wgRY1Uy7DPhZj5V3b6W4GV92l0G5CVH7CZcIm2F_N9xygC5W0F5bCiqORWm68uQJnJIkCtA2nH5QR_QeR29lRUkPqR8xSOFlj6yWwpUluP1586imKYj8e_V9fLsk4FcRWaSg',
    stock: 3,
  },
  {
    id: 4,
    category: 'Portable',
    name: 'MICROSOFT SURFACE LAPTOP 2 CORE I5-8250U 1.6GHZ 8GB 128GB SSD 13.5"',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALNKNDzc5tGJXqbRPV6oUuGLwy-mspKm6CZ-1sXtzhd3YYBbbzBEWHkOBaKKvD6B41Q3hPHjAM0kLBW7bFhwat1C7ag30iBPprjTsXaM38OoaiGyNnVRwZtHvTGzpW_Dxr2BNGhar97zh_uO1tLloXiTY7PHVEpg86SGz1o1_q3lAHuX55FMXAfVhaotPOXgbNtL9N17_Oe1Cm_fLzsw0JjsJYgo79PEXmDf0TJS_Is2ryH8C_PIXWWp2Al968IVHjnIItSqmDUOM',
    stock: 4,
  },
];

const categories = [
  'Laptops Reacondicionadas',
  'Partes y Repuestos',
  'Accesorios de Oficina',
  'Monitores Pro',
  'Cargadores Originales'
];

export default function ProductGrid() {
  return (
    <section className="bg-white py-10 font-satoshi">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col lg:flex-row gap-8 lg:gap-14">
        
        {/* Minimalist Sidebar */}
        <aside className="w-full lg:w-[280px] flex flex-col gap-8">
          <div className="space-y-6">
            <h4 className="text-black font-bold text-sm uppercase tracking-[0.2em] px-2">Categorías</h4>
            <div className="flex flex-col gap-1">
              {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  className={`flex items-center justify-between px-3 py-2.5 rounded-full transition-all group text-left ${
                    idx === 0 
                    ? 'bg-black text-white' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <span className="font-bold text-[13px] tracking-tight">{cat}</span>
                  <HiOutlineArrowRight className={`text-sm transition-transform group-hover:translate-x-1 ${idx === 0 ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-8 text-black relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h5 className="font-bold text-xl leading-[1.2] tracking-tight">¿Buscas algo específico?</h5>
              <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Personalizamos tu equipo según tus necesidades profesionales.</p>
              <button className="w-full bg-black text-white font-bold py-3 rounded-full text-[12px] uppercase tracking-widest hover:bg-gray-800 transition-all">
                Contactar
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tighter">OFERTAS DEL MES</h2>
              <p className="text-gray-400 font-medium text-[14px]">Selección premium de equipos Grado A+.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ordenar:</span>
              <select className="bg-transparent border-none text-[13px] font-bold text-black focus:outline-none cursor-pointer">
                <option>Más recientes</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="flex justify-center pt-8">
            <button className="px-10 py-4 rounded-full border border-gray-100 text-[13px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
              Ver todos los productos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
