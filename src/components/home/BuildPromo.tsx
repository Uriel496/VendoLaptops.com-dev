import { Link } from "react-router-dom";
import laptopImage from "../../assets/pngwing.com 1.svg";

export default function BuildPromo() {
  return (
    <div style={{margin:"0 20px 28px", borderRadius:10, overflow:"hidden", background:"#111", position:"relative", minHeight:160, display:"flex", alignItems:"center"}}>
      {/* texto */}
      <div style={{padding:"32px 48px", zIndex:2, flex:1}}>
        <div style={{
          fontFamily:"'Sansita', sans-serif",
          fontSize:38, fontWeight:900, color:"#fff",
          lineHeight:1.08, letterSpacing:"-0.5px",
          marginBottom:10,
        }}>
          CONSTRUYE TU<br/>PC GAMER
        </div>
        <p style={{ fontSize:13, color:"#888", marginBottom:16, maxWidth:340 }}>
          Personaliza cada componente y crea la PC perfecta para tus necesidades
        </p>
        <Link to="/pc-builder" style={{
          display:"inline-block",
          padding:"12px 28px",
          background:"#c8960c",
          color:"#000",
          fontSize:12, fontWeight:800,
          letterSpacing:1.5, textTransform:"uppercase",
          textDecoration:"none",
          borderRadius:20,
          transition:"all .2s",
        }}>
          CONFIGURADOR PC →
        </Link>
      </div>

      {/* visual circles + laptop */}
      <div style={{position:"absolute", right:0, top:0, bottom:0, width:420, overflow:"hidden"}}>
        {/* big gold circle right */}
        <div style={{position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", width:180, height:180, borderRadius:"50%", background:"#c8a200"}}/>
        {/* small gold circle top-center */}
        <div style={{position:"absolute", right:140, top:5, width:110, height:110, borderRadius:"50%", background:"#c8a200"}}/>
        {/* laptop image on top */}
        <div style={{position:"absolute", right:-40, top:"50%", transform:"translateY(-50%)", zIndex:2}}>
          <img src={laptopImage} alt="Laptop" style={{ width: '360px', height: '250px', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}
