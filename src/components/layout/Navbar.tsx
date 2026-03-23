import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { navItems } from "../../constants/data";
import { useAuthStore } from "../../store/authStore";
import { useCart } from "../../context/CartContext";
import { useSavedItems } from "../../context/SavedItemsContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const { cart } = useCart();
  const { favorites, compared, openDrawer } = useSavedItems();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountLabel = totalItems > 99 ? "99+" : String(totalItems);
  const favoritesCountLabel = favorites.length > 99 ? "99+" : String(favorites.length);
  const comparedCountLabel = compared.length > 99 ? "99+" : String(compared.length);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="vl-topbar">
        <span>Bienvenido a VendoLaptops!</span>
        <div className="vl-topbar-right">
          <span className="vl-deliver">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Deliver to <strong style={{color:"#111", marginLeft:3}}>423681</strong>
          </span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Track your order
          </span>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            All Offers
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="vl-header">
        <Link className="vl-logo" to="/">
          Vendo Laptops
        </Link>

        <div className="vl-search">
          <input type="text" placeholder="Busca laptops, computadoras y más..." />
          <button className="vl-search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>

        <div className="vl-header-actions">
          {isAuthenticated && user ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button 
                className="vl-action" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Hola, {user.name}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{user.email}</div>
                  </div>
                  {isAdmin && (
                    <div
                      onClick={() => { navigate('/admin'); setShowUserMenu(false); }}
                      style={{ display: 'block', padding: '10px 16px', color: '#c8960c', textDecoration: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: 700, transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef9ec'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      ⚙️ Admin Panel
                    </div>
                  )}
                  <Link 
                    to="/orders" 
                    style={{ 
                      display: 'block', 
                      padding: '10px 16px', 
                      color: '#111', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📦 My Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    style={{ 
                      display: 'block', 
                      padding: '10px 16px', 
                      color: '#111', 
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'none',
                      border: 'none',
                      borderTop: '1px solid #f0f0f0',
                      color: '#dc2626',
                      textAlign: 'left',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="vl-action" to="/login">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Sign Up/Sign In</span>
            </Link>
          )}
          <Link className="vl-action" to="/pc-builder" style={{ background:"rgba(200,150,12,.1)", border:"1px solid rgba(200,150,12,.3)", color:"#c8960c" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <span>PC Builder</span>
          </Link>

          <button
            className="vl-action"
            onClick={() => openDrawer("compare")}
            style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
            title="Comparar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>
            </svg>
            <span>Comparar</span>
            {compared.length > 0 && <span className="vl-cart-count">{comparedCountLabel}</span>}
          </button>

          <button
            className="vl-action"
            onClick={() => openDrawer("favorites")}
            style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
            title="Favoritos"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>Favoritos</span>
            {favorites.length > 0 && <span className="vl-cart-count">{favoritesCountLabel}</span>}
          </button>

          <Link className="vl-cart" to="/checkout" style={{ textDecoration: "none", color: "inherit" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Cart
            {totalItems > 0 && <span className="vl-cart-count">{cartCountLabel}</span>}
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="vl-nav">
        {navItems.map((item, i) => {
          const hasDropdown = i < 3 || [4,5,6,7].includes(i);
          // Link first item to PC builder and "Piezas PRO" to catalog
          if (i === 0) {
            return (
              <Link key={i} to="/pc-builder" className={`vl-nav-item${hasDropdown ? " dropdown" : ""}`}>
                {item}
              </Link>
            );
          }
          if (i === 2) {
            return (
              <Link key={i} to="/catalog" className={`vl-nav-item${hasDropdown ? " dropdown" : ""}`}>
                {item}
              </Link>
            );
          }
          return (
            <div key={i} className={`vl-nav-item${hasDropdown ? " dropdown" : ""}`}>
              {item}
            </div>
          );
        })}
      </nav>
    </>
  );
}
