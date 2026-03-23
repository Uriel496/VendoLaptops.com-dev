import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSavedItems } from "../../context/SavedItemsContext";

export default function SavedItemsDrawer() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const {
    activeDrawer,
    closeDrawer,
    favorites,
    compared,
    removeFavorite,
    removeCompare,
  } = useSavedItems();

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const isOpen = activeDrawer !== null;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const raf = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(raf);
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setIsMounted(false), 260);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDrawer, isOpen]);

  const list = useMemo(() => {
    return activeDrawer === "favorites" ? favorites : compared;
  }, [activeDrawer, favorites, compared]);

  const title = activeDrawer === "favorites" ? "Favoritos" : "Comparar";

  const removeItem = (key: string) => {
    if (activeDrawer === "favorites") {
      removeFavorite(key);
      return;
    }
    removeCompare(key);
  };

  if (!isMounted) return null;

  return (
    <>
      <style>{`
        .saved-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(1.5px);
          z-index: 85;
          opacity: 0;
          transition: opacity 0.26s ease;
        }
        .saved-overlay.open {
          opacity: 1;
        }
        .saved-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: min(92vw, 430px);
          height: 100vh;
          background: #ffffff;
          border-left: 1px solid #ececec;
          box-shadow: -16px 0 40px rgba(0, 0, 0, 0.16);
          z-index: 86;
          display: grid;
          grid-template-rows: auto 1fr;
          transform: translateX(108%);
          opacity: 0.85;
          transition: transform 0.26s cubic-bezier(0.18, 0.86, 0.26, 1), opacity 0.2s ease;
        }
        .saved-panel.open {
          transform: translateX(0);
          opacity: 1;
        }
        .saved-list {
          overflow: auto;
          padding: 12px 14px 16px;
          display: grid;
          gap: 10px;
          align-content: start;
        }
      `}</style>

      <div className={`saved-overlay${isVisible ? " open" : ""}`} onClick={closeDrawer} />

      <aside className={`saved-panel${isVisible ? " open" : ""}`}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 14px", borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111", fontFamily: "'Satoshi',sans-serif" }}>{title}</h3>
            <span style={{ fontSize: 12, color: "#777" }}>{list.length} producto(s)</span>
          </div>
          <button onClick={closeDrawer} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: "#777", lineHeight: 1 }}>×</button>
        </header>

        <div className="saved-list">
          {list.length === 0 && (
            <div style={{ border: "1px dashed #ddd", borderRadius: 12, padding: 14, fontSize: 12, color: "#666", lineHeight: 1.6 }}>
              Aun no tienes productos en esta lista.
            </div>
          )}

          {list.map((item) => (
            <article key={item.key} style={{ border: "1px solid #eee", borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, alignItems: "center" }}>
              <div style={{ width: 72, height: 52, borderRadius: 8, background: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                ) : (
                  <span style={{ fontSize: 11, color: "#999" }}>Sin imagen</span>
                )}
              </div>

              <div>
                <div style={{ fontSize: 12, color: "#111", fontWeight: 700, lineHeight: 1.4 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>${item.price}.00</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {item.route && (
                    <button
                      onClick={() => {
                        navigate(item.route || "/catalog");
                        closeDrawer();
                      }}
                      style={{ border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 11, padding: "5px 8px" }}
                    >
                      Ver producto
                    </button>
                  )}

                  <button
                    onClick={() => addToCart({
                      id: item.id ?? 100000 + Math.abs(item.key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)),
                      name: item.name,
                      price: item.price,
                      image: item.image,
                    })}
                    style={{ border: "1px solid #f5c518", background: "#fff8d1", borderRadius: 8, cursor: "pointer", fontSize: 11, padding: "5px 8px" }}
                  >
                    Agregar al carrito
                  </button>

                  <button
                    onClick={() => removeItem(item.key)}
                    style={{ border: "1px solid #f0d6d6", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 11, padding: "5px 8px", color: "#aa3a3a" }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </>
  );
}
