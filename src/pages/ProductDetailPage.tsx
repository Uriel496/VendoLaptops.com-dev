import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSavedItems } from "../context/SavedItemsContext";
import { products } from "../constants/data";
import {
  FALLBACK_DETAIL,
  PRODUCT_DETAILS,
  getThumbsForType,
  type DetailColor,
} from "../constants/productDetailData";

type TabKey = "technical" | "similar" | "comments";
type PaymentMode = "total" | "installments";

type CommentItem = {
  id: number;
  avatar: string;
  avatarBg: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
};

function Stars({ n, size = 11 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12" fill={s <= Math.round(n) ? "#f5c518" : "#ddd"}>
          <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5" />
        </svg>
      ))}
    </span>
  );
}

const INSTALLMENTS = [3, 6, 12, 18];

function loopSlice<T>(items: T[], start: number, count: number): T[] {
  if (items.length === 0) return [];
  return Array.from({ length: Math.min(count, items.length) }, (_, i) => items[(start + i) % items.length]);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, isCompared, toggleFavorite, toggleCompare } = useSavedItems();

  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("technical");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("installments");
  const [selectedInstallment, setSelectedInstallment] = useState(3);
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
  const [similarIndex, setSimilarIndex] = useState(0);
  const [boughtIndex, setBoughtIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [sideMessage, setSideMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const toastTimer = useRef<number | null>(null);

  const requestedId = Number(id ?? products[0]?.id ?? 1);
  const activeProduct = products.find((p) => p.id === requestedId) ?? products[0];
  const detail = PRODUCT_DETAILS[activeProduct.id] ?? FALLBACK_DETAIL;

  const [comments, setComments] = useState<CommentItem[]>([]);

  const THUMBS = detail.thumbs.length > 0 ? detail.thumbs : getThumbsForType(activeProduct.img);
  const SPECS_SHORT = detail.specsShort;
  const SPECS_FULL = detail.specsFull;
  const BOUGHT = detail.bought;
  const REVIEW_VIDEOS = detail.reviewVideos;
  const SIMILAR = products
    .filter((p) => p.id !== activeProduct.id)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      key: `product-${p.id}`,
      route: `/product/${p.id}`,
      name: p.name,
      price: p.price,
      rating: p.rating,
      img: getThumbsForType(p.img)[0],
    }));

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1100;
  const similarWindowSize = isMobile ? 1 : isTablet ? 2 : 4;
  const boughtWindowSize = isMobile ? 1 : isTablet ? 2 : 4;
  const reviewWindowSize = isMobile ? 1 : isTablet ? 2 : 3;

  const activeProductKey = `product-${activeProduct.id}`;
  const mainThumb = THUMBS[activeThumb] ?? THUMBS[0];
  const activeProductSaved = {
    key: activeProductKey,
    id: activeProduct.id,
    name: detail.displayName,
    price: activeProduct.price,
    image: mainThumb,
    route: `/product/${activeProduct.id}`,
  };

  const monthlyPrice = Math.round(activeProduct.price / selectedInstallment);
  const monthlyOrTotalLabel = paymentMode === "total" ? `${activeProduct.price}.00 total` : `${monthlyPrice}.00 /mes`;

  const visibleSimilar = loopSlice(SIMILAR, similarIndex, similarWindowSize);
  const visibleBought = loopSlice(BOUGHT, boughtIndex, boughtWindowSize);
  const visibleReviews = loopSlice(REVIEW_VIDEOS, reviewIndex, reviewWindowSize);

  const averageRating = comments.length ? comments.reduce((sum, item) => sum + item.rating, 0) / comments.length : 0;
  const ratingBuckets = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const total = comments.filter((item) => Math.round(item.rating) === star).length;
        return { star, total, pct: comments.length ? (total / comments.length) * 100 : 0 };
      }),
    [comments]
  );

  useEffect(() => {
    setActiveThumb(0);
    setSelectedColor(0);
    setActiveTab("technical");
    setPaymentMode("installments");
    setSelectedInstallment(3);
    setShowMoreSpecs(false);
    setCommentText("");
    setCommentRating(0);
    setHoveredRating(0);
    setExpandedComments({});
    setLikedComments({});
    setSimilarIndex(0);
    setBoughtIndex(0);
    setReviewIndex(0);
    setComments(
      detail.comments.map((c, idx) => ({
        id: idx + 1,
        avatar: c.avatar,
        avatarBg: c.avatarBg,
        name: c.name,
        date: c.date,
        rating: c.rating,
        text: c.text,
        likes: c.likes,
        dislikes: c.dislikes,
      }))
    );
  }, [activeProduct.id]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2200);
  };

  const showSideFeedback = (msg: string) => {
    setSideMessage(msg);
    window.setTimeout(() => setSideMessage(""), 1400);
  };

  const handleAddToCart = () => {
    addToCart({ id: activeProduct.id, name: detail.displayName, price: activeProduct.price, image: mainThumb });
    showToast("Producto agregado al carrito");
    showSideFeedback("Producto agregado al carrito");
  };

  const handleInstallmentSelect = (months: number) => {
    if (paymentMode === "total") return;
    setSelectedInstallment(months);
  };

  const handleSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) {
      showToast("Escribe un comentario antes de enviarlo");
      return;
    }
    if (commentRating === 0) {
      showToast("Selecciona una calificacion en estrellas");
      return;
    }

    const today = new Date();
    const dateLabel = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const newComment: CommentItem = {
      id: comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      avatar: "TU",
      avatarBg: "#f5e3b3",
      name: "Tu opinion",
      date: dateLabel,
      rating: commentRating,
      text: trimmed,
      likes: 0,
      dislikes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setCommentRating(0);
    setHoveredRating(0);
    showToast("Comentario publicado correctamente");
  };

  const addRelatedToCart = (name: string, price: number, image: string) => {
    const generatedId = 100000 + Math.abs(name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0));
    addToCart({ id: generatedId, name, price, image });
    showToast(`${name} se agrego al carrito`);
  };

  const toggleSavedFavorite = (item: { key: string; id?: number; name: string; price: number; image?: string; route?: string }) => {
    const wasAdded = toggleFavorite(item);
    showToast(wasAdded ? "Producto agregado a favoritos" : "Producto removido de favoritos");
  };

  const toggleSavedCompare = (item: { key: string; id?: number; name: string; price: number; image?: string; route?: string }) => {
    const wasAdded = toggleCompare(item);
    showToast(wasAdded ? "Producto agregado para comparar" : "Producto removido de comparar");
  };

  const colorOptions: DetailColor[] = detail.colors;

  return (
    <>
      <style>{`
        .pd { font-family: 'Satoshi', sans-serif; background: #f5f6f7; min-height: 100vh; }
        .card { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 14px; border: 1px solid #e5e7eb; }
        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; color: #888; font-family: 'Satoshi', sans-serif; }
        .tab-btn.on { color: #c8960a; border-bottom-color: #c8960a; }
        .spec-row { display: flex; padding: 8px 12px; font-size: 12.5px; }
        .spec-row:nth-child(even) { background: #f9f9f9; }
        .spec-k { width: 160px; color: #888; flex-shrink: 0; }
        .spec-v { color: #333; }
        .inst-btn { border: 1.5px solid #ddd; border-radius: 25px; padding: 5px 8px; font-size: 11px; font-weight: 700; cursor: pointer; background: #fff; min-width: 48px; }
        .inst-btn.on { background: #f5c518; border-color: #f5c518; }
        .thumb-btn { border: 2px solid transparent; border-radius: 6px; padding: 2px; cursor: pointer; background: #f5f6f7; }
        .thumb-btn.on { border-color: #c8960a; }
        .sim-card { border: 1.5px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; }
        .cmt-card { background: #fff; border: 1px solid #efefef; border-radius: 8px; padding: 16px 18px; margin-bottom: 12px; }
        .show-more { background: none; border: none; color: #c8960a; font-size: 11.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 3px; }
        .nav-arrow { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #ddd; background: #fff; cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; }
        .fbar { height: 6px; border-radius: 3px; background: #eee; overflow: hidden; }
        .ffill { height: 100%; background: linear-gradient(90deg, #f5c518, #e8a000); border-radius: 3px; }
        .buy-btn { width: 100%; padding: 11px 0; border-radius: 25px; background: #c8960a; border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 8px; }
        .cart-btn { width: 100%; padding: 10px 0; border-radius: 25px; background: #fff; border: 2px solid #c8960a; color: #c8960a; font-size: 14px; font-weight: 700; cursor: pointer; }
        .detail-toast { position: fixed; right: 20px; bottom: 20px; z-index: 95; background: #111; color: #fff; padding: 12px 16px; border-radius: 14px; box-shadow: 0 12px 32px rgba(0,0,0,.18); font-size: 12px; font-weight: 700; opacity: 0; transform: translate3d(0,16px,0) scale(.98); filter: blur(1px); pointer-events: none; transition: opacity .28s ease, transform .32s cubic-bezier(.18,.86,.26,1), filter .28s ease; }
        .detail-toast.show { opacity: 1; transform: translate3d(0,0,0) scale(1); filter: blur(0); }
        @media (max-width: 767px) { .detail-toast { left: 14px; right: 14px; bottom: 14px; text-align: center; } }
      `}</style>

      <div className="pd">
        <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: isMobile ? "8px 14px" : "8px 24px", fontSize: 11, color: "#888", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[{ label: "Inicio", path: "/" }, { label: "Productos", path: "/catalog" }, { label: detail.category, path: "/catalog" }].map((b, i, arr) => (
            <span key={b.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link to={b.path} style={{ color: i === arr.length - 1 ? "#c8960a" : "#888", textDecoration: "none" }}>{b.label}</Link>
              {i < arr.length - 1 && <span style={{ color: "#ccc" }}>›</span>}
            </span>
          ))}
        </div>

        <div style={{ padding: isMobile ? "12px" : isTablet ? "14px 18px" : "18px 24px", maxWidth: 1200, margin: "0 auto" }}>
          <div className="card" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1.15fr 268px", gap: isMobile ? 14 : 22 }}>
            <div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 10, alignItems: "center", justifyContent: isMobile ? "center" : "flex-start" }}>
                  <button title="Favorito" onClick={() => toggleSavedFavorite(activeProductSaved)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite(activeProductKey) ? "#c8960a" : "none"} stroke={isFavorite(activeProductKey) ? "#c8960a" : "#bbb"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                  <button title="Comparar" onClick={() => toggleSavedCompare(activeProductSaved)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isCompared(activeProductKey) ? "#c8960a" : "#bbb"} strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
                  </button>
                  <span style={{ fontSize: 10, color: "#999", minHeight: 12 }}>{sideMessage}</span>
                </div>
                <div style={{ flex: 1, background: "#f5f6f7", borderRadius: 8, padding: "18px 12px", minHeight: isMobile ? 190 : 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={mainThumb} alt="Producto" style={{ width: isMobile ? 250 : 320, height: isMobile ? 170 : 210, objectFit: "contain", display: "block" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 10, justifyContent: "center" }}>
                {THUMBS.map((t, i) => (
                  <button key={i} className={`thumb-btn${activeThumb === i ? " on" : ""}`} onClick={() => setActiveThumb(i)}>
                    <img src={t} alt={`Miniatura ${i + 1}`} style={{ width: 48, height: 32, objectFit: "contain", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: "#111", lineHeight: 1.3, marginBottom: 8 }}>{detail.displayName}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 14 }}>
                <span style={{ background: "#f5c518", borderRadius: 25, padding: "2px 7px", fontSize: 12, fontWeight: 700 }}>★ {activeProduct.rating.toFixed(1)}</span>
                <span style={{ fontSize: 11, color: "#888" }}>{detail.sold} vendidos</span>
                <span style={{ fontSize: 11, color: "#888" }}>({activeProduct.reviews} resenas)</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: "#666" }}>Selecciona color</span>
                {colorOptions.map((col, i) => (
                  <div key={i} onClick={() => setSelectedColor(i)} style={{ width: 22, height: 22, borderRadius: "50%", background: col.hex, cursor: "pointer", border: selectedColor === i ? "2px solid #c8960a" : "2px solid transparent", outline: selectedColor === i ? "2.5px solid #f5c51866" : "none" }} />
                ))}
              </div>

              <div style={{ border: "1px solid #f0f0f0", borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
                {SPECS_SHORT.map((s) => (
                  <div className="spec-row" key={s.k}><span className="spec-k">{s.k}</span><span className="spec-v">{s.v}</span></div>
                ))}
              </div>
              <button className="show-more" onClick={() => setActiveTab("technical")}>Ver mas</button>
            </div>

            <div style={{ borderLeft: isTablet ? "none" : "1px solid #f0f0f0", borderTop: isTablet ? "1px solid #f0f0f0" : "none", paddingLeft: isTablet ? 0 : 18, paddingTop: isTablet ? 16 : 0, gridColumn: isTablet ? "1 / -1" : "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>${activeProduct.price}.00</span>
                <span style={{ background: "#ff4444", color: "#fff", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>-12%</span>
              </div>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 14 }}>precio anterior: ${activeProduct.oldPrice}.00</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                  <input type="radio" name="pay" style={{ accentColor: "#c8960a" }} checked={paymentMode === "total"} onChange={() => setPaymentMode("total")} />
                  Pagar ahora
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 3, cursor: "pointer" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                    <input type="radio" name="pay" style={{ accentColor: "#c8960a" }} checked={paymentMode === "installments"} onChange={() => setPaymentMode("installments")} />
                    Comprar a plazos
                  </span>
                  <span style={{ fontSize: 10, color: "#aaa", marginLeft: 20 }}>elige el plazo de tus cuotas</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                {INSTALLMENTS.map((m) => (
                  <button key={m} className={`inst-btn${selectedInstallment === m ? " on" : ""}`} onClick={() => handleInstallmentSelect(m)} disabled={paymentMode === "total"} style={{ opacity: paymentMode === "total" ? 0.45 : 1, cursor: paymentMode === "total" ? "not-allowed" : "pointer" }}>
                    {m}<br /><span style={{ fontSize: 9, fontWeight: 400 }}>Meses</span>
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>
                ${monthlyOrTotalLabel}
                {paymentMode === "total" && <span style={{ fontSize: 10 }}> (contado)</span>}
              </div>

              <button
                className="buy-btn"
                onClick={() => {
                  handleAddToCart();
                  navigate("/checkout", {
                    state: {
                      checkoutPayment: {
                        mode: paymentMode,
                        months: selectedInstallment,
                      },
                    },
                  });
                }}
              >
                Compra Ahora
              </button>
              <button className="cart-btn" onClick={handleAddToCart}>Agregar al Carro</button>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ borderBottom: "1px solid #eee", display: "flex", padding: "0 12px", flexWrap: "wrap" }}>
              {([ ["technical", "Detalles tecnicos"], ["similar", "Productos similares"], ["comments", "Comentarios"] ] as [TabKey, string][]).map(([k, l]) => (
                <button key={k} className={`tab-btn${activeTab === k ? " on" : ""}`} onClick={() => setActiveTab(k)}>{l}</button>
              ))}
            </div>

            <div style={{ padding: 20 }}>
              {activeTab === "technical" && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Detalles tecnicos</h3>
                  <div style={{ border: "1px solid #f0f0f0", borderRadius: 6, overflow: "hidden" }}>
                    {[...SPECS_FULL, ...(showMoreSpecs ? SPECS_SHORT : [])].map((s, idx) => (
                      <div className="spec-row" key={`${s.k}-${idx}`}><span className="spec-k">{s.k}</span><span className="spec-v">{s.v}</span></div>
                    ))}
                  </div>
                  <button className="show-more" style={{ marginTop: 10 }} onClick={() => setShowMoreSpecs((s) => !s)}>{showMoreSpecs ? "Ver menos" : "Ver mas"}</button>
                </div>
              )}

              {activeTab === "similar" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 14 }}>
                  {SIMILAR.map((p) => (
                    <div key={p.key} className="sim-card">
                      <div style={{ background: "#f5f6f7", padding: "12px 8px", display: "flex", justifyContent: "center" }}>
                        <img src={p.img} alt={p.name} style={{ width: 120, height: 78, objectFit: "contain", display: "block" }} />
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontSize: 11.5, color: "#111", marginBottom: 6, lineHeight: 1.4 }}>{p.name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>${p.price}.00</span>
                          <Stars n={p.rating} size={10} />
                        </div>
                        <button onClick={() => addRelatedToCart(p.name, p.price, p.img)} style={{ marginTop: 8, width: "100%", padding: "6px 0", border: "1.5px solid #c8960a", borderRadius: 20, background: "#fff", color: "#c8960a", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Agregar al carrito</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "comments" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Comentarios</div>
                    <p style={{ fontSize: 11, color: "#888", marginBottom: 10, lineHeight: 1.5 }}>deja aqui tus comentarios para otros clientes</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: "#666" }}>Tu calificacion:</span>
                      <div style={{ display: "flex", gap: 2 }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoveredRating || commentRating);
                          return (
                            <button key={star} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setCommentRating(star)} style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", lineHeight: 1 }}>
                              <svg width="16" height="16" viewBox="0 0 12 12" fill={active ? "#f5c518" : "#ddd"}><polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"/></svg>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Comparte aqui tu opinion sobre este producto..." style={{ width: "100%", border: "1.5px solid #ddd", borderRadius: 6, padding: "8px 10px", fontSize: 11, resize: "vertical", minHeight: 58, color: "#555", outline: "none" }} />
                    <button onClick={handleSubmitComment} style={{ width: "100%", marginTop: 8, padding: "8px 0", background: "#c8960a", border: "none", borderRadius: 20, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Comentar</button>

                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Resumen de calificacion</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{averageRating.toFixed(1)}</span>
                        <Stars n={averageRating} size={12} />
                        <span style={{ fontSize: 10, color: "#888" }}>({comments.length} reseñas)</span>
                      </div>
                      {ratingBuckets.map(({ star, total, pct }) => (
                        <div key={star} style={{ marginBottom: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#666", marginBottom: 3 }}>
                            <span>{star} estrella{star > 1 ? "s" : ""}</span>
                            <span style={{ fontWeight: 700, color: "#111" }}>{total}</span>
                          </div>
                          <div className="fbar"><div className="ffill" style={{ width: `${pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {comments.map((c) => (
                      <div key={c.id} className="cmt-card">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: c.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#555", flexShrink: 0 }}>{c.avatar}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{c.name}</div>
                              <div style={{ fontSize: 10, color: "#aaa" }}>{c.date}</div>
                            </div>
                          </div>
                          <span style={{ background: "#f5c518", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, height: "fit-content" }}>★ {c.rating}</span>
                        </div>

                        <p style={{ fontSize: 12.5, color: "#444", lineHeight: 1.65, whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: expandedComments[c.id] ? ("unset" as any) : 4, WebkitBoxOrient: "vertical" as any, overflow: expandedComments[c.id] ? "visible" : "hidden" }}>{c.text}</p>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                          <button className="show-more" onClick={() => setExpandedComments((s) => ({ ...s, [c.id]: !s[c.id] }))}>{expandedComments[c.id] ? "Ver menos" : "Ver mas"}</button>
                        </div>

                        <div style={{ display: "flex", gap: 10, borderTop: "1px solid #f5f5f5", paddingTop: 8, marginTop: 6 }}>
                          <button style={{ border: "none", background: "none", cursor: "pointer", color: "#666", fontSize: 11 }} onClick={() => setLikedComments((s) => ({ ...s, [c.id]: !s[c.id] }))}>👍 {c.likes + (likedComments[c.id] ? 1 : 0)}</button>
                          <button style={{ border: "none", background: "none", cursor: "pointer", color: "#666", fontSize: 11 }}>👎 {c.dislikes}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Productos similares</h3>
            <div style={{ position: "relative", padding: "0 18px" }}>
              {SIMILAR.length > similarWindowSize && <button className="nav-arrow" style={{ left: -4 }} onClick={() => setSimilarIndex((i) => (i - 1 + SIMILAR.length) % SIMILAR.length)}>‹</button>}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
                {visibleSimilar.map((p) => (
                  <div key={`vs-${p.key}`} className="sim-card" style={{ padding: 12 }}>
                    <img src={p.img} alt={p.name} style={{ width: 130, height: 84, objectFit: "contain", display: "block", margin: "0 auto" }} />
                    <div style={{ marginTop: 8, fontSize: 11 }}>{p.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>${p.price}.00</div>
                    <button onClick={() => addRelatedToCart(p.name, p.price, p.img)} style={{ marginTop: 8, width: "100%", padding: "6px 0", border: "1.5px solid #c8960a", borderRadius: 20, background: "#fff", color: "#c8960a", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Agregar al carrito</button>
                  </div>
                ))}
              </div>
              {SIMILAR.length > similarWindowSize && <button className="nav-arrow" style={{ right: -4 }} onClick={() => setSimilarIndex((i) => (i + 1) % SIMILAR.length)}>›</button>}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Comprados frecuentemente juntos</h3>
            <div style={{ position: "relative", padding: "0 18px" }}>
              {BOUGHT.length > boughtWindowSize && <button className="nav-arrow" style={{ left: -4 }} onClick={() => setBoughtIndex((i) => (i - 1 + BOUGHT.length) % BOUGHT.length)}>‹</button>}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
                {visibleBought.map((p, i) => (
                  <div key={`b-${i}`} className="sim-card" style={{ padding: 12 }}>
                    <img src={p.img} alt={p.name} style={{ width: 120, height: 80, objectFit: "contain", display: "block", margin: "0 auto" }} />
                    <div style={{ marginTop: 8, fontSize: 11 }}>{p.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>${p.price.toFixed(2)}</div>
                    <button onClick={() => addRelatedToCart(p.name, p.price, p.img)} style={{ marginTop: 8, width: "100%", padding: "6px 0", border: "1.5px solid #c8960a", borderRadius: 20, background: "#fff", color: "#c8960a", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Agregar al carrito</button>
                  </div>
                ))}
              </div>
              {BOUGHT.length > boughtWindowSize && <button className="nav-arrow" style={{ right: -4 }} onClick={() => setBoughtIndex((i) => (i + 1) % BOUGHT.length)}>›</button>}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Resenas</h3>
            <div style={{ position: "relative", padding: "0 18px" }}>
              {REVIEW_VIDEOS.length > reviewWindowSize && <button className="nav-arrow" style={{ left: -4 }} onClick={() => setReviewIndex((i) => (i - 1 + REVIEW_VIDEOS.length) % REVIEW_VIDEOS.length)}>‹</button>}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 12 }}>
                {visibleReviews.map((v, i) => (
                  <div key={`r-${i}`} style={{ borderRadius: 8, background: v.bg, minHeight: 130, display: "flex", alignItems: "flex-end", padding: 10 }}>
                    <span style={{ fontSize: 11, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>{v.title}</span>
                  </div>
                ))}
              </div>
              {REVIEW_VIDEOS.length > reviewWindowSize && <button className="nav-arrow" style={{ right: -4 }} onClick={() => setReviewIndex((i) => (i + 1) % REVIEW_VIDEOS.length)}>›</button>}
            </div>
          </div>
        </div>
      </div>

      <div className={`detail-toast${toastMessage ? " show" : ""}`}>{toastMessage}</div>
    </>
  );
}
