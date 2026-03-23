import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import PCBuilderPage from './pages/PCBuilderPage';
import AdminPage from './pages/AdminPage';
import { CartProvider } from './context/CartContext';
import { SavedItemsProvider } from './context/SavedItemsContext';
import SavedItemsDrawer from './components/ui/SavedItemsDrawer';
import './styles/vendo-laptops.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPCBuilderPage = location.pathname === '/pc-builder';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="vl-root">
      {/* Navbar - Hide on login, pc-builder and admin pages */}
      {!isLoginPage && !isPCBuilderPage && !isAdminPage && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pc-builder" element={<PCBuilderPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>

      {/* Footer - Hide on login, pc-builder and admin pages */}
      {!isLoginPage && !isPCBuilderPage && !isAdminPage && <Footer />}

      {/* Global drawers for favorites/compare */}
      <SavedItemsDrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <SavedItemsProvider>
        <Router>
          <AppContent />
        </Router>
      </SavedItemsProvider>
    </CartProvider>
  );
}
  
