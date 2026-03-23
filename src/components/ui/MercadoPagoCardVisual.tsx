import MercadopagoIcon from "./MercadopagoIcon";
import VisaIcon from "./VisaIcon";
import MastercardIcon from "./MastercardIcon";

type CardFunding = "credit" | "debit";
type CardNetwork = "visa" | "mastercard" | "unknown";

interface MercadoPagoCardVisualProps {
  funding: CardFunding;
  network: CardNetwork;
  width?: number;
}

export default function MercadoPagoCardVisual({
  funding,
  network,
  width = 260,
}: MercadoPagoCardVisualProps) {
  const networkLabel = network === "visa" ? "VISA" : network === "mastercard" ? "MASTERCARD" : "CARD";
  const height = (width * 480) / 300;

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <defs>
          <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0f17" />
            <stop offset="38%" stopColor="#081524" />
            <stop offset="70%" stopColor="#0a2238" />
            <stop offset="100%" stopColor="#050a13" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="58%" cy="62%" r="58%">
            <stop offset="0%" stopColor="#00a2d6" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#0e4a6f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#081423" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="leftShadow" cx="0%" cy="20%" r="95%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.78" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="bottomShadow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.62" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="edgeLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="chipSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f5f7" />
            <stop offset="32%" stopColor="#e4e8ec" />
            <stop offset="68%" stopColor="#c8d0d9" />
            <stop offset="100%" stopColor="#b5bec9" />
          </linearGradient>

          <filter id="cardShadow" x="-18%" y="-12%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000000" floodOpacity="0.52" />
            <feDropShadow dx="0" dy="38" stdDeviation="30" floodColor="#000000" floodOpacity="0.34" />
          </filter>

          <clipPath id="cardClip">
            <rect x="10" y="10" width="280" height="460" rx="20" ry="20" />
          </clipPath>
        </defs>

        <rect x="10" y="10" width="280" height="460" rx="20" ry="20" fill="url(#cardBg)" filter="url(#cardShadow)" />

        <g clipPath="url(#cardClip)">
          <rect x="10" y="10" width="280" height="460" fill="url(#centerGlow)" />
          <rect x="10" y="10" width="280" height="460" fill="url(#leftShadow)" />
          <rect x="10" y="10" width="280" height="460" fill="url(#bottomShadow)" />

          <text x="26" y="136" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="94" fill="rgba(255,255,255,0.1)" letterSpacing="-2">MER</text>
          <text x="26" y="228" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="94" fill="rgba(255,255,255,0.1)" letterSpacing="-2">CADO</text>
          <text x="26" y="320" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="94" fill="rgba(255,255,255,0.1)" letterSpacing="-2">PAGO</text>

          <rect x="120" y="52" width="60" height="44" rx="7" fill="url(#chipSilver)" opacity="0.95" />
          <line x1="120" y1="67" x2="180" y2="67" stroke="#97a2af" strokeWidth="0.9" opacity="0.7" />
          <line x1="120" y1="79" x2="180" y2="79" stroke="#97a2af" strokeWidth="0.9" opacity="0.7" />
          <line x1="140" y1="52" x2="140" y2="96" stroke="#97a2af" strokeWidth="0.9" opacity="0.62" />
          <line x1="160" y1="52" x2="160" y2="96" stroke="#97a2af" strokeWidth="0.9" opacity="0.62" />
          <rect x="133" y="61" width="34" height="24" rx="3" fill="#cfd5dd" opacity="0.58" />

          <circle cx="226" cy="76" r="2.5" fill="white" opacity="0.9" />
          <path d="M234,67 A12,12 0 0,1 234,85" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.88" />
          <path d="M241,61 A19,19 0 0,1 241,91" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.56" />
          <path d="M248,55 A26,26 0 0,1 248,97" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.34" />

          <text x="248" y="408" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontWeight="500" fontSize="13" fill="rgba(255,255,255,0.8)" textAnchor="end">{funding}</text>
          <text
            x="252"
            y="444"
            fontFamily={network === "visa" ? "'Times New Roman', 'Georgia', serif" : "'Arial Black', 'Arial', sans-serif"}
            fontWeight="700"
            fontSize={network === "mastercard" ? "23" : "38"}
            fill="white"
            textAnchor="end"
            fontStyle={network === "visa" ? "italic" : "normal"}
            letterSpacing={network === "visa" ? "-1" : "0"}
          >
            {networkLabel}
          </text>

          <rect x="10" y="10" width="280" height="460" fill="url(#edgeLight)" opacity="0.22" />
        </g>

        <rect x="10" y="10" width="280" height="460" rx="20" ry="20" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: Math.round(width * 0.08),
          bottom: Math.round(height * 0.08),
          width: Math.round(width * 0.25),
          height: Math.round(width * 0.25),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      >
        {network === "visa" && (
          <VisaIcon size={Math.round(width * 0.22)} color="#ffffff" opacity={1} />
        )}
        {network === "mastercard" && (
          <MastercardIcon size={Math.round(width * 0.22)} color="#ffffff" opacity={1} />
        )}
        {network === "unknown" && (
          <MercadopagoIcon size={Math.round(width * 0.2)} color="#ffffff" strokeWidth={0} opacity={1} />
        )}
      </div>
    </div>
  );
}
