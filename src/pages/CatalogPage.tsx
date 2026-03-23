import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSavedItems } from "../context/SavedItemsContext";
import { type CatalogProduct } from "../constants/data";
import { useProductsStore } from "../store/productsStore";
import logo1 from "../assets/Marcas/image 33.svg";
import logo2 from "../assets/Marcas/image 33-1.svg";
import logo3 from "../assets/Marcas/image 33-2.svg";
import logo4 from "../assets/Marcas/image 33-3.svg";
import logo5 from "../assets/Marcas/image 33-4.svg";
import logo6 from "../assets/Marcas/image 33-5.svg";
import logo7 from "../assets/Marcas/image 33-6.svg";
import promoImage from "../assets/img/img-products/image 49.svg";
import topBanner from "../assets/Group 56.svg";
import laptop1 from "../assets/img/Laptops/image 29.svg";
import laptop2 from "../assets/img/Laptops/image 29-1.svg";
import laptop3 from "../assets/img/Laptops/image 29-2.svg";
import laptop4 from "../assets/img/Laptops/image 29-3.svg";
import laptop5 from "../assets/img/Laptops/image 29-4.svg";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stock: string;
  category: string;
  color: string;
  img: string;
  brand: string;
  cpu?: string;
  featured?: string;
  vdPorts?: string;
};

const PRICE_RANGES = [
  { label: "$0 - $800", min: 0, max: 800 },
  { label: "$801 - $1200", min: 801, max: 1200 },
  { label: "$1201 - $1800", min: 1201, max: 1800 },
  { label: "$1801 - $2600", min: 1801, max: 2600 },
  { label: "$2601 o mas", min: 2601, max: Number.POSITIVE_INFINITY },
];

const CATALOG_IMAGE_MAP: Record<string, string> = {
  monitor: laptop1,
  tower: laptop2,
  "gaming-tower": laptop3,
  laptop: laptop4,
  "gaming-tower2": laptop5,
};

const BRAND_LOGOS = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

/* ─────────────────────────────────────────
   PRODUCT IMAGE (real assets)
───────────────────────────────────────── */
function LaptopImage({ type, small = false }: { type: string; small?: boolean }) {
  const w = small ? 92 : 160;
  const h = small ? 64 : 114;
  const src = CATALOG_IMAGE_MAP[type] ?? laptop1;
  return (
    <img
      src={src}
      alt="Laptop"
      width={w}
      height={h}
      style={{ objectFit:"contain", display:"block" }}
    />
  );
}

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
function Stars({ n }: { n: number }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="11" height="11" viewBox="0 0 12 12"
          fill={s <= n ? "#f5c518" : "#ddd"}>
          <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"/>
        </svg>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────
   FILTER PILL (active tag)
───────────────────────────────────────── */
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:"#fff", border:"1.5px solid #d1a200",
      borderRadius:20, padding:"3px 10px 3px 10px",
      fontSize:11, fontWeight:600, color:"#111",
    }}>
      {label}
      <span onClick={onRemove} style={{ cursor:"pointer", color:"#999", fontSize:13, lineHeight:1 }}>×</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   GRID CARD
───────────────────────────────────────── */
function GridCard({ p, onClick, onAddToCart }: { p: CatalogProduct; onClick: () => void; onAddToCart: () => void }) {
  return (
    <div onClick={onClick} style={{
      border:"1.5px solid #e5e7eb", borderRadius:6,
      padding:"12px 10px", background:"#fff",
      cursor:"pointer", transition:"box-shadow .2s",
      display:"flex", flexDirection:"column",
    }}
      onMouseEnter={e=>(e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.10)")}
      onMouseLeave={e=>(e.currentTarget.style.boxShadow="none")}
    >
      <div style={{ fontSize:10, fontWeight:600,
        color: p.stock==="en stock" ? "#16a34a" : "#d97706",
        display:"flex", alignItems:"center", gap:4, marginBottom:6 }}>
        <span style={{ width:6, height:6, borderRadius:"50%",
          background: p.stock==="en stock" ? "#16a34a" : "#d97706",
          display:"inline-block" }}/>
        {p.stock}
      </div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
        <LaptopImage type={p.img} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <Stars n={p.rating}/>
        <span style={{ fontSize:10, color:"#888" }}>Resenas ({p.reviews})</span>
      </div>
      <div style={{ fontSize:11, color:"#444", lineHeight:1.4, margin:"6px 0 4px", minHeight:30 }}>
        {p.name}
      </div>
      <div style={{ fontSize:11, color:"#aaa", textDecoration:"line-through" }}>${p.oldPrice}.00</div>
      <div style={{ fontSize:15, fontWeight:700, color:"#111" }}>${p.price}.00</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }}
        style={{
          marginTop:10,
          background:"#f5c518",
          border:"none",
          borderRadius:10,
          padding:"8px 12px",
          fontSize:12,
          fontWeight:700,
          cursor:"pointer",
        }}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   LIST CARD
───────────────────────────────────────── */
function ListCard({
  p,
  onClick,
  onToggleCompare,
  onToggleWish,
  onQuickView,
  onAddToCart,
  isCompared,
  isWished,
}: {
  p: CatalogProduct;
  onClick: () => void;
  onToggleCompare: () => void;
  onToggleWish: () => void;
  onQuickView: () => void;
  onAddToCart: () => void;
  isCompared: boolean;
  isWished: boolean;
}) {
  return (
    <div onClick={onClick} style={{
      border:"1.5px solid #e5e7eb", borderRadius:8,
      padding:"14px 16px", background:"#fff",
      display:"flex", gap:16, alignItems:"flex-start",
      marginBottom:10, cursor:"pointer",
    }}>
      <LaptopImage type={p.img}/>

      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"flex-start", marginBottom:4 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#111" }}>{p.name}</div>
          <div style={{
            fontSize:10,
            fontWeight:600,
            color: p.stock==="en stock" ? "#16a34a" : "#d97706",
            display:"flex",
            alignItems:"center",
            gap:4,
            whiteSpace:"nowrap",
          }}>
            <span style={{
              width:6,
              height:6,
              borderRadius:"50%",
              background: p.stock==="en stock" ? "#16a34a" : "#d97706",
              display:"inline-block",
            }}/>
            {p.stock}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <Stars n={p.rating}/>
          <span style={{ fontSize:10, color:"#888" }}>Resenas ({p.reviews})</span>
        </div>
        <div style={{ fontSize:11, color:"#aaa", textDecoration:"line-through" }}>${p.oldPrice}.00</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#111", marginBottom:10 }}>${p.price}.00</div>
        <button onClick={(e) => {
          e.stopPropagation();
          onAddToCart();
        }} style={{
          background:"#f5c518", border:"none", borderRadius:10,
          padding:"7px 18px", fontSize:12, fontWeight:700,
          cursor:"pointer", display:"flex", alignItems:"center", gap:6,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Agregar al carrito
        </button>
      </div>

      {/* specs col */}
      <div style={{
        minWidth:160, fontSize:11, color:"#555",
        borderLeft:"1px solid #eee", paddingLeft:16,
      }}>
        {[["CPU", p.cpu||"N/A"],["Featured", p.featured||"N/A"],["I/O Ports", p.vdPorts||"N/A"]].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ color:"#999" }}>{k}</span>
            <span style={{ fontWeight:500 }}>{v}</span>
          </div>
        ))}
        {/* action icons */}
        <div style={{ display:"flex", gap:8, marginTop:10, justifyContent:"flex-end" }}>
          <button
            title="Comparar"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            style={{
              width:28,
              height:28,
              borderRadius:20,
              border: isCompared ? "1.5px solid #f5c518" : "1.5px solid #ddd",
              background: isCompared ? "#fff7d1" : "#fff",
              color: isCompared ? "#111" : "#333",
              cursor:"pointer",
              fontSize:13,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
            }}
          >↔</button>
          <button
            title="Favoritos"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWish();
            }}
            style={{
              width:28,
              height:28,
              borderRadius:20,
              border: isWished ? "1.5px solid #f5c518" : "1.5px solid #ddd",
              background: isWished ? "#fff7d1" : "#fff",
              color: isWished ? "#111" : "#333",
              cursor:"pointer",
              fontSize:13,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
            }}
          >♡</button>
          <button
            title="Vista rapida"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            style={{
              width:28,
              height:28,
              borderRadius:20,
              border:"1.5px solid #ddd",
              background:"#fff",
              color:"#333",
              cursor:"pointer",
              fontSize:13,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
            }}
          >⊕</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGINATION
───────────────────────────────────────── */
function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / perPage);
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:6, margin:"20px 0 10px" }}>
      <button onClick={() => onChange(Math.max(1, page-1))} style={pgBtn(false)}>‹</button>
      {Array.from({length: pages}, (_, i) => (
        <button key={i} onClick={() => onChange(i+1)} style={pgBtn(page===i+1)}>{i+1}</button>
      ))}
      <button onClick={() => onChange(Math.min(pages, page+1))} style={pgBtn(false)}>›</button>
    </div>
  );
}
function pgBtn(active: boolean) {
  return {
    width:30, height:30, borderRadius:20,
    border: active ? "2px solid #f5c518" : "1.5px solid #ddd",
    background: active ? "#f5c518" : "#fff",
    fontWeight: active ? 700 : 400,
    cursor:"pointer" as const, fontSize:13,
  };
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function CatalogPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const ALL_PRODUCTS = useProductsStore((s) => s.products);

  const CATEGORIES = [
    { name: "PCs personalizadas", count: ALL_PRODUCTS.filter((p) => p.category === "PCs personalizadas").length },
    { name: "PCs todo en uno MSI", count: ALL_PRODUCTS.filter((p) => p.category === "PCs todo en uno MSI").length },
    { name: "PCs HP/Compaq", count: ALL_PRODUCTS.filter((p) => p.category === "PCs HP/Compaq").length },
  ];
  const BRANDS = ["Todas", ...Array.from(new Set(ALL_PRODUCTS.map((p) => p.brand)))];

  const { favorites, compared, isFavorite, isCompared, toggleFavorite, toggleCompare, openDrawer } = useSavedItems();
  const summaryRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [sortBy, setSortBy] = useState("Destacados");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [showStoreSummary, setShowStoreSummary] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [pendingSearch, setPendingSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [openSections, setOpenSections] = useState<Record<string,boolean>>({
    category:true, price:true, color:true, filter:true, brands:true,
  });

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1100;
  const gridColumns = viewportWidth < 560 ? "1fr" : viewportWidth < 980 ? "repeat(2, 1fr)" : viewportWidth < 1280 ? "repeat(3, 1fr)" : "repeat(4, 1fr)";

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToastMessage(""), 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const toggleSection = (k: string) =>
    setOpenSections(s => ({...s, [k]: !s[k]}));

  const removeFilter = (f: string) =>
    setActiveFilters(prev => prev.filter(x => x !== f));

  const toggleColor = (c: string) =>
    setSelectedColors(prev => prev.includes(c) ? prev.filter(x=>x!==c) : [...prev, c]);

  const togglePriceRange = (label: string) =>
    setSelectedPriceRanges((prev) => prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]);

  const handleSummaryToggle = () => {
    if (!showStoreSummary) {
      setShowStoreSummary(true);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }
    setShowStoreSummary(false);
  };

  const toSavedItem = (product: Product) => ({
    key: `product-${product.id}`,
    id: product.id,
    name: product.name,
    price: product.price,
    image: CATALOG_IMAGE_MAP[product.img] ?? laptop1,
    route: `/product/${product.id}`,
  });

  const toggleCompared = (id: number) => {
    const product = ALL_PRODUCTS.find((item) => item.id === id);
    if (!product) return;
    const wasAdded = toggleCompare(toSavedItem(product));
    showToast(wasAdded ? "Producto agregado para comparar" : "Producto removido de comparar");
  };

  const toggleWish = (id: number) => {
    const product = ALL_PRODUCTS.find((item) => item.id === id);
    if (!product) return;
    const wasAdded = toggleFavorite(toSavedItem(product));
    showToast(wasAdded ? "Producto agregado a favoritos" : "Producto removido de favoritos");
  };

  const addCatalogProductToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: CATALOG_IMAGE_MAP[product.img] ?? laptop1 });
    showToast("Producto agregado al carrito");
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedColors([]);
    setSelectedPriceRanges([]);
    setSelectedBrand("Todas");
    setPendingSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const normalizedSearch = appliedSearch.trim().toLowerCase();

    const baseFiltered = ALL_PRODUCTS.filter((p) => {
      if (activeFilters.length && !activeFilters.includes(p.category)) return false;
      if (selectedColors.length && !selectedColors.includes(p.color)) return false;
      if (selectedBrand !== "Todas" && p.brand !== selectedBrand) return false;
      if (selectedPriceRanges.length) {
        const matchesPrice = selectedPriceRanges.some((label) => {
          const range = PRICE_RANGES.find((item) => item.label === label);
          if (!range) return false;
          return p.price >= range.min && p.price <= range.max;
        });
        if (!matchesPrice) return false;
      }
      if (normalizedSearch) {
        const haystack = `${p.name} ${p.brand} ${p.cpu} ${p.featured}`.toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      return true;
    });

    const sorted = [...baseFiltered];
    switch (sortBy) {
      case "Precio: menor a mayor":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "Precio: mayor a menor":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "Nombre":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      case "Mejor valorados":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      default:
        sorted.sort((a, b) => a.id - b.id);
    }

    return sorted;
  }, [activeFilters, selectedColors, selectedPriceRanges, selectedBrand, appliedSearch, sortBy]);

  const paginated = filtered.slice((page-1)*perPage, page*perPage);
  const comparedProducts = ALL_PRODUCTS.filter((p) => isCompared(`product-${p.id}`));
  const wishedProducts = ALL_PRODUCTS.filter((p) => isFavorite(`product-${p.id}`));
  const currentStart = filtered.length === 0 ? 0 : (page - 1) * perPage + 1;
  const currentEnd = Math.min(page * perPage, filtered.length);

  return (
    <>
      <style>{`
        .cat-root { font-family:'Open Sans',sans-serif; background:#f5f6f7; min-height:100vh; }
        select { font-family:'Satoshi',sans-serif; }
        button { font-family:'Open Sans',sans-serif; }
        .sb-section { background:#fff; border:1.5px solid #e5e7eb; border-radius:24px; margin-bottom:10px; overflow:hidden; }
        .sb-section-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; font-size:12px; font-weight:700; color:#111; background:#fff; border:none; width:100%; }
        .sb-section-body { padding:4px 14px 12px; }
        .cat-item { display:flex; justify-content:space-between; font-size:12px; color:#444; padding:4px 0; cursor:pointer; }
        .cat-item:hover { color:#f5c518; }
        .cat-count { color:#999; font-size:11px; }
        .catalog-toast { position:fixed; right:20px; bottom:20px; z-index:90; background:#111; color:#fff; padding:12px 16px; border-radius:14px; box-shadow:0 12px 32px rgba(0,0,0,.18); font-size:12px; font-weight:700; opacity:0; transform:translate3d(0,16px,0) scale(.98); filter:blur(1px); pointer-events:none; transition:opacity .28s ease, transform .32s cubic-bezier(.18,.86,.26,1), filter .28s ease; }
        .catalog-toast.show { opacity:1; transform:translate3d(0,0,0) scale(1); filter:blur(0); }
        @media (max-width: 767px) { .catalog-toast { left:14px; right:14px; bottom:14px; text-align:center; } }
      `}</style>

      <div className="cat-root">
        {/* Top banner below navbar */}
        <div style={{ background:"#fff", padding:0, margin:0 }}>
          <img
            src={topBanner}
            alt="Promocion superior"
            style={{
              width:"100%",
              height:isMobile ? "72px" : isTablet ? "96px" : "120px",
              display:"block",
              objectFit:"cover",
              objectPosition:"center",
            }}
          />
        </div>

        {/* Breadcrumb */}
        <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:isMobile ? "8px 14px" : "8px 20px", fontSize:11, color:"#888", display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          <Link to="/" style={{color:"#888",textDecoration:"none"}}>Inicio</Link> ›
          <Link to="/catalog" style={{color:"#888",textDecoration:"none"}}>Catalogo</Link> ›
          <span style={{color:"#f5c518"}}>Equipos destacados ({ALL_PRODUCTS.length})</span>
        </div>

        <div style={{ padding:isMobile ? "14px" : "16px 20px" }}>
          {/* Page title + toolbar */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:isMobile ? "flex-start" : "center", flexDirection:isMobile ? "column" : "row", gap:isMobile ? 8 : 0, marginBottom:12 }}>
            <h1 style={{ fontFamily:"'Sansita',sans-serif", fontSize:22, fontWeight:800, color:"#111" }}>
              Catalogo de equipos
            </h1>
          </div>

          {/* Toolbar row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:isMobile ? "stretch" : "center", flexDirection:isMobile ? "column" : "row", gap:12, marginBottom:14 }}>
            <span style={{ fontSize:12, color:"#888", display:"flex", flexWrap:"wrap", alignItems:"center" }}>
              <button onClick={() => navigate(-1)} style={{ border:"none", background:"transparent", cursor:"pointer", color:"#888", fontSize:12, padding:0 }}>
                ← Volver
              </button>
              <span>&nbsp;&nbsp; Productos {currentStart}-{currentEnd} de {filtered.length}</span>
            </span>
            <div style={{ display:"flex", gap:10, alignItems:isMobile ? "stretch" : "center", flexWrap:"wrap", width:isMobile ? "100%" : "auto" }}>
              {/* Sort */}
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                <span style={{color:"#666"}}>Ordenar por</span>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                  style={{ padding:"5px 10px", borderRadius:15, border:"1.5px solid #ddd", fontSize:12, cursor:"pointer" }}>
                  {["Destacados","Precio: menor a mayor","Precio: mayor a menor","Nombre","Mejor valorados"].map(o=>(
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              {/* Per page */}
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                <span style={{color:"#666"}}>Mostrar</span>
                <select value={perPage} onChange={e=>{setPerPage(Number(e.target.value));setPage(1);}}
                  style={{ padding:"5px 10px", borderRadius:15, border:"1.5px solid #ddd", fontSize:12, cursor:"pointer" }}>
                  {[10,20,30,50].map(o=><option key={o}>{o} por pagina</option>)}
                </select>
              </div>
              {/* View toggle */}
              <div style={{ display:"flex", border:"1.5px solid #ddd", borderRadius:4, overflow:"hidden" }}>
                {/* Grid 2x2 icon */}
                <button onClick={()=>setViewMode("grid")} title="Vista en cuadricula"
                  style={{ padding:"5px 9px", border:"none", background: viewMode==="grid" ? "#f5c518" : "#fff", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1" fill={viewMode==="grid"?"#111":"#888"}/>
                    <rect x="9" y="1" width="6" height="6" rx="1" fill={viewMode==="grid"?"#111":"#888"}/>
                    <rect x="1" y="9" width="6" height="6" rx="1" fill={viewMode==="grid"?"#111":"#888"}/>
                    <rect x="9" y="9" width="6" height="6" rx="1" fill={viewMode==="grid"?"#111":"#888"}/>
                  </svg>
                </button>
                {/* List icon */}
                <button onClick={()=>setViewMode("list")} title="Vista en lista"
                  style={{ padding:"5px 9px", border:"none", borderLeft:"1.5px solid #ddd", background: viewMode==="list" ? "#f5c518" : "#fff", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2" width="14" height="3" rx="1" fill={viewMode==="list"?"#111":"#888"}/>
                    <rect x="1" y="7" width="14" height="3" rx="1" fill={viewMode==="list"?"#111":"#888"}/>
                    <rect x="1" y="12" width="14" height="3" rx="1" fill={viewMode==="list"?"#111":"#888"}/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
            {activeFilters.map(f=>(
              <FilterPill key={f} label={f} onRemove={()=>removeFilter(f)}/>
            ))}
            {selectedColors.map((color) => (
              <FilterPill key={color} label={`Color: ${color}`} onRemove={() => toggleColor(color)} />
            ))}
            {selectedPriceRanges.map((range) => (
              <FilterPill key={range} label={range} onRemove={() => togglePriceRange(range)} />
            ))}
            {selectedBrand !== "Todas" && <FilterPill label={`Marca: ${selectedBrand}`} onRemove={() => setSelectedBrand("Todas")} />}
            {appliedSearch && <FilterPill label={`Buscar: ${appliedSearch}`} onRemove={() => { setAppliedSearch(""); setPendingSearch(""); }} />}
            {(activeFilters.length > 0 || selectedColors.length > 0 || selectedPriceRanges.length > 0 || selectedBrand !== "Todas" || !!appliedSearch) && (
              <button onClick={clearAllFilters}
                style={{ fontSize:11, fontWeight:700, color:"#cc0000", background:"none", border:"none", cursor:"pointer" }}>
                Limpiar todo
              </button>
            )}
          </div>

          {/* Main layout: sidebar + content */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : isTablet ? "240px 1fr" : "200px 1fr", gap:16, alignItems:"start" }}>

            {/* ── SIDEBAR ── */}
            <aside>
              {/* Clear Filter btn */}
              <div className="sb-section" style={{ padding:"10px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, fontSize:11, fontWeight:700, color:"#111" }}>Filtros</div>
                <button style={{
                  width:"100%", padding:"7px 0", borderRadius:20,
                  border:"1.5px solid #ddd", background:"#fff",
                  fontSize:12, fontWeight:600, cursor:"pointer",
                }} onClick={clearAllFilters}>Limpiar filtros</button>
              </div>

              {/* Category */}
              <div className="sb-section">
                <button className="sb-section-header" onClick={()=>toggleSection("category")}>
                  Categoria <span>{openSections.category?"▲":"▼"}</span>
                </button>
                {openSections.category && (
                  <div className="sb-section-body">
                    {CATEGORIES.map(c=>(
                      <div key={c.name} className="cat-item"
                        onClick={()=>setActiveFilters(prev=>
                          prev.includes(c.name) ? prev.filter(x=>x!==c.name) : [...prev,c.name]
                        )}
                        style={{ color: activeFilters.includes(c.name) ? "#f5c518" : "#444" }}>
                        <span>{c.name}</span>
                        <span className="cat-count">{c.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="sb-section">
                <button className="sb-section-header" onClick={()=>toggleSection("price")}>
                  Precio <span>{openSections.price?"▲":"▼"}</span>
                </button>
                {openSections.price && (
                  <div className="sb-section-body">
                    {PRICE_RANGES.map((r)=> (
                      <div key={r.label} className="cat-item" onClick={() => togglePriceRange(r.label)} style={{ color: selectedPriceRanges.includes(r.label) ? "#f5c518" : "#444" }}>
                        <span>{r.label}</span>
                        <span className="cat-count">{ALL_PRODUCTS.filter((p) => p.price >= r.min && p.price <= r.max).length}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="sb-section">
                <button className="sb-section-header" onClick={()=>toggleSection("color")}>
                  Color <span>{openSections.color?"▲":"▼"}</span>
                </button>
                {openSections.color && (
                  <div className="sb-section-body" style={{ display:"flex", gap:8, paddingTop:4 }}>
                    {["negro","rojo","blanco"].map(c=>(
                      <div key={c} onClick={()=>toggleColor(c)}
                        style={{
                          width:22, height:22, borderRadius:"50%",
                          background: c==="negro" ? "#111" : c === "rojo" ? "#cc2222" : "#f3f4f6",
                          border: selectedColors.includes(c) ? "3px solid #f5c518" : "2px solid #ddd",
                          cursor:"pointer",
                        }}/>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Name / Apply */}
              <div className="sb-section">
                <button className="sb-section-header" onClick={()=>toggleSection("filter")}>
                  Buscar producto <span>{openSections.filter?"▲":"▼"}</span>
                </button>
                {openSections.filter && (
                  <div className="sb-section-body">
                    <input
                      value={pendingSearch}
                      onChange={(e) => setPendingSearch(e.target.value)}
                      placeholder="Marca, modelo o caracteristica"
                      style={{ width:"100%", padding:"8px 12px", borderRadius:12, border:"1.5px solid #ddd", fontSize:12, marginBottom:8 }}
                    />
                    <button style={{
                      width:"100%", padding:"7px 0", borderRadius:20,
                      border:"none", background:"#f5c518",
                      fontSize:12, fontWeight:700, cursor:"pointer",
                    }} onClick={() => { setAppliedSearch(pendingSearch.trim()); setPage(1); }}>Aplicar busqueda</button>
                  </div>
                )}
              </div>

              {/* Brands */}
              <div className="sb-section">
                <button className="sb-section-header" onClick={()=>toggleSection("brands")}>
                  Marcas <span>{openSections.brands?"▲":"▼"}</span>
                </button>
                {openSections.brands && (
                  <div className="sb-section-body">
                    <button style={{
                      width:"100%", padding:"7px 0", borderRadius:20,
                      border:"1.5px solid #ddd", background:"#fff",
                      fontSize:12, fontWeight:600, cursor:"pointer", marginBottom:8,
                    }} onClick={() => setSelectedBrand("Todas")}>Todas las marcas</button>
                    <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }} style={{ width:"100%", padding:"7px 10px", borderRadius:12, border:"1.5px solid #ddd", fontSize:12, marginBottom:8 }}>
                      {BRANDS.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                    <div style={{
                      display:"grid",
                      gridTemplateColumns:"repeat(2, minmax(0, 1fr))",
                      gap:8,
                      alignItems:"center",
                    }}>
                      {BRAND_LOGOS.map((logo, index) => (
                        <div
                          key={index}
                          style={{
                            height:50,
                            border:"1px solid #efefef",
                            borderRadius:8,
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center",
                            background:"#fff",
                          }}
                        >
                          <img
                            src={logo}
                            alt={`Brand logo ${index + 1}`}
                            style={{ maxWidth:"88%", maxHeight:"78%", objectFit:"contain" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Compare Products */}
              <div className="sb-section" style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:12, fontWeight:700, marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                  <span>Comparar productos ({compared.length})</span>
                  <button onClick={() => openDrawer("compare")} style={{ border:"1px solid #ddd", background:"#fff", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Abrir panel</button>
                </div>
                {comparedProducts.length === 0 ? (
                  <div style={{ fontSize:11, color:"#888" }}>No tienes productos para comparar.</div>
                ) : (
                  <div style={{ display:"grid", gap:8 }}>
                    {comparedProducts.map((product) => (
                      <div key={product.id} style={{ border:"1px solid #efefef", borderRadius:12, padding:8, display:"grid", gridTemplateColumns:"56px 1fr auto", gap:8, alignItems:"center" }}>
                        <LaptopImage type={product.img} small />
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#111", lineHeight:1.35 }}>{product.name}</div>
                          <div style={{ fontSize:11, color:"#666" }}>${product.price}.00</div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <button onClick={() => navigate(`/product/${product.id}`)} style={{ border:"1px solid #ddd", background:"#fff", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Ver</button>
                          <button onClick={() => toggleCompared(product.id)} style={{ border:"1px solid #f1c40f", background:"#fff8d6", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Quitar</button>
                        </div>
                      </div>
                    ))}
                    {comparedProducts.length >= 2 && (
                      <div style={{ border:"1px dashed #e5e7eb", borderRadius:12, padding:10, fontSize:11, color:"#555", lineHeight:1.6 }}>
                        <div style={{ fontWeight:700, color:"#111", marginBottom:4 }}>Resumen rapido</div>
                        <div>CPU: {comparedProducts.map((p) => p.cpu || "N/A").join(" vs ")}</div>
                        <div>Precio: {comparedProducts.map((p) => `$${p.price}`).join(" vs ")}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* My Wish List */}
              <div className="sb-section" style={{ padding:"12px 14px" }}>
                <div style={{ fontSize:12, fontWeight:700, marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                  <span>Mi lista de deseos ({favorites.length})</span>
                  <button onClick={() => openDrawer("favorites")} style={{ border:"1px solid #ddd", background:"#fff", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Abrir panel</button>
                </div>
                {wishedProducts.length === 0 ? (
                  <div style={{ fontSize:11, color:"#888" }}>No tienes productos guardados.</div>
                ) : (
                  <div style={{ display:"grid", gap:8 }}>
                    {wishedProducts.map((product) => (
                      <div key={product.id} style={{ border:"1px solid #efefef", borderRadius:12, padding:8, display:"grid", gridTemplateColumns:"56px 1fr auto", gap:8, alignItems:"center" }}>
                        <LaptopImage type={product.img} small />
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#111", lineHeight:1.35 }}>{product.name}</div>
                          <div style={{ fontSize:11, color:"#666" }}>${product.price}.00</div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <button onClick={() => navigate(`/product/${product.id}`)} style={{ border:"1px solid #ddd", background:"#fff", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Ver</button>
                          <button onClick={() => toggleWish(product.id)} style={{ border:"1px solid #f1c40f", background:"#fff8d6", borderRadius:8, cursor:"pointer", fontSize:10, padding:"4px 8px" }}>Quitar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promo banner */}
              <div style={{ borderRadius:8, overflow:"hidden", background:"#fff" }}>
                <img
                  src={promoImage}
                  alt="Promocion"
                  style={{ width:"100%", display:"block", objectFit:"cover" }}
                />
              </div>
            </aside>

            {/* ── PRODUCT CONTENT ── */}
            <main>
              {viewMode === "grid" ? (
                <div style={{
                  display:"grid",
                  gridTemplateColumns:gridColumns,
                  gap:12,
                }}>
                  {paginated.map(p => <GridCard key={p.id} p={p} onClick={() => navigate(`/product/${p.id}`)} onAddToCart={() => addCatalogProductToCart(p)}/>) }
                </div>
              ) : (
                <div>
                  {paginated.map((p) => (
                    <ListCard
                      key={p.id}
                      p={p}
                      onClick={() => navigate(`/product/${p.id}`)}
                      onToggleCompare={() => toggleCompared(p.id)}
                      onToggleWish={() => toggleWish(p.id)}
                      onQuickView={() => setQuickViewProduct(p)}
                      onAddToCart={() => addCatalogProductToCart(p)}
                      isCompared={isCompared(`product-${p.id}`)}
                      isWished={isFavorite(`product-${p.id}`)}
                    />
                  ))}
                </div>
              )}

              <Pagination
                page={page}
                total={filtered.length}
                perPage={perPage}
                onChange={p => { setPage(p); window.scrollTo(0,0); }}
              />

              {/* More button */}
              <div style={{ textAlign:"center", marginTop:8, marginBottom:20 }}>
                <button style={{
                  padding:"8px 28px", borderRadius:10,
                  border:"1.5px solid #ddd", background:"#fff",
                  fontSize:12, fontWeight:600, cursor:"pointer",
                }}
                  onClick={handleSummaryToggle}
                  aria-expanded={showStoreSummary}
                >
                  {showStoreSummary ? "Menos" : "Mas"}
                </button>
              </div>

              {/* Store summary with animated reveal */}
              <div ref={summaryRef} style={{
                maxHeight: showStoreSummary ? 180 : 0,
                opacity: showStoreSummary ? 1 : 0,
                transform: showStoreSummary ? "translateY(0)" : "translateY(-10px)",
                filter: showStoreSummary ? "blur(0)" : "blur(1px)",
                overflow:"hidden",
                transition:"max-height .35s ease, opacity .25s ease, transform .28s ease, filter .28s ease",
                marginTop: showStoreSummary ? 10 : 0,
                marginBottom: showStoreSummary ? 16 : 0,
                scrollMarginTop: 16,
              }}>
                <div style={{
                  border:"1.5px solid #e5e7eb",
                  borderRadius:10,
                  background:"#fff",
                  padding:"12px 14px",
                  fontSize:12,
                  color:"#666",
                  lineHeight:1.6,
                }}>
                  <span style={{ fontWeight:700, color:"#111" }}>Por que comprar en Vendo Laptops:</span>
                  {" "}
                  equipos seleccionados y verificados, precio justo, soporte humano real y entrega confiable.
                  Tu compra es rapida, segura y con acompanamiento antes y despues del checkout.
                </div>
              </div>

              {/* Bottom support strip */}
              <div style={{
                display:"grid", gridTemplateColumns:isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)",
                gap:16, background:"#fff",
                borderRadius:8, padding:"24px 20px",
                border:"1.5px solid #e5e7eb",
                marginTop:8,
              }}>
                {[
                  {
                    icon:(
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 17h10"/>
                        <path d="M6 17V9h7a3 3 0 0 1 3 3v5"/>
                        <circle cx="7" cy="19" r="2"/>
                        <circle cx="16" cy="19" r="2"/>
                        <path d="M16 10h4"/>
                        <path d="M20 6v10"/>
                      </svg>
                    ),
                    title:"Soporte para productos",
                    desc:"Hasta 3 anos de garantia en sitio disponibles para una compra con respaldo.",
                  },
                  {
                    icon:(
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21a8 8 0 0 0-16 0"/>
                        <circle cx="12" cy="8" r="4"/>
                      </svg>
                    ),
                    title:"Cuenta personal",
                    desc:"Con grandes descuentos, entrega gratis y soporte dedicado para ti.",
                  },
                  {
                    icon:(
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 10v10"/>
                        <path d="M12 20h6.2a2 2 0 0 0 1.95-1.54l1.1-5A2 2 0 0 0 19.3 11H14V6.8A1.8 1.8 0 0 0 12.2 5L9 10v10h3z"/>
                        <path d="M7 10H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"/>
                      </svg>
                    ),
                    title:"Ahorros increibles",
                    desc:"Hasta 10% de descuento en productos nuevos con precio competitivo.",
                  },
                ].map(item=>(
                  <div key={item.title} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:8 }}>
                    <div style={{
                      width:50, height:50, borderRadius:"50%",
                      background:"#f5c518", display:"flex",
                      alignItems:"center", justifyContent:"center",
                      fontSize:22,
                    }}>{item.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#111" }}>{item.title}</div>
                    <div style={{ fontSize:11, color:"#888", lineHeight:1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {quickViewProduct && (
                <div
                  onClick={() => setQuickViewProduct(null)}
                  style={{
                    position:"fixed",
                    inset:0,
                    background:"rgba(0,0,0,.45)",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    zIndex:60,
                    padding:16,
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width:"min(540px, 100%)",
                      background:"#fff",
                      borderRadius:12,
                      border:"1.5px solid #e5e7eb",
                      padding:16,
                    }}
                  >
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:"#111" }}>Vista rapida</div>
                      <button
                        onClick={() => setQuickViewProduct(null)}
                        style={{ border:"none", background:"transparent", cursor:"pointer", fontSize:18, lineHeight:1 }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "130px 1fr", gap:12, alignItems:"center" }}>
                      <LaptopImage type={quickViewProduct.img} />
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:"#111", marginBottom:6 }}>{quickViewProduct.name}</div>
                        <div style={{ fontSize:11, color:"#666", marginBottom:4 }}>{quickViewProduct.brand} · {quickViewProduct.category}</div>
                        <div style={{ fontSize:11, color:"#999", textDecoration:"line-through" }}>${quickViewProduct.oldPrice}.00</div>
                        <div style={{ fontSize:20, fontWeight:800, color:"#111" }}>${quickViewProduct.price}.00</div>
                        <button onClick={() => addCatalogProductToCart(quickViewProduct)} style={{ marginTop:10, padding:"8px 14px", border:"none", borderRadius:10, background:"#f5c518", fontSize:12, fontWeight:700, cursor:"pointer" }}>Agregar al carrito</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>

          </div>
        </div>

        <div className={`catalog-toast${toastMessage ? " show" : ""}`}>{toastMessage}</div>
      </div>
    </>
  );
}
