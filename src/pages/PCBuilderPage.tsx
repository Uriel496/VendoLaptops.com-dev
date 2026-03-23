import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { HexagonBackground } from "../components/animate-ui/components/backgrounds/hexagon";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { IconType } from "react-icons";
import {
  FiBarChart2,
  FiBox,
  FiCheck,
  FiCpu,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiHardDrive,
  FiHeart,
  FiHome,
  FiLayers,
  FiMonitor,
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiCheckCircle,
  FiAlertTriangle,
  FiWind,
  FiZap,
  FiX,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
type StepKey = "cpu" | "board" | "ram" | "gpu" | "storage" | "cooling" | "psu" | "case";
type Component = {
  id: string; name: string; brand: string; price: number;
  specs: string[]; badge?: string; watts?: number;
  socket?: string; chipset?: string; formFactor?: string;
  ramType?: string; tdp?: number; rgb?: boolean;
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const STEPS: { key: StepKey; label: string; short: string; Icon: IconType; color: string }[] = [
  { key:"cpu",     label:"Procesador",     short:"CPU",     Icon:FiCpu,       color:"#c8960c" },
  { key:"board",   label:"Placa Base",     short:"BOARD",   Icon:FiLayers,    color:"#2d8a4e" },
  { key:"ram",     label:"Memoria RAM",    short:"RAM",     Icon:FiBarChart2, color:"#2d6a8a" },
  { key:"gpu",     label:"Tarjeta Grafica",short:"GPU",     Icon:FiMonitor,   color:"#8a2d8a" },
  { key:"storage", label:"Almacenamiento", short:"STORAGE", Icon:FiHardDrive, color:"#8a5a2d" },
  { key:"cooling", label:"Enfriamiento",   short:"COOLING", Icon:FiWind,      color:"#2d7a8a" },
  { key:"psu",     label:"Fuente de poder",short:"PSU",     Icon:FiZap,       color:"#cc4444" },
  { key:"case",    label:"Gabinete",       short:"CASE",    Icon:FiBox,       color:"#555" },
];

const COMPONENTS: Record<StepKey, Component[]> = {
  cpu: [
    { id:"i9-14900k", name:"Intel Core i9-14900K", brand:"Intel", price:589, specs:["24 Cores","5.6GHz","LGA1700","125W TDP"], badge:"BESTSELLER", watts:125, socket:"LGA1700", tdp:125 },
    { id:"r9-7950x",  name:"AMD Ryzen 9 7950X",    brand:"AMD",   price:699, specs:["16 Cores","5.7GHz","AM5","170W TDP"],    badge:"FLAGSHIP",   watts:170, socket:"AM5",     tdp:170 },
    { id:"i7-14700k", name:"Intel Core i7-14700K",  brand:"Intel", price:409, specs:["20 Cores","5.6GHz","LGA1700","125W"],   badge:"VALOR",       watts:125, socket:"LGA1700", tdp:125 },
    { id:"r7-7700x",  name:"AMD Ryzen 7 7700X",     brand:"AMD",   price:299, specs:["8 Cores","5.4GHz","AM5","105W"],                              watts:105, socket:"AM5",     tdp:105 },
    { id:"i5-14600k", name:"Intel Core i5-14600K",  brand:"Intel", price:299, specs:["14 Cores","5.3GHz","LGA1700","125W"],   badge:"RECOMENDADO", watts:125, socket:"LGA1700", tdp:125 },
  ],
  board: [
    { id:"rog-z790",  name:"ROG STRIX Z790-E GAMING WIFI II", brand:"ASUS",   price:499, specs:["DDR5","WIFI7","ATX"],       badge:"BESTSELLER", socket:"LGA1700", formFactor:"ATX",   ramType:"DDR5" },
    { id:"msi-z790",  name:"MSI MPG Z790 EDGE TI MAX WIFI",   brand:"MSI",    price:359, specs:["DDR5","USB 4.0","ATX"],                          socket:"LGA1700", formFactor:"ATX",   ramType:"DDR5" },
    { id:"asrock",    name:"ASRock Z790 Taichi Lite",          brand:"ASRock", price:299, specs:["DDR5","THUNDERBOLT","E-ATX"],                    socket:"LGA1700", formFactor:"E-ATX", ramType:"DDR5" },
    { id:"gigabyte",  name:"GIGABYTE Z790 AORUS MASTER",       brand:"Gigabyte",price:449, specs:["DDR5","WIFI6E","ATX"],    badge:"PREMIUM",    socket:"LGA1700", formFactor:"ATX",   ramType:"DDR5" },
    { id:"am5-asus",  name:"ASUS ROG CROSSHAIR X670E",         brand:"ASUS",   price:599, specs:["DDR5","WIFI6E","ATX"],    badge:"AM5",        socket:"AM5",     formFactor:"ATX",   ramType:"DDR5" },
  ],
  ram: [
    { id:"corsair-64",name:"Corsair Dominator 64GB DDR5 6000", brand:"Corsair",  price:259, specs:["64GB","DDR5-6000","CL30","RGB"], badge:"BESTSELLER", watts:10, rgb:true },
    { id:"gskill-32", name:"G.Skill Trident Z5 32GB DDR5 7200",brand:"G.Skill",  price:189, specs:["32GB","DDR5-7200","CL34","RGB"],                     watts:8,  rgb:true },
    { id:"kingston",  name:"Kingston Fury Beast 32GB DDR5 5600",brand:"Kingston", price:109, specs:["32GB","DDR5-5600","CL36"],       badge:"VALOR",       watts:6 },
    { id:"teamgroup", name:"TeamGroup T-Force 64GB DDR5 6400",  brand:"TeamGroup",price:219, specs:["64GB","DDR5-6400","CL32","RGB"],                     watts:10, rgb:true },
  ],
  gpu: [
    { id:"rtx4090",  name:"NVIDIA RTX 4090 24GB",      brand:"NVIDIA", price:1599, specs:["24GB GDDR6X","450W TDP","PCIe 4.0"], badge:"SUPREMO",    watts:450, tdp:450 },
    { id:"rtx4080s", name:"NVIDIA RTX 4080 SUPER 16GB", brand:"NVIDIA", price:999,  specs:["16GB GDDR6X","320W TDP","PCIe 4.0"],  badge:"BESTSELLER", watts:320, tdp:320 },
    { id:"rx7900xtx",name:"AMD RX 7900 XTX 24GB",       brand:"AMD",    price:899,  specs:["24GB GDDR6","355W TDP","PCIe 4.0"],   badge:"RIVAL",      watts:355, tdp:355 },
    { id:"rtx4070ti",name:"NVIDIA RTX 4070 Ti 12GB",    brand:"NVIDIA", price:699,  specs:["12GB GDDR6X","285W TDP","PCIe 4.0"],  badge:"VALOR",      watts:285, tdp:285 },
    { id:"rx7800xt", name:"AMD RX 7800 XT 16GB",        brand:"AMD",    price:499,  specs:["16GB GDDR6","263W TDP","PCIe 4.0"],                    watts:263, tdp:263 },
  ],
  storage: [
    { id:"ssd-2tb",  name:"Samsung 990 Pro 2TB NVMe",  brand:"Samsung", price:169, specs:["7450 MB/s","PCIe 4.0","M.2"],  badge:"BESTSELLER" },
    { id:"ssd-4tb",  name:"WD Black SN850X 4TB NVMe",  brand:"WD",      price:299, specs:["7300 MB/s","PCIe 4.0","M.2"],  badge:"ENORME" },
    { id:"ssd-1tb",  name:"Crucial T700 1TB NVMe Gen5", brand:"Crucial", price:129, specs:["12400 MB/s","PCIe 5.0","M.2"], badge:"GEN 5" },
    { id:"ssd-2tb2", name:"Seagate FireCuda 530 2TB",   brand:"Seagate", price:149, specs:["7300 MB/s","PCIe 4.0","M.2"] },
  ],
  cooling: [
    { id:"lc360",    name:"Corsair iCUE H150i ELITE 360mm AIO", brand:"Corsair", price:199, specs:["360mm","3x120mm","RGB","LCD"], badge:"BESTSELLER", watts:15, rgb:true },
    { id:"lc240",    name:"NZXT Kraken Elite 240mm AIO",        brand:"NZXT",    price:179, specs:["240mm","2x120mm","LCD Screen"],                    watts:10 },
    { id:"air-dk",   name:"Noctua NH-D15 Air Cooler",           brand:"Noctua",  price:99,  specs:["Dual Tower","2x140mm","LGA1700"], badge:"SILENCIOSO", watts:2 },
    { id:"lc420",    name:"Corsair iCUE H170i ELITE 420mm AIO", brand:"Corsair", price:249, specs:["420mm","3x140mm","RGB","LCD"], badge:"MÁXIMO",      watts:18, rgb:true },
  ],
  psu: [
    { id:"psu-1000", name:"Corsair HX1000i 1000W 80+ Platinum", brand:"Corsair",   price:199, specs:["1000W","80+ Platinum","Modular"], badge:"BESTSELLER" },
    { id:"psu-850",  name:"EVGA SuperNOVA 850W 80+ Gold",       brand:"EVGA",      price:129, specs:["850W","80+ Gold","Modular"],      badge:"VALOR" },
    { id:"psu-1200", name:"Seasonic Prime TX-1200W 80+ Titanium",brand:"Seasonic",  price:299, specs:["1200W","80+ Titanium","Modular"], badge:"PREMIUM" },
    { id:"psu-750",  name:"be quiet! Straight Power 750W",      brand:"be quiet!", price:109, specs:["750W","80+ Gold","Semi-Modular"] },
  ],
  case: [
    { id:"case-lian",  name:"Lian Li PC-O11 Dynamic EVO XL",  brand:"Lian Li", price:189, specs:["Full Tower","Vidrio Temp.","E-ATX"], badge:"BESTSELLER" },
    { id:"case-frac",  name:"Fractal Design Torrent Compact",  brand:"Fractal", price:129, specs:["Mid Tower","Mesh Front","ATX"] },
    { id:"case-nzxt",  name:"NZXT H9 Elite",                   brand:"NZXT",    price:199, specs:["Mid Tower","Dual Cámara","ATX"],    badge:"VISTOSO", rgb:true },
    { id:"case-corsair",name:"Corsair 5000D Airflow",           brand:"Corsair", price:159, specs:["Mid Tower","Alta Ventilación","ATX"] },
  ],
};

const BASE_WATTS = 100;

/* ═══════════════════════════════════════════════════════════
   MINI COMPONENTS FOR 3D PREVIEW
═══════════════════════════════════════════════════════════ */
function PCPreview3D({ selected }: { selected: Record<StepKey, Component | null> }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  const hasCpu  = !!selected.cpu;
  const hasBoard= !!selected.board;
  const hasRam  = !!selected.ram;
  const hasGpu  = !!selected.gpu;
  const hasPsu  = !!selected.psu;
  const hasCase = !!selected.case;
  const hasStorage = !!selected.storage;
  const hasCooling = !!selected.cooling;
  const cameraDistance = 5.2 - zoomLevel * 1.6;

  return (
    <div style={{ position:"relative", width:"100%", height:"100%", background:"radial-gradient(circle at 25% 20%, #14213d 0%, #070b16 45%, #03050d 100%)", borderRadius:12, overflow:"hidden" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position:[0, 1.45, cameraDistance], fov:48 }}
        style={{ position:"absolute", inset:0 }}
      >
        <color attach="background" args={["#070b16"]} />
        <fog attach="fog" args={["#070b16", 6.2, 12.5]} />
        <hemisphereLight intensity={0.52} groundColor="#130f2a" color="#7dd3fc" />
        <ambientLight intensity={0.45} color="#7c3aed" />
        <directionalLight position={[3, 6, 2]} intensity={1.15} color="#e2e8f0" />
        <pointLight position={[-2.1, 2.1, 2.2]} intensity={1.05} color="#22d3ee" />
        <pointLight position={[2.5, 1.8, 1.5]} intensity={0.95} color="#a855f7" />
        <pointLight position={[0, -0.5, 2.4]} intensity={0.5} color="#f59e0b" />

        <group position={[0, 0.28, 0]}>
          {hasCase ? (
            <>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2.2, 2.6, 1.15]} />
                <meshStandardMaterial color="#1f2937" emissive="#0f172a" emissiveIntensity={0.32} metalness={0.35} roughness={0.3} transparent opacity={0.34} />
              </mesh>
              <mesh scale={[1.015, 1.015, 1.015]}>
                <boxGeometry args={[2.2, 2.6, 1.15]} />
                <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.3} />
              </mesh>
            </>
          ) : (
            <mesh>
              <boxGeometry args={[2.2, 2.6, 1.15]} />
              <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.72} />
            </mesh>
          )}

          {hasBoard && (
            <>
              <mesh position={[0, 0.04, 0.08]} castShadow>
                <boxGeometry args={[1.72, 2.16, 0.07]} />
                <meshStandardMaterial color="#0f766e" emissive="#0f766e" emissiveIntensity={0.3} metalness={0.24} roughness={0.5} />
              </mesh>
              {hasCase && (
                <mesh position={[0, 0.04, 0.08]} scale={[1.01, 1.01, 1.4]}>
                  <boxGeometry args={[1.72, 2.16, 0.07]} />
                  <meshBasicMaterial color="#2dd4bf" wireframe transparent opacity={0.45} />
                </mesh>
              )}
            </>
          )}

          {hasCpu && (
            <>
              <mesh position={[0, 0.62, 0.14]} castShadow>
                <boxGeometry args={[0.42, 0.42, 0.12]} />
                <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.48} metalness={0.45} roughness={0.28} />
              </mesh>
              {hasCase && (
                <mesh position={[0, 0.62, 0.14]} scale={[1.06, 1.06, 1.06]}>
                  <boxGeometry args={[0.42, 0.42, 0.12]} />
                  <meshBasicMaterial color="#fde047" wireframe transparent opacity={0.65} />
                </mesh>
              )}
            </>
          )}

          {hasRam && (
            <>
              <mesh position={[0.54, 0.62, 0.15]} castShadow>
                <boxGeometry args={[0.14, 0.92, 0.07]} />
                <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.38} metalness={0.3} roughness={0.33} />
              </mesh>
              {hasCase && (
                <mesh position={[0.54, 0.62, 0.15]} scale={[1.12, 1.06, 1.14]}>
                  <boxGeometry args={[0.14, 0.92, 0.07]} />
                  <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.62} />
                </mesh>
              )}
              <mesh position={[0.74, 0.62, 0.15]} castShadow>
                <boxGeometry args={[0.14, 0.92, 0.07]} />
                <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.38} metalness={0.3} roughness={0.33} />
              </mesh>
              {hasCase && (
                <mesh position={[0.74, 0.62, 0.15]} scale={[1.12, 1.06, 1.14]}>
                  <boxGeometry args={[0.14, 0.92, 0.07]} />
                  <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.62} />
                </mesh>
              )}
            </>
          )}

          {hasGpu && (
            <>
              <mesh position={[0.1, -0.42, 0.45]} rotation={[0, 0.08, 0]} castShadow>
                <boxGeometry args={[1.6, 0.42, 0.46]} />
                <meshStandardMaterial color="#c026d3" emissive="#7e22ce" emissiveIntensity={0.5} metalness={0.34} roughness={0.32} />
              </mesh>
              {hasCase && (
                <mesh position={[0.1, -0.42, 0.45]} rotation={[0, 0.08, 0]} scale={[1.04, 1.07, 1.04]}>
                  <boxGeometry args={[1.6, 0.42, 0.46]} />
                  <meshBasicMaterial color="#d946ef" wireframe transparent opacity={0.68} />
                </mesh>
              )}
            </>
          )}

          {hasStorage && (
            <>
              <mesh position={[-0.7, -0.76, 0.22]} castShadow>
                <boxGeometry args={[0.68, 0.16, 0.45]} />
                <meshStandardMaterial color="#fb923c" emissive="#c2410c" emissiveIntensity={0.3} metalness={0.3} roughness={0.45} />
              </mesh>
              {hasCase && (
                <mesh position={[-0.7, -0.76, 0.22]} scale={[1.07, 1.1, 1.07]}>
                  <boxGeometry args={[0.68, 0.16, 0.45]} />
                  <meshBasicMaterial color="#fb923c" wireframe transparent opacity={0.58} />
                </mesh>
              )}
            </>
          )}

          {hasPsu && (
            <>
              <mesh position={[-0.62, -0.98, 0.22]} castShadow>
                <boxGeometry args={[0.76, 0.34, 0.52]} />
                <meshStandardMaterial color="#ef4444" emissive="#b91c1c" emissiveIntensity={0.34} metalness={0.24} roughness={0.45} />
              </mesh>
              {hasCase && (
                <mesh position={[-0.62, -0.98, 0.22]} scale={[1.06, 1.06, 1.06]}>
                  <boxGeometry args={[0.76, 0.34, 0.52]} />
                  <meshBasicMaterial color="#f87171" wireframe transparent opacity={0.56} />
                </mesh>
              )}
            </>
          )}

          {hasCooling && (
            <>
              <mesh position={[0, 1.05, 0.15]} castShadow>
                <cylinderGeometry args={[0.26, 0.26, 0.2, 28]} />
                <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={0.42} metalness={0.38} roughness={0.3} />
              </mesh>
              {hasCase && (
                <mesh position={[0, 1.05, 0.15]} scale={[1.08, 1.08, 1.08]}>
                  <cylinderGeometry args={[0.26, 0.26, 0.2, 28]} />
                  <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.65} />
                </mesh>
              )}
            </>
          )}
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#111827" roughness={0.74} metalness={0.2} />
        </mesh>
        <ContactShadows position={[0, -1.18, 0]} opacity={0.18} blur={2.3} scale={6.4} far={4.8} />

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.9}
          enablePan={false}
          maxDistance={5.4}
          minDistance={2.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.95}
          target={[0, 0.16, 0]}
        />
      </Canvas>

      <div style={{
        position:"absolute",
        inset:0,
        pointerEvents:"none",
        background:"radial-gradient(circle at 18% 22%, rgba(34,211,238,.22), transparent 38%), radial-gradient(circle at 78% 24%, rgba(168,85,247,.2), transparent 34%), radial-gradient(circle at 52% 86%, rgba(245,158,11,.12), transparent 30%)",
      }} />

      {!hasBoard && !hasCpu && (
        <div style={{
          position:"absolute",
          left:"50%",
          top:"48%",
          transform:"translate(-50%, -50%)",
          textAlign:"center",
          color:"#6b7280",
          fontSize:12,
          pointerEvents:"none",
          lineHeight:1.45,
        }}>
          <div>Empieza a agregar</div>
          <div>componentes para ver tu build 3D</div>
        </div>
      )}

      {/* Controls */}
      <div style={{ position:"absolute", bottom:12, right:12, display:"flex", gap:8 }}>
        {[
          {
            action:()=>{ setAutoRotate(v=>!v); },
            title: autoRotate ? "Pausar rotacion" : "Reanudar rotacion",
            icon: autoRotate ? <FiPause size={13} /> : <FiPlay size={13} />,
          },
          {
            action:()=>setZoomLevel(v=>Math.min(1.6,v+0.12)),
            title:"Acercar vista",
            icon:<FiSearch size={13} />,
          },
          {
            action:()=>{ setZoomLevel(1); setAutoRotate(true); },
            title:"Reiniciar vista",
            icon:<FiRotateCcw size={13} />,
          },
        ].map((btn,i)=>(
          <button key={i} onClick={btn.action} title={btn.title} style={{
            width:30, height:30, borderRadius:6, background:"rgba(15,23,42,.78)",
            border:"1px solid rgba(34,211,238,.4)", color:"#67e8f9", fontSize:14,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 16px rgba(34,211,238,.18)",
          }}>{btn.icon}</button>
        ))}
      </div>

      {/* RGB badge */}
      {(selected.ram?.rgb || selected.cooling?.rgb || selected.case?.rgb) && (
        <div style={{ position:"absolute", top:10, left:10, background:"rgba(200,150,12,.15)", border:"1px solid rgba(200,150,12,.3)", borderRadius:4, padding:"2px 8px", fontSize:10, color:"#c8960c", fontWeight:700, display:"inline-flex", alignItems:"center", gap:5 }}>
          <HiSparkles size={12} />
          RGB
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WATTAGE BAR
═══════════════════════════════════════════════════════════ */
function WattageBar({ used, max }: { used: number; max: number }) {
  const pct = Math.min(100, (used / max) * 100);
  const color = pct > 90 ? "#cc4444" : pct > 70 ? "#e07020" : "#2d8a4e";
  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#888", marginBottom:3 }}>
        <span>Consumo estimado</span>
        <span style={{ color }}>{used}W / {max}W</span>
      </div>
      <div style={{ height:5, background:"#1a1a1a", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, #2d8a4e, ${color})`, borderRadius:3, transition:"width .5s ease" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPATIBILITY CHECK
═══════════════════════════════════════════════════════════ */
function checkCompatibility(selected: Record<StepKey, Component | null>): { ok: boolean; issues: string[] } {
  const issues: string[] = [];
  const cpu   = selected.cpu;
  const board = selected.board;
  if (cpu && board) {
    if (cpu.socket !== board.socket) issues.push(`CPU socket ${cpu.socket} ≠ Placa ${board.socket}`);
  }
  const psu  = selected.psu;
  const used = Object.values(selected).reduce((s,c)=>s+(c?.watts??0),0)+BASE_WATTS;
  if (psu) {
    const psuW = psu.id.includes("1200")?1200:psu.id.includes("1000")?1000:psu.id.includes("850")?850:750;
    if (used > psuW) issues.push(`Consumo (${used}W) supera PSU (${psuW}W)`);
  }
  return { ok: issues.length===0, issues };
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT CARD
═══════════════════════════════════════════════════════════ */
function ComponentCard({
  comp, isSelected, onSelect, compatible, onAddToFavorites, isFavorite
}: { comp:Component; isSelected:boolean; onSelect:()=>void; compatible:boolean; onAddToFavorites:()=>void; isFavorite:boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={onSelect}
      style={{
        background: isSelected ? "rgba(200,150,12,.08)" : hovered ? "rgba(255,255,255,.03)" : "#111",
        border: `1.5px solid ${isSelected ? "#c8960c" : compatible ? "#222" : "#662222"}`,
        borderRadius:10, padding:"14px", cursor:"pointer",
        transition:"all .2s", position:"relative",
        boxShadow: isSelected ? "0 0 0 1px rgba(200,150,12,.3), 0 8px 24px rgba(200,150,12,.1)" : "none",
      }}
    >
      {comp.badge && (
        <div style={{
          position:"absolute", top:10, left:10,
          background: comp.badge==="BESTSELLER"?"#c8960c": comp.badge==="FLAGSHIP"?"#8a2d8a": comp.badge==="VALOR"?"#2d6a8a":"#2d8a4e",
          color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px",
          borderRadius:3, letterSpacing:.8, textTransform:"uppercase" as const,
        }}>{comp.badge}</div>
      )}

      {isSelected && (
        <div style={{ position:"absolute", top:10, right:10, width:20, height:20, borderRadius:"50%", background:"#c8960c", display:"flex", alignItems:"center", justifyContent:"center", color:"#000" }}>
          <FiCheck size={12} />
        </div>
      )}

      {/* Favorite button */}
      <button
        onClick={(e)=>{e.stopPropagation();onAddToFavorites();}}
        style={{
          position:"absolute", top:10, right:isSelected?35:10,
          width:20, height:20, borderRadius:"50%",
          background:isFavorite?"rgba(204,68,68,.2)":"rgba(255,255,255,.05)",
          border:`1px solid ${isFavorite?"#cc4444":"#333"}`,
          color:isFavorite?"#cc4444":"#666",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:10, cursor:"pointer", transition:"all .2s"
        }}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <FiHeart size={10} style={{ fill:isFavorite ? "currentColor" : "none" }} />
      </button>

      {/* Component image placeholder */}
      <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10, marginTop:comp.badge?16:0 }}>
        <ComponentIcon type={comp.id} />
      </div>

      <div style={{ fontSize:12, fontWeight:700, color:"#fff", lineHeight:1.3, marginBottom:6 }}>{comp.name}</div>
      <div style={{ fontSize:10, color:"#888", marginBottom:8 }}>{comp.brand}</div>

      <div style={{ display:"flex", flexWrap:"wrap" as const, gap:4, marginBottom:10 }}>
        {comp.specs.map(s=>(
          <span key={s} style={{ fontSize:9, padding:"2px 7px", borderRadius:3, background:"#1a1a1a", color:"#888", border:"1px solid #2a2a2a" }}>{s}</span>
        ))}
        {comp.rgb && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:3, background:"rgba(200,150,12,.1)", color:"#c8960c", border:"1px solid rgba(200,150,12,.2)" }}>RGB</span>}
      </div>

      {!compatible && (
        <div style={{ fontSize:9, color:"#cc4444", marginBottom:6, display:"inline-flex", alignItems:"center", gap:4 }}>
          <FiAlertTriangle size={10} /> Incompatible
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontFamily:"'Satoshi',sans-serif", fontSize:20, fontWeight:800, color:"#c8960c" }}>${comp.price}</span>
        <button style={{
          padding:"6px 14px", borderRadius:5, fontSize:10, fontWeight:700,
          background: isSelected ? "#c8960c" : "transparent",
          border:`1.5px solid ${isSelected?"#c8960c":"#333"}`,
          color: isSelected ? "#000" : "#aaa",
          cursor:"pointer", letterSpacing:.5, textTransform:"uppercase" as const,
          fontFamily:"'Satoshi',sans-serif", transition:"all .15s",
        }}>
          {isSelected ? "Seleccionado" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}

/* ── Mini icons for cards ── */
function ComponentIcon({ type }: { type: string }) {
  const isCpu  = type.includes("i9")||type.includes("i7")||type.includes("i5")||type.includes("r9")||type.includes("r7");
  const isGpu  = type.includes("rtx")||type.includes("rx7");
  const isRam  = type.includes("corsair-")||type.includes("gskill")||type.includes("kingston")||type.includes("team");
  const isPsu  = type.startsWith("psu");
  const isSsd  = type.startsWith("ssd");
  const isCase = type.startsWith("case");
  const isLc   = type.startsWith("lc")||type.startsWith("air");

  const color = isCpu?"#c8960c":isGpu?"#8a2d8a":isRam?"#2d6a8a":isPsu?"#cc4444":isSsd?"#8a5a2d":isCase?"#555":isLc?"#2d7a8a":"#2d8a4e";

  return (
    <svg viewBox="0 0 80 70" width="80" height="70">
      <defs>
        <radialGradient id={`cg-${type}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="35" rx="35" ry="30" fill={`url(#cg-${type})`}/>
      {isCpu && <>
        <rect x="20" y="18" width="40" height="34" rx="4" fill="#1a1a1a" stroke={color} strokeWidth="1.5"/>
        <rect x="24" y="22" width="32" height="26" rx="2" fill="#111"/>
        {[0,1,2,3].map(i=>[0,1,2,3].map(j=><rect key={`${i}${j}`} x={26+i*7} y={24+j*6} width="5" height="4" rx="0.5" fill="#222" stroke="#333" strokeWidth="0.3"/>))}
        <text x="40" y="37" textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">CPU</text>
      </>}
      {isGpu && <>
        <rect x="8" y="24" width="64" height="24" rx="4" fill="#1a0a2a" stroke={color} strokeWidth="1.5"/>
        <circle cx="28" cy="36" r="9" fill="#0d0d0d" stroke={color} strokeWidth="1"/>
        <circle cx="50" cy="36" r="9" fill="#0d0d0d" stroke={color} strokeWidth="1"/>
      </>}
      {isRam && <>
        {[0,1,2,3].map(i=><rect key={i} x={18+i*12} y="15" width="8" height="42" rx="2" fill={i<2?"#0d1a2a":"#111"} stroke={i<2?color:"#222"} strokeWidth="1"/>)}
      </>}
      {!isCpu && !isGpu && !isRam && (
        <rect x="15" y="20" width="50" height="32" rx="4" fill="#1a1a1a" stroke={color} strokeWidth="1.5"/>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function PCBuilderPage() {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected]       = useState<Record<StepKey, Component|null>>({
    cpu:null, board:null, ram:null, gpu:null, storage:null, cooling:null, psu:null, case:null,
  });
  const [filter, setFilter]           = useState("");
  const [showAI, setShowAI]           = useState(false);
  const [aiLoading, setAiLoading]     = useState(false);
  const [finalized, setFinalized]     = useState(false);
  const [favorites, setFavorites]     = useState<Set<string>>(new Set());

  const step     = STEPS[currentStep];
  const comps    = COMPONENTS[step.key];
  const compat   = checkCompatibility(selected);

  const totalWatts = Object.values(selected).reduce((s,c)=>s+(c?.watts??0),0)+BASE_WATTS;
  const totalPrice = Object.values(selected).reduce((s,c)=>s+(c?.price??0),0);

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filtered = comps.filter(c =>
    !filter || c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.brand.toLowerCase().includes(filter.toLowerCase())
  );

  const isCompat = (c: Component): boolean => {
    const cpu   = selected.cpu;
    const board = selected.board;
    if (step.key==="board" && cpu && c.socket && c.socket!==cpu.socket) return false;
    if (step.key==="cpu"   && board && c.socket && c.socket!==board.socket) return false;
    return true;
  };

  const handleSelect = (comp: Component) => {
    setSelected(prev => ({
      ...prev,
      [step.key]: prev[step.key]?.id===comp.id ? null : comp,
    }));
  };

  const toggleFavorite = (compId: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(compId)) {
        newFavs.delete(compId);
      } else {
        newFavs.add(compId);
      }
      return newFavs;
    });
  };

  const triggerAI = () => {
    setShowAI(true); setAiLoading(true);
    setTimeout(()=>setAiLoading(false), 1800);
  };

  const AI_PICK = comps.find(c=>c.badge==="BESTSELLER") || comps[0];

  const psuWatts = selected.psu?.id.includes("1200")?1200:selected.psu?.id.includes("1000")?1000:selected.psu?.id.includes("850")?850:750;

  const handleAddToCart = () => {
    // Crear un item del carrito con toda la PC configurada
    const buildId = Date.now();
    const buildName = "PC Custom Build - " + new Date().toLocaleDateString();
    
    addToCart({
      id: buildId,
      name: buildName,
      price: totalPrice,
      image: "pc-build",
    });

    // Guardar detalles del build en localStorage por si acaso
    localStorage.setItem(`build-${buildId}`, JSON.stringify(selected));

    // Redirigir al checkout
    navigate("/checkout");
  };

  if (finalized) return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Satoshi',sans-serif;background:#0a0a0a;color:#ccc}
      `}</style>
      <div style={{ minHeight:"100vh", background:"#070b14", display:"flex", alignItems:"center", justifyContent:"center", padding:40, position:"relative", overflow:"hidden" }}>
        <HexagonBackground
          className="absolute inset-0 z-0 pointer-events-none bg-[#070b14] dark:bg-[#070b14] opacity-95"
          hexagonSize={92}
          hexagonMargin={5}
          hexagonProps={{
            className:
              "before:!bg-cyan-300/45 dark:before:!bg-cyan-400/38 after:!bg-[#050912]/85 dark:after:!bg-[#050912]/88 hover:before:!bg-sky-300/55",
          }}
        />
        <div style={{ textAlign:"center", maxWidth:560, position:"relative", zIndex:1 }}>
          <div style={{ width:90, height:90, borderRadius:"50%", background:"linear-gradient(135deg,#c8960c,#e0b030)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", boxShadow:"0 0 40px rgba(200,150,12,.4)", color:"#111" }}>
            <FiMonitor size={40} />
          </div>
          <h1 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:32, fontWeight:900, color:"#fff", marginBottom:8 }}>¡PC Configurada!</h1>
          <p style={{ color:"#666", marginBottom:28 }}>Tu build personalizado está listo. Ensamblado en 2–4 días hábiles.</p>
          <div style={{ border:"1px solid #222", borderRadius:12, padding:20, marginBottom:24, textAlign:"left" }}>
            {STEPS.map(s=>selected[s.key]&&(
              <div key={s.key} style={{ display:"flex", justifyContent:"space-between", fontSize:13, padding:"8px 0", borderBottom:"1px solid #1a1a1a" }}>
                <span style={{ color:"#888" }}>{s.label}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:"#fff" }}>{selected[s.key]!.name}</div>
                  <div style={{ color:"#c8960c", fontSize:12 }}>${selected[s.key]!.price}</div>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 0", fontWeight:800 }}>
              <span style={{ color:"#fff" }}>Total</span>
              <span style={{ color:"#c8960c", fontFamily:"'Satoshi',sans-serif", fontSize:22 }}>${totalPrice.toLocaleString()}</span>
            </div>
          </div>
          
          {!compat.ok && (
            <div style={{ background:"rgba(204,68,68,.08)", border:"1px solid rgba(204,68,68,.25)", borderRadius:8, padding:12, marginBottom:16, textAlign:"left" }}>
              <div style={{ fontSize:12, color:"#f87171", marginBottom:6, fontWeight:700, display:"inline-flex", alignItems:"center", gap:6 }}>
                <FiAlertTriangle size={13} /> Advertencias de compatibilidad:
              </div>
              {compat.issues.map(issue=>(
                <div key={issue} style={{ fontSize:11, color:"#f87171", marginLeft:8 }}>• {issue}</div>
              ))}
            </div>
          )}

          <div style={{ display:"flex", gap:12 }}>
            <button onClick={()=>setFinalized(false)} style={{ flex:1, padding:"13px", borderRadius:8, background:"transparent", border:"2px solid #333", color:"#ccc", fontWeight:600, cursor:"pointer", fontSize:14 }}>
              Editar Build
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={!compat.ok}
              style={{ 
                flex:2, padding:"13px", borderRadius:8, 
                background: compat.ok ? "#c8960c" : "#555", 
                border:"none", 
                color: compat.ok ? "#000" : "#888", 
                fontWeight:800, 
                cursor: compat.ok ? "pointer" : "not-allowed", 
                fontSize:14, letterSpacing:.5 
              }}
            >
              {compat.ok ? "Agregar al Carrito" : "Resolver Conflictos Primero"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Satoshi',sans-serif;background:#070b14;color:#ccc;overflow-x:hidden}
        .pcb-root{font-family:'Satoshi',sans-serif;background:#070b14;min-height:100vh;display:flex;flex-direction:column;position:relative;overflow:hidden}
        .pcb-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .step-dot{width:8px;height:8px;border-radius:50%;background:#333;cursor:pointer;transition:all .2s;flex-shrink:0}
        .step-dot.done{background:#c8960c}
        .step-dot.active{background:#c8960c;box-shadow:0 0 0 3px rgba(200,150,12,.25);width:10px;height:10px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .3s ease}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#111}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:#c8960c}
      `}</style>

      <div className="pcb-root">
        <HexagonBackground
          className="absolute inset-0 z-0 pointer-events-none bg-[#070b14] dark:bg-[#070b14] opacity-95"
          hexagonSize={90}
          hexagonMargin={5}
          hexagonProps={{
            className:
              "before:!bg-cyan-300/40 dark:before:!bg-cyan-400/35 after:!bg-[#050912]/82 dark:after:!bg-[#050912]/86 hover:before:!bg-sky-300/50",
          }}
        />

        <div
          style={{
            position:"absolute",
            inset:0,
            zIndex:0,
            pointerEvents:"none",
            background:"radial-gradient(circle at 18% 12%, rgba(56,189,248,0.18), transparent 34%), radial-gradient(circle at 82% 78%, rgba(56,189,248,0.14), transparent 36%)",
          }}
        />

        {/* ══ TOP NAV ══ */}
        <header style={{
          background:"transparent",
          borderBottom:"1px solid rgba(148,163,184,.24)",
          padding:"0 18px",
          display:"flex",
          alignItems:"center",
          gap:14,
          height:64,
          flexShrink:0,
          zIndex:10,
          position:"relative",
          backdropFilter:"none",
          boxShadow:"none",
        }}>
          <div
            onClick={()=>navigate("/")}
            style={{
              display:"flex",
              alignItems:"center",
              cursor:"pointer",
              padding:"6px 2px",
              borderRadius:10,
            }}
          >
            <span style={{ fontFamily:"'Satoshi', sans-serif", fontSize:22, fontWeight:800, color:"#ffffff", letterSpacing:0, whiteSpace:"nowrap", lineHeight:1 }}>
              Vendo Laptops
            </span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8 }}>
            {[
              { label:"Inicio", Icon: FiHome, to:"/" },
              { label:"Catalogo", Icon: FiGrid, to:"/catalog" },
              { label:"Builder", Icon: FiCpu, to:"/pc-builder", active:true },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                style={{
                  display:"inline-flex",
                  alignItems:"center",
                  gap:7,
                  padding:"8px 12px",
                  borderRadius:10,
                  border:item.active ? "1px solid rgba(200,150,12,.45)" : "1px solid rgba(100,116,139,.25)",
                  background:item.active ? "rgba(200,150,12,.14)" : "rgba(15,23,42,.22)",
                  color:"#f8fafc",
                  fontSize:12,
                  fontWeight:700,
                  letterSpacing:.2,
                  cursor:"pointer",
                }}
              >
                <item.Icon size={14} />
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ flex:1 }} />

          <div style={{
            display:"flex", alignItems:"center", gap:6, padding:"6px 12px",
            borderRadius:999, border:"1px solid",
            borderColor: compat.ok ? "rgba(74,222,128,.45)" : "rgba(248,113,113,.45)",
            background: compat.ok ? "rgba(22,163,74,.08)" : "rgba(185,28,28,.1)",
            fontSize:11, fontWeight:800,
            color: compat.ok ? "#86efac" : "#fca5a5",
            letterSpacing:.4,
          }}>
            {compat.ok ? <FiCheckCircle size={13} /> : <FiAlertTriangle size={13} />}
            {compat.ok ? "COMPATIBLE" : "CONFLICTO"}
          </div>

          <div style={{ textAlign:"right", minWidth:120 }}>
            <div style={{ fontSize:9, color:"rgba(241,245,249,.8)", letterSpacing:.9 }}>TOTAL ESTIMADO</div>
            <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:20, fontWeight:900, color:"#ffffff" }}>
              ${totalPrice.toLocaleString()}.00
            </div>
          </div>

          <button
            onClick={()=>navigate("/checkout")}
            style={{
              width:40,
              height:40,
              borderRadius:10,
              background:"rgba(15,23,42,.22)",
              border:"1px solid rgba(148,163,184,.35)",
              color:"#ffffff",
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              position:"relative",
              transition:"all .2s",
            }}
            title="Ir a checkout"
          >
            <FiShoppingCart size={17} />
            {cartCount > 0 && (
              <div style={{
                position:"absolute",
                top:-5,
                right:-5,
                minWidth:17,
                height:17,
                padding:"0 4px",
                borderRadius:999,
                background:"#ef4444",
                color:"#fff",
                fontSize:9,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontWeight:800,
                fontFamily:"'Satoshi', sans-serif",
              }}>
                {cartCount}
              </div>
            )}
          </button>

          <button
            onClick={()=>navigate("/checkout")}
            style={{
              display:"inline-flex",
              alignItems:"center",
              gap:8,
              padding:"10px 14px",
              borderRadius:10,
              border:"1px solid rgba(148,163,184,.35)",
              background:"rgba(15,23,42,.22)",
              color:"#ffffff",
              fontSize:12,
              fontWeight:700,
              cursor:"pointer",
            }}
          >
            <FiShoppingBag size={14} />
            Checkout
          </button>
        </header>

        {/* ══ MAIN LAYOUT ══ */}
        <div style={{ display:"grid", gridTemplateColumns:"64px 1fr 320px", flex:1, minHeight:0, overflow:"hidden", position:"relative", zIndex:1 }}>

          {/* ── STEP SIDEBAR ── */}
          <aside style={{ background:"rgba(7,11,20,.38)", borderRight:"1px solid rgba(241,245,249,.22)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"12px 0", overflowY:"auto", backdropFilter:"blur(2px)" }}>
            {STEPS.map((s,i)=>{
              const done    = !!selected[s.key];
              const active  = i===currentStep;
              return (
                <button key={s.key} onClick={()=>setCurrentStep(i)} title={s.label} style={{
                  width:48, height:48, borderRadius:10, border:"none",
                  background: active ? s.color+"22" : done ? "#1a1a1a" : "#111",
                  color: active ? s.color : done ? "#c8960c" : "#444",
                  cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2,
                  outline: active ? `2px solid ${s.color}` : "none",
                  transition:"all .2s", position:"relative",
                }}>
                  <span style={{ display:"inline-flex", alignItems:"center" }}><s.Icon size={14} /></span>
                  <span style={{ fontSize:7, fontWeight:700, letterSpacing:.5, color: active?s.color:done?"#c8960c":"#333" }}>{s.short}</span>
                  {done && <div style={{ width:6, height:6, borderRadius:"50%", background:"#c8960c", position:"absolute", top:4, right:4 }}/>}
                </button>
              );
            })}

            {/* Progress dots */}
            <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", alignItems:"center", gap:4, paddingBottom:12 }}>
              {STEPS.map((_,i)=>(
                <div key={i} className={`step-dot${i===currentStep?" active":selected[STEPS[i].key]?" done":""}`}
                  onClick={()=>setCurrentStep(i)}/>
              ))}
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main style={{ overflowY:"auto", display:"flex", flexDirection:"column" }}>

            {/* Step header */}
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid rgba(241,245,249,.16)", background:"rgba(7,11,20,.2)", flexShrink:0 }}>
              <div style={{ fontSize:10, color:"#555", letterSpacing:1, marginBottom:4 }}>
                PASO {String(currentStep+1).padStart(2,"0")} DE {String(STEPS.length).padStart(2,"0")} ——
              </div>
              <h2 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:24, fontWeight:900, color:"#fff", marginBottom:4 }}>
                Elige tu {step.label}
              </h2>
              {currentStep===1 && selected.cpu && (
                <div style={{ fontSize:11, color:"#666" }}>
                  Filtrado automáticamente para socket <span style={{ color:"#c8960c", fontWeight:700 }}>{selected.cpu.socket}</span>.
                </div>
              )}

              {/* Toolbar */}
              <div style={{ display:"flex", gap:10, marginTop:10 }}>
                <div style={{ position:"relative", flex:1, maxWidth:280 }}>
                  <input value={filter} onChange={e=>setFilter(e.target.value)}
                    placeholder={`Buscar ${step.label.toLowerCase()}...`}
                    style={{ width:"100%", padding:"8px 12px 8px 34px", background:"rgba(2,6,23,.45)", border:"1px solid rgba(241,245,249,.14)", borderRadius:6, color:"#ccc", fontSize:12, outline:"none", fontFamily:"'Satoshi',sans-serif" }}/>
                  <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#555", display:"inline-flex" }}><FiSearch size={14} /></span>
                </div>
                <button onClick={triggerAI} style={{ padding:"8px 14px", borderRadius:6, border:"1px solid rgba(200,150,12,.3)", background:"rgba(200,150,12,.08)", color:"#c8960c", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, letterSpacing:.5 }}>
                  <HiSparkles size={13} /> RECOMENDACION AI
                </button>
              </div>
            </div>

            {/* AI Recommendation */}
            {showAI && (
              <div className="fade-up" style={{ margin:"12px 20px 0", padding:"12px 16px", background:"rgba(200,150,12,.06)", border:"1px solid rgba(200,150,12,.2)", borderRadius:10 }}>
                {aiLoading ? (
                  <div style={{ display:"flex", alignItems:"center", gap:10, color:"#c8960c", fontSize:13 }}>
                    <div style={{ width:16, height:16, border:"2px solid rgba(200,150,12,.3)", borderTopColor:"#c8960c", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>
                    Analizando compatibilidad y precio/rendimiento…
                  </div>
                ) : (
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:11, color:"#c8960c", fontWeight:700, marginBottom:4, display:"inline-flex", alignItems:"center", gap:5 }}><HiSparkles size={12} /> IA RECOMIENDA</div>
                      <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{AI_PICK.name}</div>
                      <div style={{ fontSize:11, color:"#666", marginTop:2 }}>Mejor balance precio/rendimiento para tu build actual</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontFamily:"'Satoshi',sans-serif", fontSize:18, color:"#c8960c", fontWeight:800 }}>${AI_PICK.price}</span>
                      <button onClick={()=>{handleSelect(AI_PICK);setShowAI(false);}} style={{ padding:"7px 14px", borderRadius:6, background:"#c8960c", border:"none", color:"#000", fontSize:11, fontWeight:800, cursor:"pointer" }}>
                        Seleccionar
                      </button>
                      <button onClick={()=>setShowAI(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:18, display:"inline-flex", alignItems:"center" }} title="Cerrar recomendacion">
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conflict warnings */}
            {compat.issues.length > 0 && (
              <div style={{ margin:"10px 20px 0", padding:"10px 14px", background:"rgba(204,68,68,.08)", border:"1px solid rgba(204,68,68,.25)", borderRadius:8 }}>
                {compat.issues.map(issue=>(
                  <div key={issue} style={{ fontSize:12, color:"#f87171", display:"flex", alignItems:"center", gap:6 }}>
                    <FiAlertTriangle size={12} /> {issue}
                  </div>
                ))}
              </div>
            )}

            {/* Component grid */}
            <div style={{ padding:"14px 20px 20px", flex:1 }}>
              <div className="pcb-card-grid">
                {filtered.map(comp=>(
                  <ComponentCard key={comp.id} comp={comp}
                    isSelected={selected[step.key]?.id===comp.id}
                    onSelect={()=>handleSelect(comp)}
                    compatible={isCompat(comp)}
                    onAddToFavorites={()=>toggleFavorite(comp.id)}
                    isFavorite={favorites.has(comp.id)}/>
                ))}
              </div>
              {filtered.length===0 && (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#333" }}>
                  <div style={{ fontSize:32, marginBottom:8, display:"inline-flex" }}><FiSearch size={30} /></div>
                  No se encontraron componentes
                </div>
              )}
            </div>

            {/* Bottom nav */}
            <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(241,245,249,.16)", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(7,11,20,.2)", flexShrink:0 }}>
              <button onClick={()=>setCurrentStep(s=>Math.max(0,s-1))} disabled={currentStep===0}
                style={{ padding:"9px 24px", borderRadius:8, background:"transparent", border:"1.5px solid #333", color: currentStep===0?"#333":"#888", fontWeight:600, cursor:currentStep===0?"not-allowed":"pointer", fontSize:13, fontFamily:"'Satoshi',sans-serif" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}><FiChevronLeft size={14} /> Anterior</span>
              </button>

              <div style={{ display:"flex", gap:6 }}>
                {STEPS.map((_,i)=>(
                  <div key={i} onClick={()=>setCurrentStep(i)} className={`step-dot${i===currentStep?" active":selected[STEPS[i].key]?" done":""}`}/>
                ))}
              </div>

              {currentStep < STEPS.length-1 ? (
                <button onClick={()=>setCurrentStep(s=>s+1)}
                  style={{ padding:"9px 24px", borderRadius:8, background:"#c8960c", border:"none", color:"#000", fontWeight:800, cursor:"pointer", fontSize:13, fontFamily:"'Satoshi',sans-serif" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>Siguiente <FiChevronRight size={14} /></span>
                </button>
              ) : (
                <button onClick={()=>setFinalized(true)} disabled={selectedCount<4}
                  style={{ padding:"9px 24px", borderRadius:8, background:selectedCount>=4?"#c8960c":"#333", border:"none", color:selectedCount>=4?"#000":"#666", fontWeight:800, cursor:selectedCount>=4?"pointer":"not-allowed", fontSize:13, fontFamily:"'Satoshi',sans-serif" }}>
                  Finalizar Compra
                </button>
              )}
            </div>
          </main>

          {/* ── RIGHT PANEL ── */}
          <aside style={{ background:"rgba(7,11,20,.38)", borderLeft:"1px solid rgba(241,245,249,.22)", display:"flex", flexDirection:"column", overflow:"hidden", backdropFilter:"blur(2px)" }}>

            {/* 3D Preview */}
            <div style={{ flex:"0 0 280px", padding:"10px", borderBottom:"1px solid rgba(241,245,249,.16)" }}>
              <PCPreview3D selected={selected}/>
            </div>

            {/* Assembly Summary */}
            <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:.8, color:"#888" }}>RESUMEN DEL ENSAMBLE</div>
                {selected.psu && (
                  <div style={{ fontSize:9, color:"#555" }}>
                    {totalWatts}W/{psuWatts}W
                  </div>
                )}
              </div>

              {/* Wattage bar */}
              {selected.psu && <WattageBar used={totalWatts} max={psuWatts}/>}

              <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
                {STEPS.map(s=>{
                  const comp = selected[s.key];
                  return (
                    <div key={s.key} style={{
                      display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                      borderRadius:8, background: comp ? "#111" : "#0d0d0d",
                      border:`1px solid ${comp?"#1e1e1e":"#151515"}`,
                    }}>
                      <div style={{ width:26, height:26, borderRadius:6, background:comp?s.color+"22":"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>
                        <s.Icon size={12} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:9, color:"#555", letterSpacing:.8, textTransform:"uppercase" as const }}>{s.short}</div>
                        <div style={{ fontSize:11, color:comp?"#ccc":"#444", fontWeight:comp?600:400, whiteSpace:"nowrap" as const, overflow:"hidden", textOverflow:"ellipsis" }}>
                          {comp ? comp.name : "No seleccionado"}
                        </div>
                      </div>
                      {comp ? (
                        <div style={{ fontSize:12, fontWeight:700, color:"#c8960c", flexShrink:0 }}>${comp.price}</div>
                      ) : (
                        <div style={{ color:"#333", fontSize:14 }}>···</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Finalizar */}
            <div style={{ padding:"12px", borderTop:"1px solid #1a1a1a", flexShrink:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:11, color:"#555" }}>{selectedCount}/{STEPS.length} componentes</div>
                <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:18, fontWeight:800, color:"#c8960c" }}>${totalPrice.toLocaleString()}</div>
              </div>
              <div style={{ height:3, background:"#1a1a1a", borderRadius:2, marginBottom:10, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(selectedCount/STEPS.length)*100}%`, background:"linear-gradient(90deg,#2d8a4e,#c8960c)", borderRadius:2, transition:"width .4s ease" }}/>
              </div>
              <button onClick={()=>setFinalized(true)} disabled={selectedCount<4}
                style={{
                  width:"100%", padding:"12px", borderRadius:8,
                  background: selectedCount>=4 ? "#c8960c" : "#1a1a1a",
                  border: selectedCount>=4 ? "none" : "1px solid #2a2a2a",
                  color: selectedCount>=4 ? "#000" : "#444",
                  fontWeight:800, fontSize:12, cursor:selectedCount>=4?"pointer":"not-allowed",
                  letterSpacing:.8, textTransform:"uppercase" as const,
                  fontFamily:"'Satoshi',sans-serif", transition:"all .2s",
                }}>
                Finalizar Compra
              </button>
            </div>
          </aside>

        </div>

        {/* ══ STATUS BAR ══ */}
        <div style={{ background:"rgba(7,11,20,.25)", borderTop:"1px solid rgba(241,245,249,.16)", padding:"6px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:10, color:"#9ca3af", flexShrink:0, position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#2d8a4e", animation:"pulse 2s ease-in-out infinite" }}/>
            VALIDANDO STOCK EN TIEMPO REAL…
          </div>
          <div style={{ display:"flex", gap:20 }}>
            <span>ENSAMBLADO EN: <span style={{ color:"#888" }}>2–4 DÍAS HÁBILES</span></span>
            <span>GARANTÍA: <span style={{ color:"#c8960c" }}>3 AÑOS PREMIUM</span></span>
          </div>
        </div>

      </div>
    </>
  );
}
