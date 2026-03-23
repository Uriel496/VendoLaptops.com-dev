export default function Footer() {
  return (
    <footer style={{background:"#111", color:"#ccc", padding:"44px 36px 24px"}}>
      <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr", gap:40, marginBottom:32}}>
        {/* col 1 – brand */}
        <div>
          <div style={{
            fontFamily:"'Sansita', sans-serif",
            fontSize:22, fontWeight:800, color:"#fff", marginBottom:12,
          }}>
            Vendo Laptops
          </div>
          <p style={{fontSize:12.5, lineHeight:1.7, color:"#888", maxWidth:220}}>
            We are a residential interior design firm located in Portland. Our boutique-studio offers more than
          </p>
          {/* social icons */}
          <div style={{display:"flex", gap:14, marginTop:18}}>
            {/* Twitter/X */}
            <a href="#" style={{color:"#888", display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.849L2.25 2.25h6.918l4.257 5.63 4.82-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            {/* Facebook */}
            <a href="#" style={{color:"#888", display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* TikTok */}
            <a href="#" style={{color:"#888", display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" style={{color:"#888", display:"flex"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
        </div>

        {/* col 2 – Services */}
        <div>
          <div style={{fontSize:14, fontWeight:700, color:"#fff", marginBottom:14}}>Services</div>
          {["Bonus program","Gift cards","Credit and payment","Service contracts","Non-cash account","Payment"].map(item => (
            <a key={item} href="#" style={{display:"block", fontSize:12.5, color:"#888", marginBottom:8, textDecoration:"none", lineHeight:1.5}}>
              {item}
            </a>
          ))}
        </div>

        {/* col 3 – Assistance */}
        <div>
          <div style={{fontSize:14, fontWeight:700, color:"#fff", marginBottom:14}}>Assistance to the buyer</div>
          {["Find an order","Terms of delivery","Exchange and return of goods","Guarantee","Frequently asked questions","Terms of use of the site"].map(item => (
            <a key={item} href="#" style={{display:"block", fontSize:12.5, color:"#888", marginBottom:8, textDecoration:"none", lineHeight:1.5}}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* divider + copyright */}
      <div style={{borderTop:"1px solid #2a2a2a", paddingTop:16, fontSize:12, color:"#555"}}>
        © 2026 All rights reserved. CobraSytems.
      </div>
    </footer>
  );
}

