import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineArrowPath, HiOutlineClock } from 'react-icons/hi2';

const badges = [
  { icon: HiOutlineTruck, title: 'Envíos Nacionales', subtitle: 'Llegamos a todo el país con Zoom y Tealca.' },
  { icon: HiOutlineShieldCheck, title: 'Calidad Garantizada', subtitle: 'Soporte técnico premium incluido.' },
  { icon: HiOutlineArrowPath, title: 'Cambio Directo', subtitle: '7 días para cambio por falla técnica.' },
  { icon: HiOutlineClock, title: 'Atención 24/7', subtitle: 'Respuesta inmediata por especialistas.' },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-14 font-satoshi">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="group flex flex-col items-center md:items-start text-center md:text-left transition-all duration-500">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-300 text-black text-2xl border border-transparent">
                  <Icon />
                </div>
                <h4 className="text-[14px] font-bold text-gray-950 uppercase tracking-[0.1em] mb-3">{badge.title}</h4>
                <p className="text-[13px] font-medium text-gray-400 leading-relaxed max-w-[240px] md:max-w-none">{badge.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
