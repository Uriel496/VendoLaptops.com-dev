import { HiOutlineRocketLaunch, HiOutlineBriefcase, HiOutlineCpuChip } from 'react-icons/hi2';

const features = [
  {
    title: 'Grado A+',
    desc: 'Equipos sin rayones, batería óptima y funcionamiento al 100%.',
    icon: HiOutlineRocketLaunch,
  },
  {
    title: 'Garantía Real',
    desc: 'Respaldo total premium en hardware y soporte técnico.',
    icon: HiOutlineBriefcase,
  },
  {
    title: 'Upgrades',
    desc: 'Personalizamos RAM y SSD según tus necesidades profesionales.',
    icon: HiOutlineCpuChip,
  },
];

export default function CustomBuildPromo() {
  return (
    <section className="bg-white py-14 font-satoshi">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="bg-[#fcfcfc] rounded-[3rem] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-16 border border-gray-50/50 relative overflow-hidden group">
          
          {/* Content */}
          <div className="flex-1 space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full text-black font-bold text-[10px] uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 bg-black rounded-full animate-pulse"></span>
              Servicio Corporativo
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black leading-[1.05] tracking-tighter">
              EQUIPA TU EMPRESA CON <span className="text-gray-400">CALIDAD PREMIUM.</span>
            </h2>
            
            <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Especialistas en dotación de equipos de gama alta para profesionales. Ahorra hasta un 60% manteniendo el máximo rendimiento.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
              {features.map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-14 w-14 rounded-full bg-white shadow-sm flex items-center justify-center text-black text-2xl group-hover:bg-black group-hover:text-white transition-all duration-300 border border-gray-50">
                    <f.icon />
                  </div>
                  <h4 className="font-bold text-black text-[14px] uppercase tracking-wider">{f.title}</h4>
                  <p className="text-gray-400 text-[12px] font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button className="bg-black text-white font-bold px-12 py-5 rounded-full text-[13px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/5">
                Solicitar Cotización
              </button>
            </div>
          </div>

          {/* Image Layer */}
          <div className="flex-1 relative w-full lg:max-w-[500px]">
            <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 transition-transform duration-700 group-hover:scale-105">
              <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                alt="Corporate Laptops"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <p className="font-bold text-2xl tracking-tighter">Stock Inmediato</p>
                <p className="text-white/80 text-sm font-medium">Más de 500 laptops listas para entrega.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
