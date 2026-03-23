export type CatalogProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviews: number;
  stock: string;
  img: string;
  category: string;
  color: string;
  brand: string;
  cpu?: string;
  featured?: string;
  vdPorts?: string;
};

export const products: CatalogProduct[] = [
  { id: 1, name: "MSI Pro 16 Flex-036AU 15.6 pulgadas Multitouch", price: 899, oldPrice: 1299, rating: 5, reviews: 12, stock: "en stock", img: "monitor", category: "PCs todo en uno MSI", color: "negro", brand: "MSI", cpu: "Intel Core i7", featured: "Pantalla tactil", vdPorts: "HDMI / USB-C" },
  { id: 2, name: "ASUS ROG G14 RTX 4060 i7 13a Gen Performance", price: 1299, oldPrice: 1699, rating: 5, reviews: 18, stock: "en stock", img: "tower", category: "PCs personalizadas", color: "negro", brand: "ASUS", cpu: "Intel Core i7", featured: "RTX 4060", vdPorts: "USB-C / DP" },
  { id: 3, name: "Razer Blade 15 144Hz RGB Gaming Laptop", price: 1599, oldPrice: 2199, rating: 4, reviews: 9, stock: "en stock", img: "gaming-tower", category: "PCs personalizadas", color: "blanco", brand: "Razer", cpu: "Intel Core i7", featured: "Panel 144Hz", vdPorts: "Thunderbolt / HDMI" },
  { id: 4, name: "HP Pavilion 15 Core i5 8GB RAM 512GB SSD", price: 649, oldPrice: 799, rating: 4, reviews: 15, stock: "consultar disponibilidad", img: "laptop", category: "PCs HP/Compaq", color: "rojo", brand: "HP", cpu: "Intel Core i5", featured: "SSD 512GB", vdPorts: "HDMI / USB-A" },
  { id: 5, name: "Acer Predator Orion 3000 RTX 4070 Gaming Tower", price: 1899, oldPrice: 2599, rating: 5, reviews: 22, stock: "en stock", img: "gaming-tower2", category: "PCs personalizadas", color: "negro", brand: "Acer", cpu: "Intel Core i7", featured: "RTX 4070", vdPorts: "HDMI / LAN" },
  { id: 6, name: "Dell UltraBook XPS 13 Plus Business Pro", price: 1199, oldPrice: 1599, rating: 5, reviews: 24, stock: "en stock", img: "monitor", category: "PCs HP/Compaq", color: "blanco", brand: "Dell", cpu: "Intel Core i7", featured: "OLED 13.4", vdPorts: "USB-C" },
  { id: 7, name: "Lenovo ThinkPad X1 Carbon Core i7 Premium", price: 1399, oldPrice: 1899, rating: 4, reviews: 16, stock: "en stock", img: "tower", category: "PCs HP/Compaq", color: "negro", brand: "Lenovo", cpu: "Intel Core i7", featured: "Ultraligera", vdPorts: "HDMI / USB-C" },
  { id: 8, name: "GIGABYTE RTX 4090 Gaming Desktop Supreme", price: 2799, oldPrice: 3599, rating: 5, reviews: 31, stock: "en stock", img: "gaming-tower", category: "PCs personalizadas", color: "rojo", brand: "GIGABYTE", cpu: "Ryzen 9", featured: "RTX 4090", vdPorts: "DP / HDMI" },
  { id: 9, name: "Asus ZenBook 14 OLED Touchscreen Ultraportatil", price: 899, oldPrice: 1199, rating: 5, reviews: 19, stock: "consultar disponibilidad", img: "laptop", category: "PCs HP/Compaq", color: "blanco", brand: "ASUS", cpu: "Intel Core i5", featured: "OLED tactil", vdPorts: "USB-C / HDMI" },
  { id: 10, name: "Thermaltake Tower Advanced Liquid Cooling RGB", price: 1699, oldPrice: 2299, rating: 4, reviews: 11, stock: "en stock", img: "gaming-tower2", category: "PCs personalizadas", color: "negro", brand: "Thermaltake", cpu: "Intel Core i7", featured: "Refrigeracion liquida", vdPorts: "USB-C / LAN" },
  { id: 11, name: "MSI Stealth 15M Ultra Thin Gaming i7", price: 1099, oldPrice: 1499, rating: 5, reviews: 14, stock: "en stock", img: "monitor", category: "PCs todo en uno MSI", color: "negro", brand: "MSI", cpu: "Intel Core i7", featured: "Diseno delgado", vdPorts: "HDMI / USB-C" },
  { id: 12, name: "HP Omen Transcend 14 Portable Gaming", price: 1599, oldPrice: 2099, rating: 5, reviews: 20, stock: "en stock", img: "tower", category: "PCs HP/Compaq", color: "rojo", brand: "HP", cpu: "Intel Core Ultra 7", featured: "144Hz", vdPorts: "USB-C / HDMI" },
  { id: 13, name: "MSI Creator Z16 Studio para diseno", price: 1749, oldPrice: 2199, rating: 4, reviews: 8, stock: "en stock", img: "laptop", category: "PCs todo en uno MSI", color: "blanco", brand: "MSI", cpu: "Intel Core i9", featured: "Pantalla QHD+", vdPorts: "Thunderbolt 4" },
  { id: 14, name: "HP EliteDesk Mini empresarial", price: 729, oldPrice: 899, rating: 4, reviews: 6, stock: "en stock", img: "gaming-tower2", category: "PCs HP/Compaq", color: "negro", brand: "HP", cpu: "Intel Core i5", featured: "Formato mini", vdPorts: "DP / USB-C" },
  { id: 15, name: "Custom Ryzen 7 RTX 4070 para streaming", price: 2099, oldPrice: 2499, rating: 5, reviews: 13, stock: "en stock", img: "gaming-tower", category: "PCs personalizadas", color: "rojo", brand: "ADATA", cpu: "Ryzen 7", featured: "Streaming Ready", vdPorts: "HDMI / DP" },
  { id: 16, name: "Dell Latitude 7440 para oficina premium", price: 1249, oldPrice: 1499, rating: 4, reviews: 10, stock: "consultar disponibilidad", img: "tower", category: "PCs HP/Compaq", color: "negro", brand: "Dell", cpu: "Intel Core i7", featured: "Seguridad TPM", vdPorts: "USB-C" },
  { id: 17, name: "MSI Modern 14 para estudio y trabajo", price: 799, oldPrice: 999, rating: 4, reviews: 17, stock: "en stock", img: "monitor", category: "PCs todo en uno MSI", color: "blanco", brand: "MSI", cpu: "Intel Core i5", featured: "Peso ligero", vdPorts: "HDMI / USB-A" },
  { id: 18, name: "HP Victus 15 gaming de entrada", price: 949, oldPrice: 1199, rating: 4, reviews: 21, stock: "en stock", img: "laptop", category: "PCs HP/Compaq", color: "rojo", brand: "HP", cpu: "Ryzen 5", featured: "RTX 3050", vdPorts: "HDMI / USB-C" },
  { id: 19, name: "Custom Intel i9 RTX 4080 creator build", price: 2599, oldPrice: 3099, rating: 5, reviews: 7, stock: "en stock", img: "gaming-tower2", category: "PCs personalizadas", color: "negro", brand: "GIGABYTE", cpu: "Intel Core i9", featured: "Edicion 4K", vdPorts: "DP / Thunderbolt" },
  { id: 20, name: "Lenovo IdeaPad Slim 5 OLED 14 pulgadas", price: 879, oldPrice: 1099, rating: 4, reviews: 18, stock: "en stock", img: "laptop", category: "PCs HP/Compaq", color: "blanco", brand: "Lenovo", cpu: "Ryzen 7", featured: "OLED 2.8K", vdPorts: "USB-C / HDMI" },
];

export const brands = Array.from(new Set(products.map((product) => product.brand)));

export const navItems = ["Arma tu PC", "Rigs Personalizados", "Piezas PRO", "Accesorios Gamer", "Pantallas Ultras", "Sonido Inmersivo", "Conectividad Total", "Flash Sales"];

export const categories = [
  { label: "PCs personalizadas", img: "gaming-tower" },
  { label: "Laptops", img: "laptop" },
  { label: "Desktops", img: "gaming-tower2" },
  { label: "Monitores", img: "monitor" },
];
