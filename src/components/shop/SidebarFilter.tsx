import { HiArrowUpRight } from 'react-icons/hi2';

const categories = ['Todos', 'GPU / Graphics', 'CPU / Processors', 'Motherboards', 'RAM / Memory'];
const statuses = ['En stock', 'Pre-order', 'Oferta'];
const budgets = ['<$1K', '$1K - $2K', '$2K+'];

export default function SidebarFilter() {
  return (
    <aside className="glass-panel w-full shrink-0 rounded-[2.5rem] border border-white/10 p-6 lg:w-72">
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/55">Categorías</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${category === 'Todos' ? 'border-primary/50 bg-primary/10 text-white' : 'border-white/10 bg-transparent text-white/60 hover:border-white/30 hover:text-white/80'}`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/55">Presupuesto</h4>
          <div className="mt-3 grid gap-2">
            {budgets.map((range) => (
              <button
                key={range}
                className="group flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-white"
                type="button"
              >
                {range}
                <HiArrowUpRight className="text-base text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/55">Disponibilidad</h4>
          <div className="mt-3 space-y-2">
            {statuses.map((status) => (
              <label key={status} className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70 transition-colors hover:border-white/20">
                <span>{status}</span>
                <input
                  className="h-5 w-5 rounded border-white/20 bg-transparent text-primary focus:ring-primary"
                  type="checkbox"
                  defaultChecked={status === 'En stock'}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
