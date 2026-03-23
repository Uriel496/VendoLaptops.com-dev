import img1 from "../assets/img/img-products/image 29.svg";
import img2 from "../assets/img/img-products/image 29-1.svg";
import img3 from "../assets/img/img-products/image 29-2.svg";
import img4 from "../assets/img/img-products/image 29-3.svg";
import imgMonitor from "../assets/img/img-products/image 32.svg";

export type DetailSpec = { k: string; v: string };
export type DetailColor = { name: string; hex: string };
export type RelatedProduct = { name: string; price: number; rating: number; img: string };
export type VideoReview = { title: string; bg: string };
export type UserComment = {
  name: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  avatar: string;
  avatarBg: string;
};

export interface ProductDetailContent {
  displayName: string;
  category: string;
  sold: number;
  colors: DetailColor[];
  thumbs: string[];
  specsShort: DetailSpec[];
  specsFull: DetailSpec[];
  bought: RelatedProduct[];
  reviewVideos: VideoReview[];
  comments: UserComment[];
}

const BG_SET = [
  "linear-gradient(135deg,#1a3a12 0%,#4a8a2a 100%)",
  "linear-gradient(135deg,#1a1a3a 0%,#3a3a8a 100%)",
  "linear-gradient(135deg,#2a1018 0%,#1a1a2a 100%)",
  "linear-gradient(135deg,#3a2410 0%,#805018 100%)",
];

export const PRODUCT_IMAGE_BY_TYPE: Record<string, string> = {
  monitor: imgMonitor,
  tower: img2,
  "gaming-tower": img3,
  laptop: img4,
  "gaming-tower2": img1,
};

export function getThumbsForType(type: string): string[] {
  const main = PRODUCT_IMAGE_BY_TYPE[type] ?? img1;
  return [main, img1, img2, img3, img4, main];
}

export const PRODUCT_DETAILS: Record<number, ProductDetailContent> = {
  1: {
    displayName: "MSI Pro 16 Flex-036AU 15.6 pulgadas Multitouch Gaming",
    category: "Monitores",
    sold: 91,
    colors: [
      { name: "Negro Carbon", hex: "#1f2937" },
      { name: "Grafito", hex: "#374151" },
    ],
    thumbs: [imgMonitor, img1, imgMonitor, img2, img3, imgMonitor],
    specsShort: [
      { k: "Marca", v: "MSI" },
      { k: "Modelo", v: "Pro 16 Flex-036AU" },
      { k: "Pantalla", v: "15.6 pulgadas" },
      { k: "Panel", v: "IPS 165Hz" },
      { k: "Resolucion", v: "2560 x 1440" },
    ],
    specsFull: [
      { k: "Frecuencia", v: "165Hz con tiempo de respuesta de 1ms" },
      { k: "Cobertura de color", v: "98% DCI-P3 calibrado de fabrica" },
      { k: "Brillo", v: "400 nits con certificacion HDR400" },
      { k: "Conectividad", v: "2x HDMI 2.1, DisplayPort 1.4, USB-C" },
      { k: "Ergonomia", v: "Ajuste de altura, giro y pivote" },
      { k: "Incluye", v: "Base metalica, cable DP y manual rapido" },
    ],
    bought: [
      { name: "Brazo VESA premium para monitor 17-32 pulgadas", price: 79.99, rating: 4.7, img: img1 },
      { name: "Mouse gamer inalambrico 26000 DPI", price: 59.99, rating: 4.6, img: img2 },
      { name: "Teclado mecanico TKL switch rojo", price: 89.0, rating: 4.5, img: img3 },
      { name: "Tapete XL antideslizante de baja friccion", price: 24.5, rating: 4.4, img: img4 },
      { name: "Webcam 2K con microfono dual", price: 69.99, rating: 4.3, img: img1 },
      { name: "Headset 7.1 con cancelacion de ruido", price: 74.9, rating: 4.5, img: img2 },
    ],
    reviewVideos: [
      { title: "MSI Pro 16 Flex: prueba real de colores y respuesta", bg: BG_SET[0] },
      { title: "Configura este monitor para gaming competitivo", bg: BG_SET[1] },
      { title: "Comparativa MSI Pro 16 Flex vs paneles 240Hz", bg: BG_SET[2] },
      { title: "Top settings para productividad y stream", bg: BG_SET[3] },
    ],
    comments: [
      { name: "Alejandro", date: "2 de enero de 2026", rating: 4.8, text: "La nitidez es excelente para juegos y edicion. Los colores vienen muy bien ajustados desde fabrica.", likes: 21, dislikes: 1, avatar: "A", avatarBg: "#dde8f0" },
      { name: "Laura", date: "14 de febrero de 2026", rating: 4.6, text: "Muy buen balance entre precio y prestaciones. El soporte ergonomico ayuda bastante en jornadas largas.", likes: 12, dislikes: 0, avatar: "L", avatarBg: "#f0e8dd" },
      { name: "Marco", date: "1 de marzo de 2026", rating: 4.5, text: "Lo uso para trabajo y gaming, sin ghosting notable y con brillo suficiente para oficina iluminada.", likes: 9, dislikes: 1, avatar: "M", avatarBg: "#e0ddf0" },
    ],
  },
  2: {
    displayName: "ASUS ROG G14 RTX 4060 i7 13a Gen Performance",
    category: "Desktops",
    sold: 138,
    colors: [
      { name: "Negro Mate", hex: "#111827" },
      { name: "Blanco Hielo", hex: "#d1d5db" },
    ],
    thumbs: [img2, img3, img1, img4, img2, img3],
    specsShort: [
      { k: "Marca", v: "ASUS" },
      { k: "Modelo", v: "ROG G14 RTX 4060" },
      { k: "Procesador", v: "Intel Core i7 13a Gen" },
      { k: "RAM", v: "32 GB DDR5" },
      { k: "Almacenamiento", v: "1 TB NVMe" },
    ],
    specsFull: [
      { k: "Tarjeta grafica", v: "NVIDIA RTX 4060 8GB GDDR6" },
      { k: "Enfriamiento", v: "Triple ventilador con control inteligente" },
      { k: "Fuente", v: "750W 80 Plus Gold" },
      { k: "Puertos", v: "USB-C, USB-A, LAN 2.5G, HDMI 2.1" },
      { k: "Red", v: "Wi-Fi 6E y Bluetooth 5.3" },
      { k: "SO", v: "Windows 11 Pro" },
    ],
    bought: [
      { name: "Monitor QHD 27 pulgadas 170Hz", price: 299.0, rating: 4.6, img: imgMonitor },
      { name: "Kit de ventiladores RGB 3 en 1", price: 49.99, rating: 4.4, img: img1 },
      { name: "SSD NVMe 2TB Gen4 alto rendimiento", price: 139.0, rating: 4.8, img: img3 },
      { name: "UPS 1500VA para proteccion de energia", price: 189.0, rating: 4.5, img: img4 },
      { name: "Auriculares gaming de baja latencia", price: 89.0, rating: 4.4, img: img2 },
      { name: "Teclado mecanico RGB aluminio", price: 109.0, rating: 4.5, img: img1 },
    ],
    reviewVideos: [
      { title: "ROG G14 RTX 4060: benchmarks en 1080p y 1440p", bg: BG_SET[1] },
      { title: "Temperaturas reales jugando 4 horas", bg: BG_SET[0] },
      { title: "Upgrade de RAM y SSD paso a paso", bg: BG_SET[3] },
      { title: "ROG G14 para stream y edicion", bg: BG_SET[2] },
    ],
    comments: [
      { name: "Carlos", date: "7 de enero de 2026", rating: 4.7, text: "Rinde brutal en shooters y el ruido esta bastante controlado incluso en sesiones largas.", likes: 30, dislikes: 2, avatar: "C", avatarBg: "#dde8f0" },
      { name: "Nadia", date: "11 de febrero de 2026", rating: 4.5, text: "Excelente para trabajar en 3D y tambien para jugar. Muy buen airflow para su tamano.", likes: 17, dislikes: 1, avatar: "N", avatarBg: "#e0ddf0" },
      { name: "Sergio", date: "5 de marzo de 2026", rating: 4.6, text: "El combo i7 + 4060 es perfecto para 1440p competitivo con buenos fps.", likes: 11, dislikes: 0, avatar: "S", avatarBg: "#f0e8dd" },
    ],
  },
  3: {
    displayName: "Razer Blade 15 inch 144Hz RGB Gaming Laptop",
    category: "Laptops",
    sold: 64,
    colors: [
      { name: "Mercury White", hex: "#f3f4f6" },
      { name: "Stealth Black", hex: "#111827" },
    ],
    thumbs: [img3, img2, img4, img1, img3, img2],
    specsShort: [
      { k: "Marca", v: "Razer" },
      { k: "Modelo", v: "Blade 15" },
      { k: "Pantalla", v: "15.6 pulgadas 144Hz" },
      { k: "RAM", v: "16 GB DDR5" },
      { k: "Disco", v: "1 TB NVMe" },
    ],
    specsFull: [
      { k: "Procesador", v: "Intel Core i7-13700H" },
      { k: "Graficos", v: "NVIDIA RTX 4070 Laptop GPU" },
      { k: "Bateria", v: "80Wh con carga rapida USB-C" },
      { k: "Teclado", v: "RGB por tecla con Razer Chroma" },
      { k: "Audio", v: "THX Spatial con doble altavoz" },
      { k: "Peso", v: "2.05 kg" },
    ],
    bought: [
      { name: "Base de enfriamiento para laptop 15-17", price: 39.99, rating: 4.4, img: img4 },
      { name: "Mochila reforzada gamer 17 pulgadas", price: 69.0, rating: 4.5, img: img2 },
      { name: "Mouse ultraligero 26000 DPI", price: 79.99, rating: 4.6, img: img1 },
      { name: "Adaptador USB-C multipuerto 8 en 1", price: 44.99, rating: 4.3, img: img3 },
      { name: "Soporte aluminio ergonomico", price: 29.99, rating: 4.4, img: img4 },
      { name: "Funda premium anti golpes 15.6", price: 34.99, rating: 4.2, img: img1 },
    ],
    reviewVideos: [
      { title: "Razer Blade 15: rendimiento AAA en alto", bg: BG_SET[2] },
      { title: "Analisis de pantalla 144Hz y latencia", bg: BG_SET[0] },
      { title: "Prueba de bateria en trabajo real", bg: BG_SET[1] },
      { title: "Vale la pena en 2026?", bg: BG_SET[3] },
    ],
    comments: [
      { name: "Diana", date: "9 de enero de 2026", rating: 4.4, text: "Diseño premium y muy buena experiencia en gaming. El teclado RGB se siente excelente.", likes: 16, dislikes: 1, avatar: "D", avatarBg: "#dde8f0" },
      { name: "Iván", date: "27 de febrero de 2026", rating: 4.6, text: "La pantalla y el rendimiento destacan muchisimo. Buena opcion para creadores y gamers.", likes: 13, dislikes: 0, avatar: "I", avatarBg: "#f0e8dd" },
      { name: "Paul", date: "3 de marzo de 2026", rating: 4.5, text: "Sigue siendo de las laptops mas solidas para jugar sin sacrificar portabilidad.", likes: 8, dislikes: 1, avatar: "P", avatarBg: "#e0ddf0" },
    ],
  },
  4: {
    displayName: "HP Pavilion 15 Intel Core i5 8GB RAM 512GB SSD",
    category: "Laptops",
    sold: 173,
    colors: [
      { name: "Plata", hex: "#d1d5db" },
      { name: "Azul oscuro", hex: "#1e3a8a" },
    ],
    thumbs: [img4, img2, img1, img3, img4, img1],
    specsShort: [
      { k: "Marca", v: "HP" },
      { k: "Modelo", v: "Pavilion 15" },
      { k: "Pantalla", v: "15.6 pulgadas FHD" },
      { k: "RAM", v: "8 GB DDR4" },
      { k: "Almacenamiento", v: "512 GB SSD" },
    ],
    specsFull: [
      { k: "Procesador", v: "Intel Core i5 12a Gen" },
      { k: "Grafica", v: "Intel Iris Xe" },
      { k: "Bateria", v: "Hasta 9 horas de uso mixto" },
      { k: "Conectividad", v: "Wi-Fi 6, Bluetooth 5.2" },
      { k: "Camara", v: "HD 720p con reduccion de ruido" },
      { k: "Peso", v: "1.75 kg" },
    ],
    bought: [
      { name: "Office 365 Personal 1 ano", price: 59.99, rating: 4.7, img: img1 },
      { name: "Mouse bluetooth silencioso", price: 19.99, rating: 4.4, img: img2 },
      { name: "Hub USB-C para trabajo remoto", price: 34.99, rating: 4.3, img: img3 },
      { name: "Mochila ejecutiva ligera 15.6", price: 44.0, rating: 4.5, img: img4 },
      { name: "Soporte plegable para laptop", price: 24.99, rating: 4.2, img: img2 },
      { name: "Disco externo SSD 1TB", price: 79.0, rating: 4.6, img: img1 },
    ],
    reviewVideos: [
      { title: "HP Pavilion 15 para estudio y trabajo remoto", bg: BG_SET[0] },
      { title: "Rendimiento real en tareas diarias", bg: BG_SET[3] },
      { title: "La mejor configuracion para productividad", bg: BG_SET[1] },
      { title: "Lo bueno y lo mejorable del Pavilion 15", bg: BG_SET[2] },
    ],
    comments: [
      { name: "Andrea", date: "6 de enero de 2026", rating: 4.3, text: "Cumple perfecto para oficina, clases y navegacion. El SSD hace que todo se sienta agil.", likes: 19, dislikes: 2, avatar: "A", avatarBg: "#dde8f0" },
      { name: "Felipe", date: "19 de febrero de 2026", rating: 4.2, text: "Buena relacion calidad-precio. Arranca rapido y no se calienta en uso normal.", likes: 10, dislikes: 1, avatar: "F", avatarBg: "#f0e8dd" },
      { name: "Raul", date: "28 de febrero de 2026", rating: 4.4, text: "Para universidad y trabajo va excelente. Pantalla correcta y teclado comodo.", likes: 7, dislikes: 0, avatar: "R", avatarBg: "#e0ddf0" },
    ],
  },
  5: {
    displayName: "Acer Predator Orion 3000 RTX 4070 Gaming Tower",
    category: "Desktops",
    sold: 83,
    colors: [
      { name: "Obsidian Black", hex: "#0f172a" },
      { name: "Arctic White", hex: "#e5e7eb" },
    ],
    thumbs: [img1, img3, img2, img4, img1, img3],
    specsShort: [
      { k: "Marca", v: "Acer" },
      { k: "Modelo", v: "Predator Orion 3000" },
      { k: "CPU", v: "Intel Core i7 14a Gen" },
      { k: "RAM", v: "32 GB DDR5" },
      { k: "SSD", v: "1 TB NVMe Gen4" },
    ],
    specsFull: [
      { k: "Tarjeta grafica", v: "NVIDIA RTX 4070 12GB" },
      { k: "Refrigeracion", v: "Sistema FrostBlade RGB" },
      { k: "Fuente", v: "800W 80 Plus Gold" },
      { k: "Expansion", v: "2 bahias extra + 2 ranuras M.2" },
      { k: "Puertos frontales", v: "USB-C, 2x USB-A, audio combo" },
      { k: "Chasis", v: "Torre compacta con panel lateral" },
    ],
    bought: [
      { name: "Monitor 32 pulgadas QHD 165Hz", price: 429.0, rating: 4.7, img: imgMonitor },
      { name: "Silla gamer ergonomica 4D", price: 249.0, rating: 4.5, img: img2 },
      { name: "Kit streaming webcam + microfono", price: 159.0, rating: 4.4, img: img3 },
      { name: "UPS online 2000VA", price: 349.0, rating: 4.6, img: img1 },
      { name: "SSD NVMe 4TB para librerias", price: 289.0, rating: 4.8, img: img4 },
      { name: "Mousepad speed XXL", price: 29.0, rating: 4.3, img: img2 },
    ],
    reviewVideos: [
      { title: "Predator Orion 3000: 4K y ray tracing en vivo", bg: BG_SET[1] },
      { title: "Pruebas de ruido y temperatura bajo carga", bg: BG_SET[2] },
      { title: "RTX 4070 en juegos competitivos", bg: BG_SET[0] },
      { title: "Setup completo para streaming", bg: BG_SET[3] },
    ],
    comments: [
      { name: "Victor", date: "3 de enero de 2026", rating: 4.7, text: "Equipo potentisimo para AAA en ultra. Muy estable y con margen para upgrades.", likes: 28, dislikes: 1, avatar: "V", avatarBg: "#dde8f0" },
      { name: "Karla", date: "15 de febrero de 2026", rating: 4.6, text: "Perfecta para gaming y render. El airflow del chasis es mejor de lo esperado.", likes: 14, dislikes: 1, avatar: "K", avatarBg: "#f0e8dd" },
      { name: "Jorge", date: "4 de marzo de 2026", rating: 4.5, text: "Gran rendimiento en 1440p/4K. Es una compra muy solida para varios anos.", likes: 9, dislikes: 0, avatar: "J", avatarBg: "#e0ddf0" },
    ],
  },
  6: {
    displayName: "Dell UltraBook XPS 13 Plus Business Professional",
    category: "Laptops",
    sold: 112,
    colors: [
      { name: "Platinum Silver", hex: "#d1d5db" },
      { name: "Graphite", hex: "#374151" },
    ],
    thumbs: [imgMonitor, img4, img2, img1, imgMonitor, img3],
    specsShort: [
      { k: "Marca", v: "Dell" },
      { k: "Modelo", v: "XPS 13 Plus" },
      { k: "Pantalla", v: "13.4 pulgadas OLED" },
      { k: "RAM", v: "16 GB LPDDR5" },
      { k: "Almacenamiento", v: "1 TB SSD" },
    ],
    specsFull: [
      { k: "Procesador", v: "Intel Core i7 13a Gen Evo" },
      { k: "Seguridad", v: "Lector de huella y TPM 2.0" },
      { k: "Bateria", v: "Hasta 12 horas en uso oficina" },
      { k: "Chasis", v: "Aluminio CNC ultraligero" },
      { k: "Audio", v: "Quad speakers con Waves MaxxAudio" },
      { k: "Peso", v: "1.24 kg" },
    ],
    bought: [
      { name: "Dock Thunderbolt 4 empresarial", price: 219.0, rating: 4.6, img: img1 },
      { name: "Monitor USB-C 27 pulgadas para oficina", price: 269.0, rating: 4.5, img: imgMonitor },
      { name: "Funda premium de piel sintetica", price: 39.99, rating: 4.2, img: img2 },
      { name: "Adaptador USB-C a HDMI 2.1", price: 24.99, rating: 4.4, img: img3 },
      { name: "Teclado compacto multi-dispositivo", price: 69.0, rating: 4.3, img: img4 },
      { name: "Mouse vertical ergonomico", price: 49.0, rating: 4.4, img: img2 },
    ],
    reviewVideos: [
      { title: "XPS 13 Plus para ejecutivos y movilidad", bg: BG_SET[3] },
      { title: "Analisis completo de pantalla OLED", bg: BG_SET[0] },
      { title: "Rendimiento en multitarea y oficina", bg: BG_SET[2] },
      { title: "Comparativa frente a ultrabooks 2026", bg: BG_SET[1] },
    ],
    comments: [
      { name: "Monica", date: "8 de enero de 2026", rating: 4.5, text: "Muy elegante, ligera y potente para trabajo profesional. La pantalla se ve increible.", likes: 20, dislikes: 1, avatar: "M", avatarBg: "#dde8f0" },
      { name: "Luis", date: "18 de febrero de 2026", rating: 4.4, text: "Excelente autonomia y construccion premium. Ideal para viajar y trabajar.", likes: 12, dislikes: 0, avatar: "L", avatarBg: "#f0e8dd" },
      { name: "Patricia", date: "1 de marzo de 2026", rating: 4.6, text: "Productividad total, muy rapida y silenciosa. De lo mejor en ultrabooks.", likes: 9, dislikes: 0, avatar: "P", avatarBg: "#e0ddf0" },
    ],
  },
};

export const FALLBACK_DETAIL: ProductDetailContent = {
  displayName: "Laptop Profesional de Alto Rendimiento",
  category: "Laptops",
  sold: 77,
  colors: [
    { name: "Negro", hex: "#111827" },
    { name: "Plata", hex: "#d1d5db" },
  ],
  thumbs: [img4, img1, img2, img3, img4, img1],
  specsShort: [
    { k: "Marca", v: "VendoLaptops" },
    { k: "Modelo", v: "Edition Pro" },
    { k: "Pantalla", v: "15.6 pulgadas" },
    { k: "RAM", v: "16 GB" },
    { k: "Disco", v: "512 GB SSD" },
  ],
  specsFull: [
    { k: "Procesador", v: "Intel Core i7 de ultima generacion" },
    { k: "Graficos", v: "GPU dedicada para trabajo y juego" },
    { k: "Conectividad", v: "Wi-Fi 6 y Bluetooth 5.3" },
    { k: "Puertos", v: "USB-C, USB-A, HDMI y audio" },
    { k: "Bateria", v: "Carga rapida con autonomia extendida" },
    { k: "Garantia", v: "12 meses directo con tienda" },
  ],
  bought: [
    { name: "Mouse inalambrico", price: 24.99, rating: 4.4, img: img2 },
    { name: "Funda protectora", price: 19.99, rating: 4.3, img: img1 },
    { name: "Hub USB-C", price: 34.99, rating: 4.2, img: img3 },
    { name: "Soporte de aluminio", price: 29.99, rating: 4.3, img: img4 },
    { name: "SSD externo 1TB", price: 79.99, rating: 4.6, img: img1 },
    { name: "Mochila premium", price: 49.99, rating: 4.4, img: img2 },
  ],
  reviewVideos: [
    { title: "Review completa del equipo", bg: BG_SET[0] },
    { title: "Rendimiento en uso diario", bg: BG_SET[1] },
    { title: "Lo mejor de esta configuracion", bg: BG_SET[2] },
    { title: "Comparativa con modelos similares", bg: BG_SET[3] },
  ],
  comments: [
    { name: "Cliente 1", date: "15 de febrero de 2026", rating: 4.4, text: "Muy buen producto y entrega puntual.", likes: 5, dislikes: 0, avatar: "C", avatarBg: "#dde8f0" },
    { name: "Cliente 2", date: "20 de febrero de 2026", rating: 4.5, text: "Rendimiento estable y excelente relacion precio-calidad.", likes: 7, dislikes: 1, avatar: "C", avatarBg: "#f0e8dd" },
    { name: "Cliente 3", date: "3 de marzo de 2026", rating: 4.3, text: "Buena experiencia en general, lo recomiendo.", likes: 4, dislikes: 0, avatar: "C", avatarBg: "#e0ddf0" },
  ],
};
