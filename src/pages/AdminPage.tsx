import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  FileDown,
  FilePenLine,
  Filter,
  Globe,
  Grid2x2,
  HardDriveUpload,
  Headphones,
  House,
  Image as ImageIcon,
  Laptop,
  LayoutDashboard,
  List,
  ListChecks,
  LogOut,
  MonitorSmartphone,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Star,
  TicketPercent,
  Trash2,
  User,
  UserCog,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useProductsStore } from "../store/productsStore";
import type { CatalogProduct } from "../constants/data";
import ProductImage from "../components/ui/ProductImage";
import { useCouponsStore } from "../store/couponsStore";
import { useBrandsStore } from "../store/brandsStore";

/*
  This admin keeps the structure requested by the user while matching
  VendoLaptops visual language: Satoshi font, black/white base and gold accents.
*/

type Page =
  | "dashboard"
  | "orders"
  | "customers"
  | "coupon"
  | "categories"
  | "transaction"
  | "brand"
  | "add-product"
  | "product-media"
  | "product-list"
  | "product-reviews"
  | "admin-role"
  | "control-authority";

type PaymentStatus = "Paid" | "Unpaid";
type OrderStatus = "Delivered" | "Pending" | "Shipped" | "Cancelled";
type IconComponent = ComponentType<{ size?: number; color?: string }>;

interface Order {
  no: number;
  orderId: string;
  product: string;
  productIcon: ProductIconKey;
  date: string;
  price: number;
  payment: PaymentStatus;
  status: OrderStatus;
  customer: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "Inactive";
}

interface AdminCouponForm {
  code: string;
  discount: string;
  type: "Percentage" | "Fixed";
  minOrder: string;
  maxUses: string;
  expires: string;
  status: "Active" | "Expired";
}

interface AdminBrandForm {
  name: string;
  country: string;
  products: string;
  revenue: string;
  status: "Active" | "Inactive";
}

type ProductIconKey =
  | "headphones"
  | "shirt"
  | "wallet"
  | "home"
  | "sports"
  | "coffee"
  | "camera"
  | "bulb"
  | "kettle"
  | "yoga"
  | "laptop"
  | "phone"
  | "shoes"
  | "watch"
  | "trimmer"
  | "cap";

const PRODUCT_ICONS: Record<ProductIconKey, IconComponent> = {
  headphones: Headphones,
  shirt: ShoppingBag,
  wallet: Wallet,
  home: House,
  sports: DumbbellIcon,
  coffee: CoffeeIcon,
  camera: CameraIcon,
  bulb: BulbIcon,
  kettle: KettleIcon,
  yoga: YogaIcon,
  laptop: Laptop,
  phone: SmartphoneIcon,
  shoes: ShoeIcon,
  watch: WatchIcon,
  trimmer: TrimmerIcon,
  cap: CapIcon,
};

const ORDERS: Order[] = [
  { no: 1, orderId: "#ORD0001", product: "Wireless Bluetooth Headphones", productIcon: "headphones", date: "01-01-2025", price: 49.99, payment: "Paid", status: "Delivered", customer: "John Doe" },
  { no: 2, orderId: "#ORD0002", product: "Men's T-Shirt", productIcon: "shirt", date: "01-01-2025", price: 14.99, payment: "Unpaid", status: "Pending", customer: "Sarah Lee" },
  { no: 3, orderId: "#ORD0003", product: "Men's Leather Wallet", productIcon: "wallet", date: "02-01-2025", price: 49.99, payment: "Paid", status: "Delivered", customer: "Carlos M." },
  { no: 4, orderId: "#ORD0004", product: "Memory Foam Pillow", productIcon: "home", date: "02-01-2025", price: 39.99, payment: "Paid", status: "Shipped", customer: "Emma W." },
  { no: 5, orderId: "#ORD0005", product: "Adjustable Dumbbells", productIcon: "sports", date: "03-01-2025", price: 14.99, payment: "Unpaid", status: "Pending", customer: "Mike R." },
  { no: 6, orderId: "#ORD0006", product: "Coffee Maker", productIcon: "coffee", date: "03-01-2025", price: 79.99, payment: "Unpaid", status: "Cancelled", customer: "Anna K." },
  { no: 7, orderId: "#ORD0007", product: "Casual Baseball Cap", productIcon: "cap", date: "04-01-2025", price: 49.99, payment: "Paid", status: "Delivered", customer: "Tom B." },
  { no: 8, orderId: "#ORD0008", product: "Full HD Webcam", productIcon: "camera", date: "04-01-2025", price: 39.99, payment: "Paid", status: "Delivered", customer: "Lisa G." },
  { no: 9, orderId: "#ORD0009", product: "Smart LED Color Bulb", productIcon: "bulb", date: "05-01-2025", price: 79.99, payment: "Unpaid", status: "Delivered", customer: "Dave H." },
  { no: 10, orderId: "#ORD0010", product: "Electric Kettle", productIcon: "kettle", date: "05-01-2025", price: 34.99, payment: "Paid", status: "Shipped", customer: "Nina P." },
  { no: 11, orderId: "#ORD0011", product: "Yoga Mat", productIcon: "yoga", date: "06-01-2025", price: 29.99, payment: "Paid", status: "Delivered", customer: "Kim J." },
  { no: 12, orderId: "#ORD0012", product: "Laptop Stand", productIcon: "laptop", date: "06-01-2025", price: 54.99, payment: "Unpaid", status: "Pending", customer: "Omar S." },
];

const CUSTOMERS: Customer[] = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234 567 890", city: "New York", orders: 12, spent: 849.5, joined: "Jan 2024", status: "Active" },
  { id: 2, name: "Sarah Lee", email: "sarah@example.com", phone: "+1 555 123 456", city: "Los Angeles", orders: 8, spent: 420, joined: "Mar 2024", status: "Active" },
  { id: 3, name: "Carlos M.", email: "carlos@example.com", phone: "+52 55 1234 567", city: "Mexico City", orders: 5, spent: 299.95, joined: "Feb 2024", status: "Inactive" },
  { id: 4, name: "Emma W.", email: "emma@example.com", phone: "+44 20 7946 123", city: "London", orders: 20, spent: 1240, joined: "Nov 2023", status: "Active" },
  { id: 5, name: "Mike R.", email: "mike@example.com", phone: "+1 800 555 999", city: "Chicago", orders: 3, spent: 89.97, joined: "Apr 2024", status: "Active" },
  { id: 6, name: "Anna K.", email: "anna@example.com", phone: "+49 30 12345678", city: "Berlin", orders: 7, spent: 540.3, joined: "Dec 2023", status: "Inactive" },
  { id: 7, name: "Tom B.", email: "tom@example.com", phone: "+61 2 9876 5432", city: "Sydney", orders: 15, spent: 975.4, joined: "Oct 2023", status: "Active" },
  { id: 8, name: "Lisa G.", email: "lisa@example.com", phone: "+33 1 2345 6789", city: "Paris", orders: 9, spent: 612.8, joined: "Jan 2024", status: "Active" },
];

const TRANSACTIONS = [
  { id: "TXN001", orderId: "#ORD0001", customer: "John Doe", amount: 49.99, method: "Credit Card", date: "01-01-2025", status: "Success" },
  { id: "TXN002", orderId: "#ORD0003", customer: "Carlos M.", amount: 49.99, method: "PayPal", date: "02-01-2025", status: "Success" },
  { id: "TXN003", orderId: "#ORD0004", customer: "Emma W.", amount: 39.99, method: "Debit Card", date: "02-01-2025", status: "Pending" },
  { id: "TXN004", orderId: "#ORD0007", customer: "Tom B.", amount: 49.99, method: "Credit Card", date: "04-01-2025", status: "Success" },
  { id: "TXN005", orderId: "#ORD0008", customer: "Lisa G.", amount: 39.99, method: "PayPal", date: "04-01-2025", status: "Success" },
  { id: "TXN006", orderId: "#ORD0010", customer: "Nina P.", amount: 34.99, method: "Credit Card", date: "05-01-2025", status: "Pending" },
  { id: "TXN007", orderId: "#ORD0011", customer: "Kim J.", amount: 29.99, method: "Apple Pay", date: "06-01-2025", status: "Success" },
  { id: "TXN008", orderId: "#ORD0006", customer: "Anna K.", amount: 79.99, method: "Debit Card", date: "03-01-2025", status: "Failed" },
];

const CATEGORIES = [
  { name: "Electronic", products: 45, revenue: 48200, status: "Active" },
  { name: "Fashion", products: 120, revenue: 31500, status: "Active" },
  { name: "Home", products: 67, revenue: 22400, status: "Active" },
  { name: "Sports", products: 38, revenue: 15800, status: "Active" },
  { name: "Beauty", products: 55, revenue: 19200, status: "Active" },
  { name: "Books", products: 200, revenue: 8700, status: "Inactive" },
] as const;

const REVIEWS = [
  { id: 1, product: "Apple iPhone 13", customer: "John Doe", rating: 5, comment: "Amazing phone! Best camera I've ever used.", date: "10-01-2025", status: "Published" },
  { id: 2, product: "Nike Air Jordan", customer: "Sarah Lee", rating: 4, comment: "Very comfortable, love the design.", date: "09-01-2025", status: "Published" },
  { id: 3, product: "Coffee Maker", customer: "Anna K.", rating: 2, comment: "Stopped working after 2 weeks.", date: "08-01-2025", status: "Pending" },
  { id: 4, product: "Memory Foam Pillow", customer: "Emma W.", rating: 5, comment: "Best sleep I've had in years!", date: "07-01-2025", status: "Published" },
  { id: 5, product: "Yoga Mat", customer: "Kim J.", rating: 3, comment: "Good quality but a bit thin.", date: "06-01-2025", status: "Pending" },
] as const;

const ADMIN_ROLES = [
  { role: "Super Admin", users: 2, permissions: ["All Access"], color: "#22c55e" },
  { role: "Product Manager", users: 5, permissions: ["Products", "Categories", "Brands", "Media"], color: "#3b82f6" },
  { role: "Order Manager", users: 8, permissions: ["Orders", "Transactions", "Customers"], color: "#f59e0b" },
  { role: "Support", users: 12, permissions: ["Customers", "Reviews", "Coupons"], color: "#8b5cf6" },
  { role: "Viewer", users: 20, permissions: ["Dashboard (read-only)"], color: "#64748b" },
] as const;

const CHART_DATA = [
  { day: "Sun", v: 15 },
  { day: "Mon", v: 28 },
  { day: "Tue", v: 22 },
  { day: "Wed", v: 45 },
  { day: "Thu", v: 38 },
  { day: "Fri", v: 32 },
  { day: "Sat", v: 20 },
] as const;

const BAR_DATA = [3, 5, 8, 6, 9, 7, 4, 8, 6, 10, 8, 7, 5, 9, 6, 4, 7, 8, 5, 6, 8, 10, 7, 6] as const;

const PAGE_META: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your store performance" },
  orders: { title: "Order Management", subtitle: "Track and manage all customer orders" },
  customers: { title: "Customers", subtitle: "Manage your customer base" },
  coupon: { title: "Coupon Code", subtitle: "Create and manage discount coupons" },
  categories: { title: "Categories", subtitle: "Organize your product categories" },
  transaction: { title: "Transactions", subtitle: "Monitor all payment transactions" },
  brand: { title: "Brands", subtitle: "Manage your product brands" },
  "add-product": { title: "Add Product", subtitle: "Add a new product to your catalog" },
  "product-media": { title: "Product Media", subtitle: "Manage product images and videos" },
  "product-list": { title: "Product List", subtitle: "View and manage all products" },
  "product-reviews": { title: "Product Reviews", subtitle: "Moderate customer reviews" },
  "admin-role": { title: "Admin Roles", subtitle: "Manage staff roles and permissions" },
  "control-authority": { title: "Control Authority", subtitle: "Fine-grained permission control" },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { fg: string; bg: string }> = {
    Delivered: { fg: "#22c55e", bg: "rgba(34,197,94,.15)" },
    Pending: { fg: "#f59e0b", bg: "rgba(245,158,11,.15)" },
    Shipped: { fg: "#38bdf8", bg: "rgba(56,189,248,.15)" },
    Cancelled: { fg: "#ef4444", bg: "rgba(239,68,68,.15)" },
    Active: { fg: "#22c55e", bg: "rgba(34,197,94,.15)" },
    Inactive: { fg: "#ef4444", bg: "rgba(239,68,68,.15)" },
    Draft: { fg: "#f59e0b", bg: "rgba(245,158,11,.15)" },
    Published: { fg: "#22c55e", bg: "rgba(34,197,94,.15)" },
    Success: { fg: "#22c55e", bg: "rgba(34,197,94,.15)" },
    Failed: { fg: "#ef4444", bg: "rgba(239,68,68,.15)" },
    Expired: { fg: "#94a3b8", bg: "rgba(148,163,184,.2)" },
    Unpaid: { fg: "#ef4444", bg: "rgba(239,68,68,.15)" },
    Paid: { fg: "#22c55e", bg: "rgba(34,197,94,.15)" },
  };
  const c = map[status] ?? { fg: "#94a3b8", bg: "rgba(148,163,184,.2)" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: c.fg, background: c.bg }}>
      {status}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#121212", border: "1px solid #1f1f1f", borderRadius: 12, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card style={{ padding: "16px 18px", minWidth: 0 }}>
      <p style={{ margin: 0, color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.7 }}>{label}</p>
      <p style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "8px 0 0", fontSize: 11, color: "#c8960c" }}>{sub}</p>}
    </Card>
  );
}

function SearchBar({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #2a2a2a", borderRadius: 10, padding: "7px 10px", background: "#161616" }}>
      <Search size={14} color="#777" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ background: "transparent", border: "none", outline: "none", color: "#ddd", fontSize: 12, width: 170 }}
      />
    </div>
  );
}

function IconWrap({ icon: Icon }: { icon: IconComponent }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(200,150,12,.15)", border: "1px solid rgba(200,150,12,.3)", display: "grid", placeItems: "center" }}>
      <Icon size={16} color="#c8960c" />
    </div>
  );
}

function ProductIcon({ type }: { type: ProductIconKey }) {
  const Icon = PRODUCT_ICONS[type];
  return <Icon size={16} color="#c8960c" />;
}

function DashboardPage() {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; day: string; v: number } | null>(null);
  const W = 510;
  const H = 170;
  const pad = 24;
  const max = Math.max(...CHART_DATA.map((d) => d.v));
  const pts = CHART_DATA.map((d, i) => ({
    x: pad + (i / (CHART_DATA.length - 1)) * (W - pad * 2),
    y: pad + (1 - d.v / max) * (H - pad * 2),
    ...d,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${H - pad} L${pts[0].x},${H - pad} Z`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Sales" value="$350K" sub="+10.4% vs last week" />
        <StatCard label="Total Orders" value="1,240" sub="+14.4% vs last week" />
        <StatCard label="Customers" value="52K" sub="+8.1% vs last week" />
        <StatCard label="Revenue" value="$250K" sub="+5.2% vs last week" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 14 }}>Report for this week</p>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="admin-btn active">This week</button>
              <button className="admin-btn">Last week</button>
            </div>
          </div>

          <svg width="100%" viewBox={`0 0 ${W} ${H}`} onMouseLeave={() => setTooltip(null)}>
            <defs>
              <linearGradient id="adminGraph" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8960c" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c8960c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={pad} y1={pad + (i / 4) * (H - pad * 2)} x2={W - pad} y2={pad + (i / 4) * (H - pad * 2)} stroke="#232323" strokeWidth={1} />
            ))}
            <path d={area} fill="url(#adminGraph)" />
            <path d={line} fill="none" stroke="#c8960c" strokeWidth={2.3} />
            {pts.map((p) => (
              <circle key={p.day} cx={p.x} cy={p.y} r={4} fill="#c8960c" stroke="#121212" strokeWidth={2} onMouseEnter={() => setTooltip({ x: p.x, y: p.y, day: p.day, v: p.v })} />
            ))}
            {pts.map((p) => (
              <text key={`${p.day}-x`} x={p.x} y={H - 4} textAnchor="middle" fontSize={10} fill="#777">
                {p.day}
              </text>
            ))}
            {tooltip && (
              <g>
                <rect x={tooltip.x - 38} y={tooltip.y - 35} width={76} height={24} rx={6} fill="#c8960c" />
                <text x={tooltip.x} y={tooltip.y - 20} textAnchor="middle" fontSize={11} fill="#111" fontWeight={700}>
                  {tooltip.day}: {tooltip.v}k
                </text>
              </g>
            )}
          </svg>
        </Card>

        <Card style={{ padding: 16 }}>
          <p style={{ margin: 0, color: "#c8960c", fontSize: 11, fontWeight: 700 }}>Users in last 30 minutes</p>
          <p style={{ margin: "4px 0 0", color: "#fff", fontSize: 28, fontWeight: 900 }}>21.5K</p>
          <p style={{ margin: "2px 0 12px", color: "#777", fontSize: 11 }}>Users per minute</p>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 42, marginBottom: 12 }}>
            {BAR_DATA.map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${(v / 10) * 100}%`, background: i === 11 || i === 12 ? "#c8960c" : "#333", borderRadius: 2 }} />
            ))}
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#fff", fontWeight: 700 }}>Sales by Country</p>
          {[
            { country: "USA", value: "30k", pct: "+15.8%", ok: true, bar: 80 },
            { country: "Brazil", value: "30k", pct: "-18.9%", ok: false, bar: 75 },
            { country: "Australia", value: "25k", pct: "+35.8%", ok: true, bar: 60 },
          ].map((row) => (
            <div key={row.country} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#ddd", fontSize: 11 }}>{row.country}</span>
                <span style={{ color: row.ok ? "#22c55e" : "#ef4444", fontSize: 11 }}>{row.pct}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "#2a2a2a" }}>
                <div style={{ width: `${row.bar}%`, height: 4, borderRadius: 2, background: "#c8960c" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <OrdersTable rows={ORDERS.slice(0, 6)} />
    </div>
  );
}

function OrdersTable({ rows }: { rows: Order[] }) {
  return (
    <Card>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #232323" }}>
        <p style={{ margin: 0, color: "#fff", fontSize: 14, fontWeight: 700 }}>Recent Orders</p>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.orderId}>
              <td style={{ color: "#c8960c", fontWeight: 700 }}>{o.orderId}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ProductIcon type={o.productIcon} />
                  <span>{o.product}</span>
                </div>
              </td>
              <td>{o.customer}</td>
              <td>{o.date}</td>
              <td style={{ color: "#fff", fontWeight: 700 }}>${o.price.toFixed(2)}</td>
              <td><StatusBadge status={o.payment} /></td>
              <td><StatusBadge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function OrdersPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [pg, setPg] = useState(1);
  const PER = 8;

  const filtered = useMemo(
    () =>
      ORDERS.filter((o) => {
        if (tab === "Completed" && o.status !== "Delivered") return false;
        if (tab === "Pending" && o.status !== "Pending") return false;
        if (tab === "Cancelled" && o.status !== "Cancelled") return false;
        if (search && !o.product.toLowerCase().includes(search.toLowerCase()) && !o.orderId.includes(search)) return false;
        return true;
      }),
    [tab, search]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const shown = filtered.slice((pg - 1) * PER, pg * PER);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Orders" value={ORDERS.length} sub="All time" />
        <StatCard label="Completed" value={ORDERS.filter((o) => o.status === "Delivered").length} sub="Delivered" />
        <StatCard label="Pending" value={ORDERS.filter((o) => o.status === "Pending").length} sub="Awaiting" />
        <StatCard label="Cancelled" value={ORDERS.filter((o) => o.status === "Cancelled").length} sub="This month" />
      </div>

      <Card>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #232323", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {["All", "Completed", "Pending", "Cancelled"].map((t) => (
            <button key={t} className={`admin-pill ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setPg(1); }}>
              {t}
            </button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPg(1); }} placeholder="Search orders..." />
            <button className="admin-icon-btn"><Filter size={14} /></button>
            <button className="admin-icon-btn"><FileDown size={14} /></button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Order Id</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((o, i) => (
              <tr key={o.orderId}>
                <td>{(pg - 1) * PER + i + 1}</td>
                <td style={{ color: "#c8960c", fontWeight: 700 }}>{o.orderId}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ProductIcon type={o.productIcon} />
                    <span>{o.product}</span>
                  </div>
                </td>
                <td>{o.customer}</td>
                <td>{o.date}</td>
                <td style={{ color: "#fff", fontWeight: 700 }}>${o.price.toFixed(2)}</td>
                <td><StatusBadge status={o.payment} /></td>
                <td><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderTop: "1px solid #232323" }}>
          <button className="admin-min-btn" onClick={() => setPg((p) => Math.max(1, p - 1))}><ChevronLeft size={14} /> Previous</button>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`admin-page-btn ${p === pg ? "active" : ""}`} onClick={() => setPg(p)}>
                {p}
              </button>
            ))}
          </div>
          <button className="admin-min-btn" onClick={() => setPg((p) => Math.min(pages, p + 1))}>Next <ChevronRight size={14} /></button>
        </div>
      </Card>
    </div>
  );
}

function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const shown = CUSTOMERS.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search));

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
          <StatCard label="Total Customers" value={CUSTOMERS.length} sub="All time" />
          <StatCard label="Active" value={CUSTOMERS.filter((c) => c.status === "Active").length} sub="Currently active" />
          <StatCard label="Total Spent" value={`$${CUSTOMERS.reduce((a, c) => a + c.spent, 0).toFixed(0)}`} sub="All customers" />
        </div>

        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid #232323" }}>
            <p style={{ margin: 0, color: "#fff", fontWeight: 700 }}>All Customers</p>
            <div style={{ display: "flex", gap: 8 }}>
              <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
              <button className="admin-solid-btn"><Plus size={14} /> Add Customer</button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: "pointer", background: selected?.id === c.id ? "rgba(200,150,12,.08)" : "transparent" }}>
                  <td>{c.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c8960c", color: "#111", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>
                        {c.name[0]}
                      </div>
                      <span style={{ color: "#fff", fontWeight: 700 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.city}</td>
                  <td>{c.orders}</td>
                  <td style={{ color: "#c8960c", fontWeight: 700 }}>${c.spent.toFixed(2)}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="admin-icon-btn"><UserRound size={13} /></button>
                      <button className="admin-icon-btn"><FilePenLine size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {selected && (
        <Card style={{ width: 260, padding: 14, alignSelf: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, color: "#fff", fontWeight: 700 }}>Customer Detail</p>
            <button className="admin-icon-btn" onClick={() => setSelected(null)}><X size={13} /></button>
          </div>
          <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#c8960c", color: "#111", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20, margin: "10px auto" }}>
            {selected.name[0]}
          </div>
          <p style={{ margin: 0, textAlign: "center", color: "#fff", fontWeight: 800 }}>{selected.name}</p>
          <p style={{ margin: "2px 0 12px", textAlign: "center", color: "#777", fontSize: 11 }}>{selected.email}</p>
          <div style={{ display: "grid", gap: 8, fontSize: 12, color: "#bbb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><PhoneIcon size={13} color="#c8960c" /> {selected.phone}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Globe size={13} color="#c8960c" /> {selected.city}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Clock3 size={13} color="#c8960c" /> Joined {selected.joined}</div>
          </div>
          <div style={{ marginTop: 12 }}><StatusBadge status={selected.status} /></div>
        </Card>
      )}
    </div>
  );
}

function ProductListPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [editing, setEditing] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<Omit<CatalogProduct, "id">>({
    name: "",
    price: 0,
    oldPrice: 0,
    rating: 5,
    reviews: 0,
    stock: "en stock",
    img: "laptop",
    category: "PCs HP/Compaq",
    color: "negro",
    brand: "",
    cpu: "",
    featured: "",
    vdPorts: "",
  });
  const cats = ["All", ...new Set(products.map((p) => p.category))];

  const shown = products.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openEdit = (product: CatalogProduct) => {
    const { id, ...rest } = product;
    setForm(rest);
    setEditing(id);
    setShowCreate(true);
  };

  const saveProduct = async () => {
    if (!form.name.trim() || !form.brand.trim() || Number(form.price) <= 0) return;
    if (editing !== null) {
      try {
        await fetch(`/api/admin/products/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } catch {
        // Local store remains source of truth if backend is unavailable.
      }
      updateProduct(editing, form);
    } else {
      try {
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } catch {
        // Local store remains source of truth if backend is unavailable.
      }
      addProduct(form);
    }
    setShowCreate(false);
    setEditing(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Products" value={products.length} sub="In catalog" />
        <StatCard label="Available" value={products.filter((p) => p.stock === "en stock").length} sub="Published" />
        <StatCard label="Avg Price" value={`$${Math.round(products.reduce((a, p) => a + p.price, 0) / Math.max(products.length, 1))}`} sub="Catalog average" />
        <StatCard label="No Stock" value={products.filter((p) => p.stock !== "en stock").length} sub="Needs update" />
      </div>

      <Card>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #232323", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map((c) => (
              <button key={c} className={`admin-pill ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
            <button className="admin-solid-btn" onClick={() => { setEditing(null); setShowCreate(true); }}><Plus size={14} /> Add Product</button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table admin-table-lg">
            <thead>
              <tr>
                <th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Brand</th><th>CPU</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 46, height: 34, overflow: "hidden", borderRadius: 8, border: "1px solid #2a2a2a", background: "#0f0f0f", display: "grid", placeItems: "center" }}>
                        <ProductImage type={p.img} />
                      </div>
                      <span style={{ color: "#fff", fontWeight: 700 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td style={{ color: "#fff", fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                  <td>{p.brand}</td>
                  <td>{p.cpu || "-"}</td>
                  <td><StatusBadge status={p.stock === "en stock" ? "Active" : "Inactive"} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="admin-icon-btn" onClick={() => openEdit(p)}><FilePenLine size={13} /></button>
                      <button
                        className="admin-icon-btn danger"
                        onClick={async () => {
                          try {
                            await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
                          } catch {
                            // Local delete still works without backend.
                          }
                          deleteProduct(p.id);
                        }}
                      ><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreate && (
        <div className="admin-modal-overlay">
          <Card style={{ width: "min(760px, 95vw)", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p className="admin-card-title">{editing !== null ? "Edit Product" : "New Product"}</p>
              <button className="admin-icon-btn" onClick={() => setShowCreate(false)}><X size={14} /></button>
            </div>
            <div className="admin-form-grid">
              <Field label="Name" wide><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
              <Field label="Price"><input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} /></Field>
              <Field label="Old Price"><input type="number" value={form.oldPrice} onChange={(e) => setForm((f) => ({ ...f, oldPrice: Number(e.target.value) }))} /></Field>
              <Field label="Brand"><input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} /></Field>
              <Field label="CPU"><input value={form.cpu || ""} onChange={(e) => setForm((f) => ({ ...f, cpu: e.target.value }))} /></Field>
              <Field label="Category"><input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></Field>
              <Field label="Image Key">
                <select value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}>
                  {[
                    "monitor",
                    "tower",
                    "gaming-tower",
                    "laptop",
                    "gaming-tower2",
                  ].map((k) => <option key={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Stock">
                <select value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}>
                  <option value="en stock">en stock</option>
                  <option value="consultar disponibilidad">consultar disponibilidad</option>
                </select>
              </Field>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="admin-min-btn" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="admin-solid-btn" onClick={saveProduct}>{editing !== null ? "Save" : "Create"}</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function AddProductPage() {
  const { addProduct } = useProductsStore();
  const [form, setForm] = useState({ name: "", category: "Electronic", price: "", stock: "", description: "", status: "Active" });
  const [saved, setSaved] = useState(false);

  const setField = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 12 }}>
      <Card style={{ padding: 14 }}>
        <p className="admin-card-title">Product Information</p>
        <div className="admin-form-grid">
          <Field label="Product Name"><input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Apple iPhone 15 Pro" /></Field>
          <Field label="Price ($)"><input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="0.00" /></Field>
          <Field label="Stock"><input type="number" value={form.stock} onChange={(e) => setField("stock", e.target.value)} placeholder="0" /></Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {["Electronic", "Fashion", "Home", "Sports", "Beauty", "Books"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Description" wide>
            <textarea rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Product description..." />
          </Field>
          <Field label="Status" wide>
            <div style={{ display: "flex", gap: 12 }}>
              {["Active", "Draft"].map((s) => (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: 6, color: "#bbb", fontSize: 12 }}>
                  <input type="radio" checked={form.status === s} onChange={() => setField("status", s)} /> {s}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button className="admin-min-btn" onClick={() => setForm({ name: "", category: "Electronic", price: "", stock: "", description: "", status: "Active" })}>Reset</button>
          <button className="admin-solid-btn" onClick={async () => {
            const payload = {
              name: form.name,
              price: Number(form.price || 0),
              oldPrice: Number(form.price || 0),
              rating: 5,
              reviews: 0,
              stock: form.status === "Active" ? "en stock" : "consultar disponibilidad",
              img: "laptop",
              category: form.category,
              color: "negro",
              brand: "Custom",
              cpu: "",
              featured: form.description,
              vdPorts: "",
            };
            try {
              await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
            } catch {
              // Fallback to local only mode.
            }
            addProduct(payload);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}>
            {saved ? <><Check size={14} /> Saved!</> : "Save Product"}
          </button>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 12 }}>
        <Card style={{ padding: 14 }}>
          <p className="admin-card-title">Product Image</p>
          <div style={{ border: "2px dashed #2c2c2c", borderRadius: 12, padding: 24, textAlign: "center", display: "grid", gap: 6 }}>
            <HardDriveUpload size={28} color="#777" style={{ margin: "0 auto" }} />
            <p style={{ margin: 0, color: "#bbb", fontSize: 12 }}>Drop image here</p>
            <p style={{ margin: 0, color: "#666", fontSize: 11 }}>PNG, JPG up to 5MB</p>
            <button className="admin-min-btn" style={{ width: "fit-content", margin: "6px auto 0" }}>Browse Files</button>
          </div>
        </Card>

        <Card style={{ padding: 14 }}>
          <p className="admin-card-title">Quick Add</p>
          {[
            { name: "Smart Fitness Tracker", price: "$39.99", icon: "watch" as ProductIconKey },
            { name: "Leather Wallet", price: "$19.99", icon: "wallet" as ProductIconKey },
            { name: "Electric Hair Trimmer", price: "$34.99", icon: "trimmer" as ProductIconKey },
          ].map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <ProductIcon type={p.icon} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "#ddd", fontSize: 12 }}>{p.name}</p>
                <p style={{ margin: 0, color: "#c8960c", fontSize: 11 }}>{p.price}</p>
              </div>
              <button className="admin-solid-btn" style={{ padding: "4px 10px" }}><Plus size={12} /> Add</button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function ProductMediaPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const mediaKeys = ["monitor", "tower", "gaming-tower", "laptop", "gaming-tower2"];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Images", "Videos"].map((t, i) => <button key={t} className={`admin-pill ${i === 0 ? "active" : ""}`}>{t}</button>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <SearchBar value="" onChange={() => undefined} placeholder="Search media..." />
          <button className="admin-solid-btn"><HardDriveUpload size={14} /> Upload</button>
        </div>
      </div>

      <Card style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10 }}>
          <div style={{ border: "2px dashed #2c2c2c", borderRadius: 10, minHeight: 120, display: "grid", placeItems: "center", color: "#666" }}>
            <div style={{ textAlign: "center" }}>
              <Plus size={22} style={{ margin: "0 auto" }} />
              <p style={{ margin: "4px 0 0", fontSize: 11 }}>Upload new</p>
            </div>
          </div>
          {mediaKeys.map((m, i) => (
            <div
              key={i}
              onClick={() => setSelected((prev) => (prev === i ? null : i))}
              style={{
                border: `2px solid ${selected === i ? "#c8960c" : "#2c2c2c"}`,
                borderRadius: 10,
                minHeight: 120,
                background: selected === i ? "rgba(200,150,12,.08)" : "#171717",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                padding: 8,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 90, height: 68, margin: "0 auto", borderRadius: 8, border: "1px solid #2a2a2a", background: "#0f0f0f", display: "grid", placeItems: "center" }}>
                  <ProductImage type={m} />
                </div>
                <p style={{ margin: "8px 0 0", color: "#777", fontSize: 10 }}>{m}.svg</p>
                {selected === i && (
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
                    <button className="admin-solid-btn" style={{ padding: "4px 10px" }}>Use</button>
                    <button className="admin-icon-btn danger"><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProductReviewsPage() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Reviews" value={REVIEWS.length} sub="All time" />
        <StatCard label="Avg. Rating" value="4.2 / 5" sub="Customer average" />
        <StatCard label="Pending" value={REVIEWS.filter((r) => r.status === "Pending").length} sub="Awaiting approval" />
      </div>

      <Card>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #232323" }}>
          <p className="admin-card-title">Customer Reviews</p>
        </div>

        <div style={{ padding: "0 14px" }}>
          {REVIEWS.map((r) => (
            <div key={r.id} style={{ padding: "12px 0", borderBottom: "1px solid #232323" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#c8960c", color: "#111", display: "grid", placeItems: "center", fontWeight: 800 }}>
                    {r.customer[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 800 }}>{r.customer}</p>
                    <p style={{ margin: "1px 0 3px", color: "#c8960c", fontSize: 11 }}>{r.product}</p>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={13} color={i <= r.rating ? "#f59e0b" : "#555"} fill={i <= r.rating ? "#f59e0b" : "none"} />)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, color: "#777", fontSize: 11 }}>{r.date}</p>
                  <StatusBadge status={r.status} />
                </div>
              </div>
              <p style={{ margin: "8px 0 0 46px", color: "#bbb", fontSize: 12 }}>&quot;{r.comment}&quot;</p>
              <div style={{ display: "flex", gap: 8, margin: "8px 0 0 46px" }}>
                <button className="admin-solid-btn" style={{ padding: "4px 12px" }}><Check size={12} /> Approve</button>
                <button className="admin-icon-btn danger"><X size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CouponPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponsStore();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminCouponForm>({
    code: "",
    discount: "",
    type: "Percentage",
    minOrder: "0",
    maxUses: "100",
    expires: "31-12-2026",
    status: "Active",
  });

  const saveCoupon = async () => {
    if (!form.code.trim() || !form.discount.trim()) return;
    if (editingId !== null) {
      try {
        await fetch(`/api/admin/coupons/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code,
            discount: form.discount,
            type: form.type,
            minOrder: Number(form.minOrder || 0),
            maxUses: Number(form.maxUses || 0),
            expires: form.expires,
            status: form.status,
          }),
        });
      } catch {
        // Local store fallback.
      }
      updateCoupon(editingId, {
        code: form.code,
        discount: form.discount,
        type: form.type,
        minOrder: Number(form.minOrder || 0),
        maxUses: Number(form.maxUses || 0),
        expires: form.expires,
        status: form.status,
      });
    } else {
      try {
        await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: form.code,
            discount: form.discount,
            type: form.type,
            minOrder: Number(form.minOrder || 0),
            maxUses: Number(form.maxUses || 0),
            expires: form.expires,
            status: form.status,
          }),
        });
      } catch {
        // Local store fallback.
      }
      addCoupon({
        code: form.code,
        discount: form.discount,
        type: form.type,
        minOrder: Number(form.minOrder || 0),
        maxUses: Number(form.maxUses || 0),
        expires: form.expires,
        status: form.status,
      });
    }
    setShowCreate(false);
    setEditingId(null);
    setForm({ code: "", discount: "", type: "Percentage", minOrder: "0", maxUses: "100", expires: "31-12-2026", status: "Active" });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Coupons" value={coupons.length} />
        <StatCard label="Active" value={coupons.filter((c) => c.status === "Active").length} />
        <StatCard label="Total Uses" value={coupons.reduce((a, c) => a + c.uses, 0)} />
      </div>

      <Card>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #232323", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="admin-card-title">Coupon Codes</p>
          <button className="admin-solid-btn" onClick={() => setShowCreate((v) => !v)}><Plus size={14} /> New Coupon</button>
        </div>

        {showCreate && (
          <div style={{ padding: 12, borderBottom: "1px solid #232323", background: "rgba(200,150,12,.08)", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr)) auto", gap: 8, alignItems: "end" }}>
            <Field label="Code"><input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" /></Field>
            <Field label="Discount"><input value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} placeholder="10% or $20" /></Field>
            <Field label="Min Order"><input value={form.minOrder} onChange={(e) => setForm((f) => ({ ...f, minOrder: e.target.value }))} placeholder="50" /></Field>
            <Field label="Expires"><input value={form.expires} onChange={(e) => setForm((f) => ({ ...f, expires: e.target.value }))} placeholder="31-12-2025" /></Field>
            <button className="admin-solid-btn" onClick={saveCoupon}>Save</button>
          </div>
        )}

        <div className="admin-table-wrap">
        <table className="admin-table admin-table-lg">
          <thead>
            <tr>
              <th>Code</th><th>Discount</th><th>Type</th><th>Min Order</th><th>Uses</th><th>Expires</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td><span style={{ background: "#222", borderRadius: 6, padding: "3px 7px", color: "#c8960c", fontWeight: 700 }}>{c.code}</span></td>
                <td style={{ color: "#fff", fontWeight: 700 }}>{c.discount}</td>
                <td>{c.type}</td>
                <td>${c.minOrder}</td>
                <td>{c.uses}/{c.maxUses}</td>
                <td>{c.expires}</td>
                <td><StatusBadge status={c.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="admin-icon-btn" onClick={() => {
                      setEditingId(c.id);
                      setShowCreate(true);
                      setForm({ code: c.code, discount: c.discount, type: c.type, minOrder: String(c.minOrder), maxUses: String(c.maxUses), expires: c.expires, status: c.status as "Active" | "Expired" });
                    }}><FilePenLine size={13} /></button>
                    <button
                      className="admin-icon-btn danger"
                      onClick={async () => {
                        try {
                          await fetch(`/api/admin/coupons/${c.id}`, { method: "DELETE" });
                        } catch {
                          // Local delete fallback.
                        }
                        deleteCoupon(c.id);
                      }}
                    ><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}

function CategoriesPage() {
  const iconMap: Record<string, IconComponent> = {
    Electronic: Laptop,
    Fashion: ShoppingBag,
    Home: House,
    Sports: DumbbellIcon,
    Beauty: Star,
    Books: ListChecks,
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Categories" value={CATEGORIES.length} />
        <StatCard label="Active" value={CATEGORIES.filter((c) => c.status === "Active").length} />
        <StatCard label="Total Products" value={CATEGORIES.reduce((a, c) => a + c.products, 0)} />
        <StatCard label="Total Revenue" value={`$${(CATEGORIES.reduce((a, c) => a + c.revenue, 0) / 1000).toFixed(0)}K`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        {CATEGORIES.map((c) => {
          const Icon = iconMap[c.name] ?? Grid2x2;
          return (
            <Card key={c.name} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <IconWrap icon={Icon} />
                <StatusBadge status={c.status} />
              </div>
              <p style={{ margin: "0 0 4px", color: "#fff", fontWeight: 800 }}>{c.name}</p>
              <p style={{ margin: "0 0 10px", color: "#777", fontSize: 11 }}>{c.products} products</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#c8960c", fontWeight: 800 }}>${(c.revenue / 1000).toFixed(1)}K</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="admin-icon-btn"><FilePenLine size={13} /></button>
                  <button className="admin-icon-btn danger"><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          );
        })}

        <Card style={{ border: "2px dashed #2a2a2a", background: "#171717", minHeight: 160, display: "grid", placeItems: "center", cursor: "pointer" }}>
          <div style={{ textAlign: "center", color: "#777" }}>
            <Plus size={24} style={{ margin: "0 auto" }} />
            <p style={{ margin: "6px 0 0", fontSize: 12 }}>Add Category</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TransactionPage() {
  const total = TRANSACTIONS.filter((t) => t.status === "Success").reduce((a, t) => a + t.amount, 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Revenue" value={`$${total.toFixed(2)}`} sub="Successful transactions" />
        <StatCard label="Transactions" value={TRANSACTIONS.length} />
        <StatCard label="Success" value={TRANSACTIONS.filter((t) => t.status === "Success").length} />
        <StatCard label="Failed" value={TRANSACTIONS.filter((t) => t.status === "Failed").length} />
      </div>

      <Card>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #232323", display: "flex", justifyContent: "space-between" }}>
          <p className="admin-card-title">Transaction History</p>
          <button className="admin-min-btn"><FileDown size={14} /> Export CSV</button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction ID</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((t) => (
              <tr key={t.id}>
                <td><span style={{ background: "#222", borderRadius: 6, padding: "3px 7px", color: "#777" }}>{t.id}</span></td>
                <td style={{ color: "#c8960c", fontWeight: 700 }}>{t.orderId}</td>
                <td style={{ color: "#fff" }}>{t.customer}</td>
                <td style={{ color: "#fff", fontWeight: 700 }}>${t.amount.toFixed(2)}</td>
                <td>{t.method}</td>
                <td>{t.date}</td>
                <td><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function BrandPage() {
  const { brands, addBrand, updateBrand, deleteBrand } = useBrandsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AdminBrandForm>({
    name: "",
    country: "",
    products: "0",
    revenue: "0",
    status: "Active",
  });
  const iconMap: Record<string, IconComponent> = {
    Apple: SmartphoneIcon,
    Nike: ShoeIcon,
    Samsung: MonitorSmartphone,
    Adidas: DumbbellIcon,
    Sony: Headphones,
    LG: MonitorSmartphone,
  };

  const saveBrand = async () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      try {
        await fetch(`/api/admin/brands/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            country: form.country,
            products: Number(form.products || 0),
            revenue: Number(form.revenue || 0),
            status: form.status,
          }),
        });
      } catch {
        // Local store fallback.
      }
      updateBrand(editingId, {
        name: form.name,
        country: form.country,
        products: Number(form.products || 0),
        revenue: Number(form.revenue || 0),
        status: form.status,
      });
    } else {
      try {
        await fetch("/api/admin/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            country: form.country,
            products: Number(form.products || 0),
            revenue: Number(form.revenue || 0),
            status: form.status,
          }),
        });
      } catch {
        // Local store fallback.
      }
      addBrand({
        name: form.name,
        country: form.country,
        products: Number(form.products || 0),
        revenue: Number(form.revenue || 0),
        status: form.status,
      });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", country: "", products: "0", revenue: "0", status: "Active" });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Brands" value={brands.length} />
        <StatCard label="Active" value={brands.filter((b) => b.status === "Active").length} />
        <StatCard label="Total Revenue" value={`$${(brands.reduce((a, b) => a + b.revenue, 0) / 1000).toFixed(0)}K`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        {brands.map((b) => {
          const Icon = iconMap[b.name] ?? Building2;
          return (
            <Card key={b.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <IconWrap icon={Icon} />
                <StatusBadge status={b.status} />
              </div>
              <p style={{ margin: "0 0 2px", color: "#fff", fontSize: 15, fontWeight: 800 }}>{b.name}</p>
              <p style={{ margin: "0 0 8px", color: "#777", fontSize: 11 }}>{b.country} · {b.products} products</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#c8960c", fontWeight: 800 }}>${(b.revenue / 1000).toFixed(0)}K</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="admin-icon-btn" onClick={() => {
                    setEditingId(b.id);
                    setShowForm(true);
                    setForm({ name: b.name, country: b.country, products: String(b.products), revenue: String(b.revenue), status: b.status as "Active" | "Inactive" });
                  }}><FilePenLine size={13} /></button>
                  <button
                    className="admin-icon-btn danger"
                    onClick={async () => {
                      try {
                        await fetch(`/api/admin/brands/${b.id}`, { method: "DELETE" });
                      } catch {
                        // Local delete fallback.
                      }
                      deleteBrand(b.id);
                    }}
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          );
        })}

        <div onClick={() => setShowForm(true)} style={{ cursor: "pointer" }}>
          <Card style={{ border: "2px dashed #2a2a2a", background: "#171717", minHeight: 160, display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center", color: "#777" }}>
              <Plus size={24} style={{ margin: "0 auto" }} />
              <p style={{ margin: "6px 0 0", fontSize: 12 }}>Add Brand</p>
            </div>
          </Card>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <Card style={{ width: "min(560px, 95vw)", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p className="admin-card-title">{editingId !== null ? "Edit Brand" : "New Brand"}</p>
              <button className="admin-icon-btn" onClick={() => setShowForm(false)}><X size={14} /></button>
            </div>
            <div className="admin-form-grid">
              <Field label="Name"><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
              <Field label="Country"><input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} /></Field>
              <Field label="Products"><input type="number" value={form.products} onChange={(e) => setForm((f) => ({ ...f, products: e.target.value }))} /></Field>
              <Field label="Revenue"><input type="number" value={form.revenue} onChange={(e) => setForm((f) => ({ ...f, revenue: e.target.value }))} /></Field>
              <Field label="Status" wide>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "Active" | "Inactive" }))}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="admin-min-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-solid-btn" onClick={saveBrand}>{editingId !== null ? "Save" : "Create"}</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function AdminRolePage() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
        <StatCard label="Total Roles" value={ADMIN_ROLES.length} />
        <StatCard label="Total Admins" value={ADMIN_ROLES.reduce((a, r) => a + r.users, 0)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
        {ADMIN_ROLES.map((r) => (
          <Card key={r.role} style={{ padding: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${r.color}22`, display: "grid", placeItems: "center", marginBottom: 10 }}>
              <ShieldCheck size={19} color={r.color} />
            </div>
            <p style={{ margin: "0 0 4px", color: "#fff", fontWeight: 800 }}>{r.role}</p>
            <p style={{ margin: "0 0 8px", color: "#777", fontSize: 11 }}>{r.users} users</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {r.permissions.map((p) => (
                <span key={p} style={{ padding: "3px 7px", borderRadius: 20, fontSize: 10, fontWeight: 700, color: r.color, background: `${r.color}22` }}>
                  {p}
                </span>
              ))}
            </div>
            <button className="admin-min-btn" style={{ width: "100%", borderColor: r.color, color: r.color }}>Edit Role</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ControlAuthorityPage() {
  const [perms, setPerms] = useState<Record<string, Record<string, boolean>>>({
    "Product Manager": { Products: true, Categories: true, Brands: true, Media: true, Coupons: false, Orders: false, Customers: false, Transactions: false, Reviews: true, "Admin Role": false },
    "Order Manager": { Products: false, Categories: false, Brands: false, Media: false, Coupons: false, Orders: true, Customers: true, Transactions: true, Reviews: false, "Admin Role": false },
    Support: { Products: false, Categories: false, Brands: false, Media: false, Coupons: true, Orders: false, Customers: true, Transactions: false, Reviews: true, "Admin Role": false },
  });

  const allPerms = ["Products", "Categories", "Brands", "Media", "Coupons", "Orders", "Customers", "Transactions", "Reviews", "Admin Role"];

  return (
    <Card style={{ padding: 14 }}>
      <p className="admin-card-title">Permission Matrix</p>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 840 }}>
          <thead>
            <tr>
              <th>Permission</th>
              {Object.keys(perms).map((r) => <th key={r}>{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {allPerms.map((perm, i) => (
              <tr key={perm} style={{ background: i % 2 === 0 ? "transparent" : "#151515" }}>
                <td style={{ color: "#fff", fontWeight: 700 }}>{perm}</td>
                {Object.keys(perms).map((role) => (
                  <td key={role} style={{ textAlign: "center" }}>
                    <button
                      onClick={() => setPerms((prev) => ({ ...prev, [role]: { ...prev[role], [perm]: !prev[role][perm] } }))}
                      style={{ width: 38, height: 20, borderRadius: 10, border: "none", cursor: "pointer", background: perms[role][perm] ? "#c8960c" : "#3a3a3a", position: "relative" }}
                    >
                      <span style={{ position: "absolute", top: 2, left: perms[role][perm] ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: perms[role][perm] ? "#111" : "#ddd", transition: "left .15s" }} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="admin-min-btn">Reset</button>
        <button className="admin-solid-btn">Save Changes</button>
      </div>
    </Card>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label style={{ display: "grid", gap: 5, gridColumn: wide ? "1 / -1" : undefined }}>
      <span style={{ color: "#777", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
      {children}
    </label>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, user, logout } = useAuthStore();
  const { setProducts } = useProductsStore();
  const { setCoupons } = useCouponsStore();
  const { setBrands } = useBrandsStore();

  const [page, setPage] = useState<Page>("dashboard");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      try {
        const res = await fetch("/api/admin/bootstrap");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (Array.isArray(data.coupons) && data.coupons.length > 0) {
          setCoupons(data.coupons);
        }
        if (Array.isArray(data.brands) && data.brands.length > 0) {
          setBrands(data.brands);
        }
      } catch {
        // App keeps working in local store mode.
      }
    };
    bootstrap();
    return () => {
      mounted = false;
    };
  }, [setBrands, setCoupons, setProducts]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "grid", placeItems: "center", color: "#fff" }}>
        <Card style={{ padding: 28, width: "min(460px, 92vw)", textAlign: "center" }}>
          <ShieldCheck size={38} color="#c8960c" style={{ margin: "0 auto 10px" }} />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Acceso denegado</h2>
          <p style={{ color: "#777", margin: "8px 0 14px" }}>Necesitas iniciar sesión como administrador.</p>
          <button className="admin-solid-btn" onClick={() => navigate("/login")}>Ir al login</button>
        </Card>
      </div>
    );
  }

  const menuSections: Array<{ title: string; items: Array<{ id: Page; label: string; icon: IconComponent }> }> = [
    {
      title: "Main Menu",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "orders", label: "Order Management", icon: ClipboardList },
        { id: "customers", label: "Customers", icon: Users },
        { id: "coupon", label: "Coupon Code", icon: TicketPercent },
        { id: "categories", label: "Categories", icon: Grid2x2 },
        { id: "transaction", label: "Transaction", icon: CircleDollarSign },
        { id: "brand", label: "Brand", icon: Building2 },
      ],
    },
    {
      title: "Product",
      items: [
        { id: "add-product", label: "Add Products", icon: Plus },
        { id: "product-media", label: "Product Media", icon: ImageIcon },
        { id: "product-list", label: "Product List", icon: List },
        { id: "product-reviews", label: "Product Reviews", icon: Star },
      ],
    },
    {
      title: "Admin",
      items: [
        { id: "admin-role", label: "Admin Role", icon: UserCog },
        { id: "control-authority", label: "Control Authority", icon: Settings2 },
      ],
    },
  ];

  const meta = PAGE_META[page];

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;
      case "orders":
        return <OrdersPage />;
      case "customers":
        return <CustomersPage />;
      case "coupon":
        return <CouponPage />;
      case "categories":
        return <CategoriesPage />;
      case "transaction":
        return <TransactionPage />;
      case "brand":
        return <BrandPage />;
      case "add-product":
        return <AddProductPage />;
      case "product-media":
        return <ProductMediaPage />;
      case "product-list":
        return <ProductListPage />;
      case "product-reviews":
        return <ProductReviewsPage />;
      case "admin-role":
        return <AdminRolePage />;
      case "control-authority":
        return <ControlAuthorityPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="admin-root">
      <style>{`
        .admin-root{--gold:#c8960c;--bg:#0a0a0a;--panel:#121212;--line:#1f1f1f;--text:#e6e6e6;--muted:#777;display:flex;min-height:100vh;background:var(--bg);color:var(--text);font-family:'Satoshi',sans-serif}
        .admin-root *{box-sizing:border-box}
        .admin-sidebar{width:230px;min-width:230px;border-right:1px solid var(--line);background:#0f0f0f;padding:16px 10px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
        .admin-main{flex:1;padding:18px;overflow:auto;min-width:0}
        .admin-table{width:100%;border-collapse:collapse;font-size:12px}
        .admin-table th{padding:10px 12px;text-align:left;color:#777;border-bottom:1px solid #232323;background:#151515;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.6px}
        .admin-table td{padding:10px 12px;color:#bbb;border-bottom:1px solid #232323;vertical-align:middle}
        .admin-table tr:hover td{background:#151515}
        .admin-btn,.admin-pill,.admin-icon-btn,.admin-min-btn,.admin-page-btn,.admin-solid-btn{border:none;background:#1b1b1b;color:#bbb;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px}
        .admin-btn{padding:4px 12px;border-radius:999px;border:1px solid #2a2a2a;font-size:11px}
        .admin-btn.active{background:var(--gold);color:#111;border-color:var(--gold);font-weight:700}
        .admin-pill{padding:6px 12px;border-radius:999px;border:1px solid #2a2a2a;font-size:12px}
        .admin-pill.active{background:rgba(200,150,12,.18);border-color:rgba(200,150,12,.35);color:var(--gold);font-weight:700}
        .admin-icon-btn{width:28px;height:28px;border-radius:8px;border:1px solid #2a2a2a;justify-content:center}
        .admin-icon-btn.danger{color:#ef4444;border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08)}
        .admin-min-btn{padding:6px 11px;border-radius:8px;border:1px solid #2a2a2a;background:#181818;font-size:12px}
        .admin-page-btn{width:30px;height:30px;border-radius:8px;border:1px solid #2a2a2a;justify-content:center}
        .admin-page-btn.active{background:var(--gold);border-color:var(--gold);color:#111;font-weight:800}
        .admin-solid-btn{padding:7px 12px;border-radius:8px;background:var(--gold);color:#111;font-size:12px;font-weight:800}
        .admin-card-title{margin:0;color:#fff;font-size:14px;font-weight:800}
        .admin-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .admin-form-grid input,.admin-form-grid textarea,.admin-form-grid select{width:100%;padding:9px 10px;background:#171717;border:1px solid #2a2a2a;border-radius:8px;color:#ddd;outline:none;font-size:13px;font-family:inherit}
        .admin-table-wrap{overflow:auto;max-width:100%;-webkit-overflow-scrolling:touch;border-top:1px solid #232323}
        .admin-table-lg{min-width:860px}
        .admin-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.68);backdrop-filter:blur(2px);display:grid;place-items:center;z-index:70;padding:12px}
        .admin-scroll::-webkit-scrollbar{width:6px;height:6px}
        .admin-scroll::-webkit-scrollbar-thumb{background:#2f2f2f;border-radius:999px}
        @media (max-width:1200px){
          .admin-main{padding:14px}
        }
        @media (max-width:980px){
          .admin-root{display:block}
          .admin-sidebar{position:static;width:100%;height:auto;min-width:100%;border-right:none;border-bottom:1px solid #1f1f1f}
          .admin-main{padding:12px}
          .admin-table-lg{min-width:980px}
          .admin-form-grid{grid-template-columns:1fr}
        }
      `}</style>

      <aside className="admin-sidebar admin-scroll">
        <div style={{ padding: "4px 6px 14px", borderBottom: "1px solid #1f1f1f", marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: -0.3 }}>
            VENDO <span style={{ color: "#c8960c" }}>LAPTOPS</span>
          </div>
          <p style={{ margin: "3px 0 0", fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Admin Panel</p>
        </div>

        {menuSections.map((section) => (
          <div key={section.title} style={{ marginBottom: 10 }}>
            <p style={{ margin: "8px 6px", fontSize: 10, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.1 }}>{section.title}</p>
            <div style={{ display: "grid", gap: 3 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.id === page;
                return (
                  <button
                    key={item.id}
                    onClick={() => setPage(item.id)}
                    style={{
                      textAlign: "left",
                      border: "none",
                      borderRadius: 9,
                      background: active ? "rgba(200,150,12,.16)" : "transparent",
                      color: active ? "#fff" : "#999",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    <Icon size={14} color={active ? "#c8960c" : "#777"} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: "auto", borderTop: "1px solid #1f1f1f", paddingTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "0 6px" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#c8960c", color: "#111", display: "grid", placeItems: "center", fontWeight: 900 }}>
              {(user?.name || "A")[0]}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#fff", fontWeight: 700 }}>{user?.name || "Admin"}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
            </div>
          </div>
          <button className="admin-min-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 6 }} onClick={() => navigate("/")}><House size={13} /> Ver tienda</button>
          <button className="admin-icon-btn danger" style={{ width: "100%", height: 34, justifyContent: "center" }} onClick={async () => { await logout(); navigate("/login"); }}>
            <LogOut size={14} /> Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="admin-main admin-scroll">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -0.4 }}>{meta.title}</h1>
            <p style={{ margin: "2px 0 0", color: "#777", fontSize: 12 }}>{meta.subtitle}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Quick search" />
            <button className="admin-icon-btn"><Bell size={14} /></button>
            <button className="admin-icon-btn"><User size={14} /></button>
          </div>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}

function DumbbellIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M3 8v8M6 6v12M18 6v12M21 8v8M6 12h12"/></svg>;
}
function CoffeeIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M4 8h12v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM16 10h2a2 2 0 0 1 0 4h-2M7 4v2M10 4v2"/></svg>;
}
function CameraIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M4 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>;
}
function BulbIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12c.8.6 1.6 2 1.8 3h4.4c.2-1 .9-2.3 1.8-3A7 7 0 0 0 12 2z"/></svg>;
}
function KettleIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M7 10h8a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-1a5 5 0 0 1 5-5zM9 7a3 3 0 0 1 3-3h2M18 10V7h2"/></svg>;
}
function YogaIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM6 21a6 6 0 0 1 12 0M8 12h8M7 16h10"/></svg>;
}
function SmartphoneIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>;
}
function ShoeIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M3 14h4l2-4h2l2 3 4 1 4 2v3H3z"/></svg>;
}
function WatchIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><rect x="7" y="7" width="10" height="10" rx="3"/><path d="M9 2h6l1 4H8zM9 22h6l1-4H8z"/></svg>;
}
function TrimmerIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M8 3h8v5H8zM9 8v13h6V8"/></svg>;
}
function CapIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M4 13a8 8 0 0 1 16 0v2H4zM6 15v3h12v-3"/></svg>;
}
function PhoneIcon(props: { size?: number; color?: string }) {
  return <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.color ?? "currentColor"} strokeWidth="1.9"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.2 19.2 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2l-1.2 1.2a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z"/></svg>;
}
