import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardPayment, initMercadoPago } from "@mercadopago/sdk-react";
import { HiOutlineArrowPath, HiOutlineArrowRight, HiOutlineClock, HiOutlineShieldCheck, HiShoppingCart } from "react-icons/hi2";
import MercadopagoIcon from "../components/ui/MercadopagoIcon";
import MercadoPagoCardVisual from "../components/ui/MercadoPagoCardVisual";
import { useCart } from "../context/CartContext";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type Step = "cart" | "address" | "shipping" | "payment" | "confirmation";
type ShippingMethod = "free" | "express" | "schedule";
type PurchaseMode = "total" | "installments";
type CardFunding = "credit" | "debit";
type CardNetwork = "visa" | "mastercard" | "unknown";

interface BrickCardFormData {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

interface PaymentResult {
  id: string | number;
  status: string;
  status_detail?: string;
  date_created?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  transaction_amount?: number;
  installments?: number;
}

interface CheckoutPaymentPreference {
  mode?: PurchaseMode;
  months?: number;
}

interface CheckoutLocationState {
  checkoutPayment?: CheckoutPaymentPreference;
}

const CHECKOUT_INSTALLMENTS = [3, 6, 12, 18];

interface Address {
  id: number;
  label: string;
  type: "HOME" | "OFFICE";
  street: string;
  full: string;
  phone: string;
}

const ADDRESSES: Address[] = [
  { id: 1, label: "2118 Thornridge", type: "HOME",   street: "2118 Thornridge Cir. Syracuse, Connecticut 35624", full: "2118 Thornridge Cir. Syracuse, CT 35624", phone: "(209) 555-0104" },
  { id: 2, label: "Headoffice",      type: "OFFICE", street: "2715 Ash Dr. San Jose, South Dakota 83475",        full: "2715 Ash Dr. San Jose, SD 83475",        phone: "(704) 555-0127" },
];

/* ══════════════════════════════════════════════
   PRODUCT SVG STUBS
══════════════════════════════════════════════ */
function ProductThumb({ image, name }: { image?: string; name: string }) {
  if (image) {
    return <img src={image} alt={name} style={{ width: 70, height: 70, objectFit: "contain" }} />;
  }

  return (
    <div style={{ width: 70, height: 70, borderRadius: 10, background: "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 11, fontWeight: 600 }}>
      Sin imagen
    </div>
  );
}

function CardNetworkBadge({ network }: { network: CardNetwork }) {
  if (network === "visa") {
    return (
      <div style={{
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        minWidth:68,
        height:30,
        borderRadius:10,
        background:"linear-gradient(135deg,#1d4ed8 0%, #2563eb 100%)",
        color:"#fff",
        fontSize:14,
        fontWeight:900,
        letterSpacing:1,
        textTransform:"uppercase",
        boxShadow:"0 8px 18px rgba(37,99,235,.25)",
      }}>
        Visa
      </div>
    );
  }

  if (network === "mastercard") {
    return (
      <div style={{
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        minWidth:88,
        height:30,
        borderRadius:10,
        background:"#fff",
        border:"1px solid #e5e7eb",
        boxShadow:"0 8px 16px rgba(15,23,42,.08)",
        position:"relative",
        overflow:"hidden",
      }}>
        <span style={{ width:14, height:14, borderRadius:"50%", background:"#eb001b", opacity:.95, marginRight:-4 }} />
        <span style={{ width:14, height:14, borderRadius:"50%", background:"#f79e1b", opacity:.95, marginLeft:-4 }} />
        <span style={{ marginLeft:8, fontSize:9, fontWeight:800, color:"#1f2937", textTransform:"uppercase", letterSpacing:.3 }}>MC</span>
      </div>
    );
  }

  return (
    <div style={{
      display:"inline-flex",
      alignItems:"center",
      justifyContent:"center",
      minWidth:84,
      height:30,
      borderRadius:10,
      background:"#fff",
      border:"1px solid #e5e7eb",
      color:"#64748b",
      fontSize:11,
      fontWeight:800,
      textTransform:"uppercase",
    }}>
      Card
    </div>
  );
}

function detectCardNetwork(cardNumber: string): CardNetwork {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4\d{0,}$/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))\d{0,}$/.test(digits)) return "mastercard";
  return "unknown";
}

function MercadoPagoBadge() {
  return (
    <div style={{
      display:"inline-flex",
      alignItems:"center",
      gap:8,
      minWidth:160,
      height:34,
      padding:"0 10px",
      borderRadius:10,
      background:"linear-gradient(135deg,#e0f2fe 0%, #bfdbfe 100%)",
      color:"#1e3a8a",
      fontSize:11,
      fontWeight:800,
      textTransform:"lowercase",
      boxShadow:"0 8px 16px rgba(30,58,138,.16)",
    }}>
      <MercadopagoIcon size={20} color="#1d4ed8" strokeWidth={0} />
      mercado pago
    </div>
  );
}

/* ══════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════ */
function StepIndicator({ current, lang, isMobile }: { current: Step; lang: "es" | "en"; isMobile: boolean }) {
  const steps: { key: Step; label: string; hint: string; icon: React.ReactNode }[] = [
    {
      key:"address",
      label: lang === "es" ? "Direccion" : "Address",
      hint: lang === "es" ? "Datos de entrega" : "Delivery details",
      icon:(
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"/>
          <circle cx="12" cy="10" r="2.5"/>
        </svg>
      ),
    },
    {
      key:"shipping",
      label: lang === "es" ? "Envio" : "Shipping",
      hint: lang === "es" ? "Metodo y fecha" : "Method and date",
      icon:(
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7h11v8H3z"/>
          <path d="M14 10h3l3 3v2h-6z"/>
          <circle cx="7" cy="17" r="1.7"/>
          <circle cx="17" cy="17" r="1.7"/>
        </svg>
      ),
    },
    {
      key:"payment",
      label: lang === "es" ? "Pago" : "Payment",
      hint: lang === "es" ? "Confirmar compra" : "Confirm purchase",
      icon:(
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2.5" y="5" width="19" height="14" rx="2"/>
          <path d="M2.5 10h19"/>
        </svg>
      ),
    },
  ];
  const order: Step[] = ["address","shipping","payment"];
  const ci = order.indexOf(current);
  return (
    <div style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      marginBottom:isMobile ? 24 : 36,
      background:"linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
      border:"1px solid #e5e7eb",
      borderRadius:18,
      padding:isMobile ? "14px 10px" : "16px 18px",
      boxShadow:"0 12px 26px rgba(15,23,42,.06)",
      overflow:"hidden",
    }}>
      {steps.map((s, i) => {
        const done    = i < ci;
        const active  = i === ci;
        return (
          <div key={s.key} style={{ display:"flex", alignItems:"center", flex:1, minWidth:0 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, width:"100%" }}>
              <div style={{
                width:isMobile ? 34 : 40,
                height:isMobile ? 34 : 40,
                borderRadius:"50%",
                background: active ? "linear-gradient(180deg,#c8960c,#b8860b)" : done ? "#0f766e" : "#e5e7eb",
                color: active || done ? "#fff" : "#8b95a7",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow: active ? "0 0 0 5px rgba(200,150,12,.22)" : "none",
                transition:"all .3s",
              }}>
                {done ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7"/>
                  </svg>
                ) : (
                  s.icon
                )}
              </div>
              <div style={{ textAlign:"center", lineHeight:1.2 }}>
                <div style={{ fontSize:10, color: active ? "#8b6914" : "#9ca3af", fontWeight:700 }}>{lang === "es" ? "Paso" : "Step"} {i+1}</div>
                <div style={{ fontSize:isMobile ? 16 : 22, fontWeight: active ? 900 : 700, color: active ? "#0f172a" : "#667085", letterSpacing:-0.3 }}>
                  {s.label}
                </div>
                {!isMobile && (
                  <div style={{ fontSize:11, color:"#98a2b3", marginTop:1 }}>
                    {s.hint}
                  </div>
                )}
              </div>
            </div>
            {i < steps.length-1 && (
              <div style={{
                width:isMobile ? 26 : 120,
                height:3,
                borderRadius:999,
                background: done ? "linear-gradient(90deg,#0f766e,#14b8a6)" : "#e5e7eb",
                margin:isMobile ? "0 6px 32px" : "0 12px 34px",
                transition:"background .3s",
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function CheckoutPage() {
  const location = useLocation();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locationState = (location.state as CheckoutLocationState | null) ?? null;
  const initialCheckoutPayment = locationState?.checkoutPayment;

  /* state */
  const [step, setStep]               = useState<Step>("cart");
  const [promoCode, setPromoCode]     = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError]   = useState("");
  const [bonusCard, setBonusCard]     = useState("");
  const [selectedAddr, setSelectedAddr] = useState(1);
  const [shipping, setShipping]       = useState<ShippingMethod>("free");
  const [scheduleDate, setScheduleDate] = useState("");
  const [sameAddress, setSameAddress] = useState(true);
  const [cardFunding, setCardFunding] = useState<CardFunding>("credit");
  const [cardBin, setCardBin]         = useState("");
  const [payerEmail, setPayerEmail]   = useState("");
  const [isPaying, setIsPaying]       = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>(initialCheckoutPayment?.mode === "total" ? "total" : "installments");
  const [selectedInstallment, setSelectedInstallment] = useState<number>(
    initialCheckoutPayment?.months && CHECKOUT_INSTALLMENTS.includes(initialCheckoutPayment.months)
      ? initialCheckoutPayment.months
      : 3
  );
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr]         = useState({ label:"", street:"", full:"", phone:"", type:"HOME" as "HOME"|"OFFICE" });
  const [addresses, setAddresses]     = useState<Address[]>(ADDRESSES);
  const [errors, setErrors]           = useState<Record<string,string>>({});
  const [wishlist, setWishlist]       = useState<number[]>([]);
  const [lang, setLang]               = useState<"es" | "en">("es");
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mpPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;

  useEffect(() => {
    if (mpPublicKey) {
      initMercadoPago(mpPublicKey, { locale: "es-MX" });
    }
  }, [mpPublicKey]);

  useEffect(() => {
    if (cardFunding === "debit") {
      setPurchaseMode("total");
    }
  }, [cardFunding]);

  /* calculations */
  const subtotal  = cart.reduce((s,i) => s + i.price * i.quantity, 0);
  const tax       = Math.round(subtotal * 0.02);
  const shipCost  = shipping === "express" ? 8.5 : shipping === "schedule" ? 12 : 0;
  const discount  = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal + tax + shipCost - discount;
  const cardNetwork = detectCardNetwork(cardBin);
  const totalCents = Math.round(total * 100);
  const allowInstallments = cardFunding === "credit";
  const installmentCount = (purchaseMode === "total" || !allowInstallments) ? 1 : selectedInstallment;
  const installmentCents = installmentCount === 1
    ? totalCents
    : Math.floor(totalCents / installmentCount);
  const lastInstallmentCents = installmentCount === 1
    ? totalCents
    : totalCents - installmentCents * (installmentCount - 1);
  const monthlyAmount = installmentCents / 100;
  const finalInstallmentAmount = lastInstallmentCents / 100;
  const confirmedInstallments = Number(paymentResult?.installments || installmentCount);
  const confirmedInstallmentCents = confirmedInstallments > 1 ? Math.floor(totalCents / confirmedInstallments) : totalCents;
  const confirmedLastInstallmentCents = confirmedInstallments > 1 ? totalCents - confirmedInstallmentCents * (confirmedInstallments - 1) : totalCents;
  const confirmedMonthlyAmount = confirmedInstallmentCents / 100;
  const confirmedLastInstallmentAmount = confirmedLastInstallmentCents / 100;
  const paymentPlanLabel = purchaseMode === "total"
    ? (lang === "es" ? "Pago total" : "Full payment")
    : (lang === "es" ? `${installmentCount} meses` : `${installmentCount} months`);
  const confirmedPlanLabel = confirmedInstallments > 1
    ? (lang === "es" ? `${confirmedInstallments} meses` : `${confirmedInstallments} months`)
    : (lang === "es" ? "Pago total" : "Full payment");
  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth <= 1024;
  const t = (es: string, en: string) => (lang === "es" ? es : en);

  /* helpers */
  const updateQty = (id: number, nextQuantity: number) => updateQuantity(id, nextQuantity);

  const removeItem = (id: number) => removeFromCart(id);

  const toggleWish = (id: number) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "save10") { setPromoApplied(true); setPromoError(""); }
    else { setPromoError(t("Codigo promocional invalido. Prueba SAVE10", "Invalid promo code. Try SAVE10")); setPromoApplied(false); }
  };

  const validatePayment = () => {
    const e: Record<string,string> = {};
    if (!payerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail)) {
      e.payerEmail = t("Ingresa un correo valido", "Enter a valid email");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitMercadoPagoPayment = async (formData: BrickCardFormData) => {
    setPaymentError("");
    setIsPaying(true);
    try {
      const response = await fetch("/api/mercadopago/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          description: "Compra en VendoLaptops",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details?.message || data?.message || "No se pudo procesar el pago.");
      }

      const installments = Number(data.installments || formData.installments || 1);
      setSelectedInstallment(installments);
      setPurchaseMode(installments > 1 ? "installments" : "total");
      setPaymentResult(data as PaymentResult);
      setStep("confirmation");
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : t("Error procesando el pago", "Payment processing error"));
    } finally {
      setIsPaying(false);
    }
  };

  const addNewAddress = () => {
    if (!newAddr.label || !newAddr.street) return;
    setAddresses(prev => [...prev, { ...newAddr, id: Date.now(), full: newAddr.street }]);
    setShowAddAddr(false);
    setNewAddr({ label:"", street:"", full:"", phone:"", type:"HOME" });
  };

  /* ── FIELD STYLE ── */
  const field = (err?: string): React.CSSProperties => ({
    width:"100%", padding:"11px 14px", borderRadius:8,
    border:`1.5px solid ${err ? "#cc0000" : "#e0e0e0"}`,
    fontSize:13, outline:"none", fontFamily:"'Satoshi',sans-serif",
    background:"#fff", color:"#111",
  });

  /* ── BUTTON STYLES ── */
  const btnPrimary: React.CSSProperties = {
    padding:"12px 36px", borderRadius:30, background:"#c8960c",
    border:"none", color:"#fff", fontSize:14, fontWeight:700,
    cursor:"pointer", fontFamily:"'Satoshi',sans-serif",
    boxShadow:"0 4px 12px rgba(200,150,12,.3)", transition:"opacity .15s",
  };
  const btnSecondary: React.CSSProperties = {
    padding:"12px 36px", borderRadius:30, background:"#fff",
    border:"2px solid #e0e0e0", color:"#555", fontSize:14, fontWeight:600,
    cursor:"pointer", fontFamily:"'Satoshi',sans-serif",
  };

  /* ── RADIO ── */
  const Radio = ({ checked, onChange }: { checked: boolean; onChange: ()=>void }) => (
    <div onClick={onChange} style={{
      width:20, height:20, borderRadius:"50%", flexShrink:0,
      border:`2px solid ${checked ? "#c8960c" : "#ccc"}`,
      background:"#fff", cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      {checked && <div style={{ width:10, height:10, borderRadius:"50%", background:"#c8960c" }}/>}
    </div>
  );

  /* ────────────────────────────────────────
     RENDER STEPS
  ──────────────────────────────────────── */

  /* ── CART ── */
  const renderCart = () => (
    <div style={{ display:"grid", gridTemplateColumns:isTablet ? "1fr" : "1fr 360px", gap:isMobile ? 18 : 28, alignItems:"start" }}>
      {/* left */}
      <div>
        <h1 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:isMobile ? 24 : 28, letterSpacing:-0.5, fontWeight:900, marginBottom:20, color:"#111827" }}>
          {t("Carrito de compras", "Shopping Cart")}
        </h1>

        {cart.length === 0 ? (
          <div style={{
            border:"1px solid #e6e7eb",
            borderRadius:24,
            padding:isMobile ? "34px 20px" : "54px 40px",
            background:"radial-gradient(circle at 10% 10%, #ffffff 0%, #fcfcfd 36%, #f7f8fa 100%)",
            boxShadow:"0 22px 50px rgba(15, 23, 42, 0.06)",
            textAlign:"center",
            animation:"ch-fade-up .55s ease both",
          }}>
            <div style={{
              width:isMobile ? 66 : 78,
              height:isMobile ? 66 : 78,
              borderRadius:"50%",
              margin:"0 auto 18px",
              display:"grid",
              placeItems:"center",
              background:"linear-gradient(180deg, #fff8e2 0%, #f6e2a5 100%)",
              color:"#9f7a11",
              boxShadow:"inset 0 0 0 1px rgba(200,150,12,.24)",
              animation:"ch-pop-in .5s ease-out .14s both",
            }}>
              <HiShoppingCart size={isMobile ? 30 : 34} />
            </div>
            <h2 style={{
              margin:0,
              fontFamily:"'Satoshi',sans-serif",
              fontSize:isMobile ? 24 : 30,
              letterSpacing:-0.7,
              lineHeight:1.1,
              color:"#0f172a",
              fontWeight:900,
            }}>
              {t("Tu carrito esta vacio", "Your cart is empty")}
            </h2>
            <p style={{
              margin:"12px auto 0",
              maxWidth:460,
              color:"#667085",
              fontSize:isMobile ? 14 : 15,
              lineHeight:1.55,
              fontFamily:"'Satoshi',sans-serif",
            }}>
              {t(
                "Explora nuestra seleccion de laptops premium o empieza un custom build para armar una maquina a tu medida.",
                "Explore our premium laptop selection or start a custom build to assemble a machine tailored to your needs."
              )}
            </p>

            <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap", marginTop:26 }}>
              <a href="/catalog" style={{
                display:"inline-flex",
                alignItems:"center",
                gap:8,
                padding:"12px 20px",
                borderRadius:999,
                textDecoration:"none",
                color:"#111827",
                fontSize:14,
                fontWeight:700,
                fontFamily:"'Satoshi',sans-serif",
                background:"#fff",
                border:"1px solid #d5d8de",
                boxShadow:"0 8px 18px rgba(2,6,23,.06)",
              }}>
                {t("Explorar catalogo", "Explore catalog")}
                <HiOutlineArrowRight size={16} />
              </a>
              <a href="/pc-builder" style={{
                display:"inline-flex",
                alignItems:"center",
                gap:8,
                padding:"12px 20px",
                borderRadius:999,
                textDecoration:"none",
                color:"#ffffff",
                fontSize:14,
                fontWeight:800,
                fontFamily:"'Satoshi',sans-serif",
                background:"linear-gradient(90deg, #c8960c 0%, #e1ba4c 100%)",
                border:"1px solid #c8960c",
                boxShadow:"0 12px 24px rgba(200,150,12,.32)",
              }}>
                {t("Ir a PC Builder", "Open PC Builder")}
                <HiOutlineArrowRight size={16} />
              </a>
            </div>

            <div style={{ display:"flex", justifyContent:"center", gap:18, flexWrap:"wrap", marginTop:20 }}>
              {[
                { label: t("Envio nacional", "Nationwide shipping"), Icon: HiOutlineArrowPath },
                { label: t("Garantia real", "Real warranty"), Icon: HiOutlineShieldCheck },
                { label: t("Soporte rapido", "Fast support"), Icon: HiOutlineClock },
              ].map(({ label, Icon }) => (
                <span key={label} style={{
                  display:"inline-flex",
                  alignItems:"center",
                  gap:6,
                  color:"#6b7280",
                  fontSize:12,
                  fontWeight:600,
                  fontFamily:"'Satoshi',sans-serif",
                }}>
                  <Icon size={14} color="#b28514" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : cart.map((item, idx) => (
          <div key={item.id}>
            <div style={{ display:"flex", flexWrap:isMobile ? "wrap" : "nowrap", alignItems:isMobile ? "flex-start" : "center", gap:16, padding:"16px 0" }}>
              <ProductThumb image={item.image} name={item.name} />
              <div style={{ flex:1, minWidth:isMobile ? "calc(100% - 90px)" : "auto" }}>
                <div style={{ fontSize:14, fontWeight:700, color:"#111", marginBottom:2 }}>{item.name}</div>
                <div style={{ fontSize:11, color:"#bbb" }}>ID: #{item.id}</div>
              </div>
              {/* qty control */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:isMobile ? 2 : 0 }}>
                <button onClick={()=>updateQty(item.id, item.quantity - 1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid #e0e0e0",background:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                <span style={{ fontSize:14, fontWeight:600, width:20, textAlign:"center" }}>{item.quantity}</span>
                <button onClick={()=>updateQty(item.id, item.quantity + 1)} style={{ width:28,height:28,borderRadius:"50%",border:"1.5px solid #e0e0e0",background:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
              </div>
              <div style={{ fontSize:16, fontWeight:700, color:"#111", minWidth:70, marginLeft:isMobile ? "auto" : 0, textAlign:"right" }}>
                ${(item.price * item.quantity).toLocaleString()}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginLeft:isMobile ? "auto" : 0 }}>
                <button onClick={()=>toggleWish(item.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:wishlist.includes(item.id)?"#c8960c":"#ccc" }}>♡</button>
                <button onClick={()=>removeItem(item.id)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#ccc",lineHeight:1 }}>×</button>
              </div>
            </div>
            {idx < cart.length-1 && <div style={{ height:1, background:"#f0f0f0" }}/>}
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, flexWrap:isMobile ? "wrap" : "nowrap" }}>
            <a href="/catalog" style={{ fontSize:13, color:"#c8960c", fontWeight:600, textDecoration:"none" }}>
              {t("← Seguir comprando", "← Continue Shopping")}
            </a>
            <button onClick={clearCart} style={{ fontSize:12, color:"#cc0000", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>
              {t("Vaciar carrito", "Clear Cart")}
            </button>
          </div>
        )}
      </div>

      {/* right – order summary */}
      <div style={{ border:"1.5px solid #f0f0f0", borderRadius:14, padding:isMobile ? "18px" : "24px", background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,.05)" }}>
        <h2 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:isMobile ? 20 : 22, letterSpacing:-0.3, fontWeight:900, marginBottom:20 }}>
          {t("Resumen de orden", "Order Summary")}
        </h2>

        {/* Promo */}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>{t("Codigo de descuento / Promo code", "Discount code / Promo code")}</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={promoCode} onChange={e=>setPromoCode(e.target.value.toUpperCase())}
              placeholder={t("Codigo", "Code")} style={{...field(), flex:1}} />
          </div>
          {promoApplied && <div style={{ fontSize:11, color:"#16a34a", marginTop:4, fontWeight:600 }}>{t("✓ Descuento de 10% aplicado!", "✓ 10% discount applied!")}</div>}
          {promoError  && <div style={{ fontSize:11, color:"#cc0000", marginTop:4 }}>{promoError}</div>}
          <button onClick={applyPromo} style={{ marginTop:8, padding:"7px 18px", borderRadius:20, border:"1.5px solid #c8960c", background:"#fff", color:"#c8960c", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            {t("Aplicar", "Apply")}
          </button>
        </div>

        {/* Bonus card */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12, color:"#888", marginBottom:6 }}>{t("Tu numero de tarjeta de bonos", "Your bonus card number")}</div>
          <div style={{ position:"relative" }}>
            <input value={bonusCard} onChange={e=>setBonusCard(e.target.value)}
              placeholder={t("Ingresa numero de tarjeta", "Enter Card Number")}
              style={{ ...field(), paddingRight:70 }} />
            <button style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", padding:"4px 12px", borderRadius:16, border:"1.5px solid #c8960c", background:"#fff", color:"#c8960c", fontSize:11, fontWeight:700, cursor:"pointer" }}>
              {t("Aplicar", "Apply")}
            </button>
          </div>
        </div>

        <div style={{ height:1, background:"#f5f5f5", marginBottom:16 }}/>

        {/* Totals */}
        {[
          { label:t("Subtotal", "Subtotal"),                  val:`$${subtotal.toLocaleString()}` },
          ...(promoApplied ? [{ label:t("Descuento promo (10%)", "Promo discount (10%)"), val:`-$${discount}` }] : []),
          { label:t("Impuesto estimado", "Estimated Tax"),             val:`$${tax}` },
          { label:t("Envio y manejo estimado", "Estimated shipping & Handling"), val: shipCost === 0 ? t("Gratis", "Free") : `$${shipCost}` },
        ].map(row => (
          <div key={row.label} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#666", marginBottom:8 }}>
            <span>{row.label}</span>
            <span style={{ color: row.label.includes("discount") ? "#16a34a" : "#555", fontWeight:500 }}>{row.val}</span>
          </div>
        ))}

        <div style={{ height:1, background:"#f0f0f0", margin:"12px 0" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:800, color:"#111", marginBottom:20 }}>
          <span>{t("Total", "Total")}</span>
          <span>${total.toLocaleString()}</span>
        </div>

        <button onClick={()=>{ if(cart.length>0) setStep("address"); }}
          style={{ ...btnPrimary, width:"100%", textAlign:"center", opacity: cart.length===0 ? 0.5 : 1 }}>
          {t("Continuar al checkout", "Checkout")}
        </button>

        {/* trust badges */}
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:16, flexWrap:"wrap" }}>
          {[
            { label:t("Seguro", "Secure"), Icon: HiOutlineShieldCheck },
            { label:t("Devoluciones", "Free returns"), Icon: HiOutlineArrowPath },
            { label:t("Garantizado", "Guaranteed"), Icon: HiOutlineClock },
          ].map(({ label, Icon })=>(
            <span key={label} style={{ fontSize:10, color:"#9ca3af", display:"inline-flex", alignItems:"center", gap:4 }}>
              <Icon size={12} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── ADDRESS ── */
  const renderAddress = () => (
    <div style={{ maxWidth:700, margin:"0 auto" }}>
      <h2 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:22, fontWeight:900, marginBottom:24 }}>
        {t("Selecciona direccion", "Select Address")}
      </h2>

      {addresses.map(addr => (
        <div key={addr.id} onClick={()=>setSelectedAddr(addr.id)} style={{
          border:`1.5px solid ${selectedAddr===addr.id ? "#c8960c" : "#f0f0f0"}`,
          borderRadius:10, padding:"16px 20px", background:selectedAddr===addr.id?"#fffbf0":"#fafafa",
          cursor:"pointer", marginBottom:12, display:"flex", alignItems:"flex-start", gap:14,
          transition:"all .2s",
        }}>
          <Radio checked={selectedAddr===addr.id} onChange={()=>setSelectedAddr(addr.id)}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:14, fontWeight:700 }}>{addr.label}</span>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10,
                background: addr.type==="HOME"?"#fef3c7":"#e0f2fe",
                color: addr.type==="HOME"?"#92400e":"#0369a1" }}>{addr.type}</span>
            </div>
            <div style={{ fontSize:12, color:"#666" }}>{addr.street}</div>
            <div style={{ fontSize:12, color:"#666" }}>{addr.phone}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#888" }}>✏</button>
            <button onClick={e=>{e.stopPropagation();setAddresses(prev=>prev.filter(a=>a.id!==addr.id));}}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#ccc" }}>×</button>
          </div>
        </div>
      ))}

      {/* Add New Address */}
      <div style={{ textAlign:"center", margin:"16px 0" }}>
        <button onClick={()=>setShowAddAddr(v=>!v)} style={{ background:"none", border:"2px dashed #ddd", borderRadius:10, padding:"14px 0", width:"100%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#c8960c", fontSize:13, fontWeight:700 }}>
          <span style={{ width:22,height:22,borderRadius:"50%",background:"#c8960c",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>+</span>
          {t("Agregar nueva direccion", "Add New Address")}
        </button>
      </div>

      {showAddAddr && (
        <div style={{ border:"1.5px solid #f0f0f0", borderRadius:10, padding:20, background:"#fafafa", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>{t("Nueva direccion", "New Address")}</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:10, marginBottom:10 }}>
            <input placeholder={t("Etiqueta (Casa, Oficina...)", "Label (Home, Work...)" )} value={newAddr.label} onChange={e=>setNewAddr(p=>({...p,label:e.target.value}))} style={field()}/>
            <select value={newAddr.type} onChange={e=>setNewAddr(p=>({...p,type:e.target.value as "HOME"|"OFFICE"}))}
              style={{...field(), cursor:"pointer"}}>
              <option value="HOME">{t("CASA", "HOME")}</option>
              <option value="OFFICE">{t("OFICINA", "OFFICE")}</option>
            </select>
          </div>
          <input placeholder={t("Direccion completa", "Full street address")} value={newAddr.street} onChange={e=>setNewAddr(p=>({...p,street:e.target.value}))} style={{...field(),marginBottom:10}}/>
          <input placeholder={t("Numero telefonico", "Phone number")} value={newAddr.phone} onChange={e=>setNewAddr(p=>({...p,phone:e.target.value}))} style={{...field(),marginBottom:14}}/>
          <button onClick={addNewAddress} style={{...btnPrimary, padding:"9px 24px", fontSize:13}}>{t("Guardar direccion", "Save Address")}</button>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
        <button onClick={()=>setStep("cart")} style={btnSecondary}>{t("Atras", "Back")}</button>
        <button onClick={()=>setStep("shipping")} style={btnPrimary} disabled={!selectedAddr}>{t("Siguiente", "Next")}</button>
      </div>
    </div>
  );

  /* ── SHIPPING ── */
  const renderShipping = () => (
    <div style={{ maxWidth:700, margin:"0 auto" }}>
      <h2 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:22, fontWeight:900, marginBottom:24 }}>{t("Metodo de envio", "Shipment Method")}</h2>

      {[
        { id:"free"    as ShippingMethod, label:t("Gratis", "Free"),     desc:t("Envio regular", "Regular shipment"),                       date:"17 Oct, 2023", cost:t("Gratis", "Free") },
        { id:"express" as ShippingMethod, label:"$8.50",    desc:t("Recibe tu pedido lo antes posible", "Get your delivery as soon as possible"),   date:"1 Oct, 2023",  cost:"$8.50" },
        { id:"schedule"as ShippingMethod, label:t("Programado", "Schedule"), desc:t("Elige la fecha de entrega", "Pick a date when you want to get your delivery"), date:null, cost:"$12.00" },
      ].map(m => (
        <div key={m.id} onClick={()=>setShipping(m.id)} style={{
          border:`1.5px solid ${shipping===m.id?"#c8960c":"#f0f0f0"}`,
          borderRadius:10, padding:"16px 20px", background:shipping===m.id?"#fffbf0":"#fafafa",
          cursor:"pointer", marginBottom:12, display:"flex", alignItems:"center", gap:14,
          transition:"all .2s",
        }}>
          <Radio checked={shipping===m.id} onChange={()=>setShipping(m.id)}/>
          <div style={{ flex:1 }}>
            <span style={{ fontSize:14, fontWeight:700, color: m.id==="free"?"#c8960c":"#111" }}>{m.label}</span>
            <span style={{ fontSize:13, color:"#888", marginLeft:10 }}>{m.desc}</span>
          </div>
          {m.date
            ? <span style={{ fontSize:12, color:"#888", fontWeight:500 }}>{m.date}</span>
            : <select value={scheduleDate} onChange={e=>setScheduleDate(e.target.value)}
                onClick={e=>e.stopPropagation()}
                style={{ padding:"4px 10px", borderRadius:6, border:"1.5px solid #ddd", fontSize:12, cursor:"pointer" }}>
                <option value="">{t("Selecciona fecha ▾", "Select Date ▾")}</option>
                {["5 Oct","8 Oct","10 Oct","15 Oct"].map(d=><option key={d}>{d}, 2023</option>)}
              </select>
          }
        </div>
      ))}

      {/* mini order summary */}
      <div style={{ border:"1.5px solid #f0f0f0", borderRadius:10, padding:"14px 18px", background:"#fafafa", marginTop:20 }}>
        <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>{t("Resumen de orden", "Order Summary")}</div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#666" }}>
          <span>{t("Subtotal", "Subtotal")} ({cart.length} {t("items", "items")})</span><span>${subtotal.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#666", margin:"4px 0" }}>
          <span>{t("Envio", "Shipping")}</span><span style={{color:shipCost===0?"#16a34a":"#111"}}>{shipCost===0?t("Gratis", "Free"):`$${shipCost}`}</span>
        </div>
        <div style={{ height:1, background:"#eee", margin:"8px 0" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:800 }}>
          <span>{t("Total estimado", "Estimated Total")}</span><span>${(subtotal+tax+shipCost).toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
        <button onClick={()=>setStep("address")} style={btnSecondary}>{t("Atras", "Back")}</button>
        <button onClick={()=>setStep("payment")} style={btnPrimary}>{t("Siguiente", "Next")}</button>
      </div>
    </div>
  );

  /* ── PAYMENT ── */
  const renderPayment = () => {
    const selAddr = addresses.find(a=>a.id===selectedAddr);
    return (
      <div style={{ display:"grid", gridTemplateColumns:isTablet ? "1fr" : "340px 1fr", gap:28, alignItems:"start" }}>

        {/* Summary panel */}
        <div style={{ border:"1.5px solid #f0f0f0", borderRadius:14, padding:"20px", background:"#fff" }}>
          <div style={{ fontSize:15, fontWeight:800, fontFamily:"'Satoshi',sans-serif", marginBottom:14 }}>{t("Resumen", "Summary")}</div>
          {cart.map(item=>(
            <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ background:"#f5f5f5", borderRadius:8, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
                <ProductThumb image={item.image} name={item.name} />
              </div>
              <span style={{ fontSize:12, flex:1, color:"#444" }}>{item.name}</span>
              <span style={{ fontSize:13, fontWeight:700 }}>${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ height:1, background:"#f0f0f0", margin:"12px 0" }}/>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:2 }}>{t("Direccion", "Address")}</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:10 }}>{selAddr?.full}</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:2 }}>{t("Metodo de envio", "Shipment method")}</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:14, textTransform:"capitalize" }}>{shipping}</div>
          <div style={{ fontSize:11, color:"#aaa", marginBottom:2 }}>{t("Plan de compra", "Purchase plan")}</div>
          <div style={{ fontSize:12, color:"#555", marginBottom:14 }}>{paymentPlanLabel}</div>
          <div style={{ height:1, background:"#f0f0f0", marginBottom:12 }}/>
          {[
            { l:t("Subtotal", "Subtotal"), v:`$${subtotal.toLocaleString()}` },
            ...(promoApplied?[{l:t("Promo (-10%)", "Promo (-10%)"),v:`-$${discount}`}]:[]),
            { l:t("Impuesto", "Tax"), v:`$${tax}` },
            { l:t("Envio", "Shipping"), v:shipCost===0?t("Gratis", "Free"):`$${shipCost}` },
          ].map(r=>(
            <div key={r.l} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#777", marginBottom:6 }}>
              <span>{r.l}</span><span>{r.v}</span>
            </div>
          ))}
          <div style={{ height:1, background:"#f0f0f0", margin:"10px 0" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:800 }}>
            <span>{t("Total", "Total")}</span><span>${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment form */}
        <div>
          <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Satoshi',sans-serif", marginBottom:16 }}>{t("Pago", "Payment")}</div>

          <div style={{ border:"1.5px solid #f0f0f0", borderRadius:12, padding:"14px 14px 12px", marginBottom:16, background:"#fff" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#222", marginBottom:10 }}>{t("Plan de compra", "Purchase plan")}</div>
            <div style={{ fontSize:12, color:"#64748b" }}>
              {cardFunding === "debit"
                ? t("Debito: Mercado Pago procesa un unico pago.", "Debit: Mercado Pago processes a one-time payment.")
                : t("Credito: las cuotas finales se seleccionan dentro del formulario oficial de Mercado Pago.", "Credit: final installments are selected inside the official Mercado Pago form.")}
            </div>
          </div>

          {/* Mercado Pago only */}
          <div style={{
            border:"1.5px solid #dbeafe",
            borderRadius:14,
            background:"linear-gradient(180deg,#f8fbff 0%,#eef6ff 100%)",
            padding:isMobile ? "16px" : "20px",
            animation:"ch-fade-up .42s ease both",
            marginBottom:18,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, flexWrap:"wrap", marginBottom:12 }}>
              <MercadoPagoBadge />
              <div style={{ fontSize:12, color:"#1d4ed8", fontWeight:700 }}>{t("Checkout seguro", "Secure checkout")}</div>
            </div>

            {!mpPublicKey && (
              <div style={{
                border:"1px solid #f59e0b",
                background:"#fffbeb",
                borderRadius:10,
                padding:"8px 10px",
                fontSize:11,
                color:"#92400e",
                marginBottom:12,
              }}>
                {t("Configura VITE_MP_PUBLIC_KEY para inicializar el SDK de Mercado Pago.", "Set VITE_MP_PUBLIC_KEY to initialize Mercado Pago SDK.")}
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:10, marginBottom:12 }}>
              <button onClick={() => setCardFunding("credit")} style={{
                border: cardFunding === "credit" ? "1.8px solid #2563eb" : "1.5px solid #cfe2ff",
                background: cardFunding === "credit" ? "#dbeafe" : "#fff",
                borderRadius:10,
                padding:"10px 12px",
                cursor:"pointer",
                textAlign:"left",
                fontSize:12,
                fontWeight:700,
                color:"#1e3a8a",
              }}>
                {t("Tarjeta de credito", "Credit card")}
              </button>
              <button onClick={() => setCardFunding("debit")} style={{
                border: cardFunding === "debit" ? "1.8px solid #2563eb" : "1.5px solid #cfe2ff",
                background: cardFunding === "debit" ? "#dbeafe" : "#fff",
                borderRadius:10,
                padding:"10px 12px",
                cursor:"pointer",
                textAlign:"left",
                fontSize:12,
                fontWeight:700,
                color:"#1e3a8a",
              }}>
                {t("Tarjeta de debito", "Debit card")}
              </button>
            </div>

            <div style={{ marginBottom:12 }}>
              <input
                value={payerEmail}
                onChange={(e)=>setPayerEmail(e.target.value)}
                placeholder={t("Correo del comprador", "Buyer email")}
                style={field(errors.payerEmail)}
              />
              {errors.payerEmail && <div style={{ fontSize:11, color:"#cc0000", marginTop:2 }}>{errors.payerEmail}</div>}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <CardNetworkBadge network={cardNetwork} />
              <span style={{ fontSize:11, color:"#475569", fontWeight:600 }}>
                {cardNetwork === "visa"
                  ? t("Red detectada: VISA", "Detected network: VISA")
                  : cardNetwork === "mastercard"
                    ? t("Red detectada: Mastercard", "Detected network: Mastercard")
                    : t("El Brick detectara la red al escribir la tarjeta", "Brick will detect the network while entering the card")}
              </span>
            </div>

            <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
              <MercadoPagoCardVisual
                funding={cardFunding}
                network={cardNetwork}
                width={isMobile ? 220 : 250}
              />
            </div>

            <div style={{ border:"1px solid #cfe2ff", borderRadius:10, background:"#fff", padding:isMobile ? "10px" : "12px", marginBottom:12 }}>
              <CardPayment
                id="vl-card-payment-brick"
                initialization={{
                  amount: Number(total.toFixed(2)),
                  payer: { email: payerEmail || undefined },
                }}
                onBinChange={(bin) => setCardBin(bin || "")}
                onError={(error) => {
                  setPaymentError(error?.message || t("Error en Mercado Pago", "Mercado Pago error"));
                }}
                onSubmit={async (formData) => {
                  if (!validatePayment()) {
                    throw new Error(t("Debes ingresar un correo valido", "You must provide a valid email"));
                  }
                  await submitMercadoPagoPayment(formData as unknown as BrickCardFormData);
                }}
                customization={{
                  paymentMethods: {
                    minInstallments: 1,
                    maxInstallments: cardFunding === "credit" ? CHECKOUT_INSTALLMENTS[CHECKOUT_INSTALLMENTS.length - 1] : 1,
                    types: {
                      included: [cardFunding === "credit" ? "credit_card" : "debit_card"],
                    },
                  },
                }}
                locale="es-MX"
              />
            </div>

            {paymentError && (
              <div style={{ border:"1px solid #fecaca", background:"#fff1f2", color:"#b91c1c", borderRadius:10, padding:"10px 12px", fontSize:12, marginBottom:10 }}>
                {paymentError}
              </div>
            )}
            {isPaying && (
              <div style={{ border:"1px solid #bfdbfe", background:"#eff6ff", color:"#1d4ed8", borderRadius:10, padding:"10px 12px", fontSize:12, marginBottom:10 }}>
                {t("Procesando pago con Mercado Pago...", "Processing payment with Mercado Pago...")}
              </div>
            )}

            <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, cursor:"pointer", marginTop:8 }}>
              <input type="checkbox" checked={sameAddress} onChange={e=>setSameAddress(e.target.checked)}
                style={{ accentColor:"#c8960c", width:15, height:15 }}/>
              {t("Igual que la direccion de facturacion", "Same as billing address")}
            </label>

            <div style={{ fontSize:14, color:"#1e293b", fontWeight:700, margin:"14px 0 10px" }}>
              {t("Resumen de abonos", "Installment summary")}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile ? "1fr" : "1fr 1fr", gap:10, marginBottom:10 }}>
              <div style={{ border:"1px solid #dbeafe", borderRadius:10, padding:"10px 12px", background:"#fff" }}>
                <div style={{ fontSize:11, color:"#64748b" }}>{t("Plan", "Plan")}</div>
                <div style={{ fontSize:16, fontWeight:900, color:"#0f172a" }}>{paymentPlanLabel}</div>
              </div>
              <div style={{ border:"1px solid #dbeafe", borderRadius:10, padding:"10px 12px", background:"#fff" }}>
                <div style={{ fontSize:11, color:"#64748b" }}>{t("Total", "Total")}</div>
                <div style={{ fontSize:16, fontWeight:900, color:"#0f172a" }}>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            {installmentCount > 1 ? (
              <div style={{ border:"1px solid #dbeafe", borderRadius:10, padding:"10px 12px", background:"#fff" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#334155", marginBottom:6 }}>
                  <span>{t("Abonos mensuales", "Monthly installments")}</span>
                  <span style={{ fontWeight:700 }}>{installmentCount - 1} x ${monthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#334155", marginBottom:6 }}>
                  <span>{t("Ultimo abono", "Final installment")}</span>
                  <span style={{ fontWeight:700 }}>${finalInstallmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ fontSize:11, color:"#64748b" }}>
                  {t("La suma de abonos coincide exactamente con el total.", "Installments add up exactly to the order total.")}
                </div>
              </div>
            ) : (
              <div style={{ border:"1px solid #dbeafe", borderRadius:10, padding:"10px 12px", background:"#fff", fontSize:12, color:"#334155" }}>
                {t("Pago unico con Mercado Pago.", "One-time payment with Mercado Pago.")}
              </div>
            )}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:24 }}>
            <button onClick={()=>setStep("shipping")} style={btnSecondary}>{t("Atras", "Back")}</button>
            <div style={{ fontSize:12, color:"#64748b", alignSelf:"center" }}>
              {t("Usa el boton del Brick para pagar", "Use the Brick button to pay")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── CONFIRMATION ── */
  const renderConfirmation = () => (
    <div style={{ textAlign:"center", maxWidth:500, margin:"0 auto", padding:"40px 0" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"#c8960c", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12 5 5L20 7"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:"'Satoshi',sans-serif", fontSize:26, fontWeight:900, marginBottom:8 }}>{t("Orden confirmada!", "Order Confirmed!")}</h2>
      <p style={{ fontSize:13, color:"#888", marginBottom:6 }}>{t("Gracias por tu compra. Tu orden esta siendo procesada.", "Thank you for your purchase. Your order is being processed.")}</p>
      <p style={{ fontSize:12, color:"#aaa", marginBottom:8 }}>{t("Orden", "Order")} #VL-{Math.floor(Math.random()*900000+100000)}</p>
      {paymentResult && (
        <div style={{ marginBottom:22, display:"inline-flex", flexDirection:"column", gap:6, alignItems:"center", background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"10px 14px" }}>
          <span style={{ fontSize:11, color:"#475569" }}>{t("Pago Mercado Pago", "Mercado Pago payment")} ID: <strong>{paymentResult.id}</strong></span>
          <span style={{ fontSize:11, color:"#475569" }}>
            {t("Estado", "Status")}: <strong>{paymentResult.status}</strong>
            {paymentResult.status_detail ? ` (${paymentResult.status_detail})` : ""}
          </span>
          {paymentResult.payment_method_id && (
            <span style={{ fontSize:11, color:"#64748b" }}>
              {t("Metodo", "Method")}: {paymentResult.payment_method_id}
            </span>
          )}
        </div>
      )}
      <div style={{ border:"1.5px solid #f0f0f0", borderRadius:12, padding:"18px", textAlign:"left", marginBottom:24 }}>
        {cart.map(item=>(
          <div key={item.id} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
            <span style={{ color:"#555" }}>{item.name}</span>
            <span style={{ fontWeight:700 }}>${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{ height:1, background:"#f0f0f0", margin:"10px 0" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#666", marginBottom:8 }}>
          <span>{t("Plan de compra", "Purchase plan")}</span><span>{confirmedPlanLabel}</span>
        </div>
        {confirmedInstallments > 1 && (
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#666", marginBottom:8 }}>
            <span>{t("Cuotas", "Installments")}</span>
            <span>
              ${confirmedMonthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x {confirmedInstallments - 1}
              {" + "}
              ${confirmedLastInstallmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:800 }}>
          <span>{t("Total pagado", "Total Paid")}</span><span style={{ color:"#c8960c" }}>${total.toLocaleString()}</span>
        </div>
      </div>
      <button onClick={()=>{setStep("cart");clearCart();}} style={{...btnPrimary, padding:"12px 40px"}}>
        {t("Volver a la tienda", "Back to Shop")}
      </button>
    </div>
  );

  /* ═══════════════════════════════════════
     ROOT RENDER
  ═══════════════════════════════════════ */
  return (
    <>
      <style>{`
        .ch-root { font-family:'Satoshi',sans-serif; background:#f8f8f8; min-height:100vh; }
        input, select, textarea, button { font-family:'Satoshi',sans-serif; }
        @keyframes ch-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ch-pop-in {
          from { opacity: 0; transform: scale(.88); }
          to { opacity: 1; transform: scale(1); }
        }
        input:focus { border-color:#c8960c !important; outline:none; box-shadow:0 0 0 3px rgba(200,150,12,.12); }
      `}</style>

      <div className="ch-root">
        {/* Header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:isMobile ? "12px 14px" : "12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Satoshi',sans-serif", fontSize:isMobile ? 18 : 20, fontWeight:900 }}>Vendo Laptops</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:isMobile ? "wrap" : "nowrap", justifyContent:"flex-end" }}>
            {(["cart","address","shipping","payment"] as Step[]).map((s,i)=>(
              <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{
                  width:8, height:8, borderRadius:"50%",
                  background: step===s || (step==="confirmation" && s==="payment") ? "#c8960c" : s===step?"#111":"#e0e0e0",
                }}/>
                {i<3 && <div style={{ width:18, height:1, background:"#e0e0e0" }}/>}
              </div>
            ))}

            <div style={{ display:"flex", border:"1px solid #e5e7eb", borderRadius:999, overflow:"hidden" }}>
              {(["es", "en"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    border:"none",
                    padding:isMobile ? "5px 8px" : "6px 10px",
                    fontSize:11,
                    fontWeight:700,
                    background:lang===code ? "#c8960c" : "#fff",
                    color:lang===code ? "#fff" : "#6b7280",
                    cursor:"pointer",
                  }}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:isMobile ? "20px 14px" : "28px 24px" }}>
          {/* Progress steps (checkout flow only) */}
          {step !== "cart" && step !== "confirmation" && <StepIndicator current={step} lang={lang} isMobile={isMobile}/>}

          {step === "cart"         && renderCart()}
          {step === "address"      && renderAddress()}
          {step === "shipping"     && renderShipping()}
          {step === "payment"      && renderPayment()}
          {step === "confirmation" && renderConfirmation()}
        </div>
      </div>
    </>
  );
}
