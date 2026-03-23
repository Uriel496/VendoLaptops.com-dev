import { Link } from "react-router-dom";
import ProductImage from "../ui/ProductImage";
import { categories } from "../../constants/data";

export default function CategoriesSection() {
  return (
    <div className="vl-section" style={{paddingTop: 32}}>
      <div className="vl-section-header">
        <div className="vl-section-title" style={{borderLeft:"3px solid #f5c518", paddingLeft:10}}>
          Categorías que te pueden <span>gustar</span>
        </div>
        <Link className="vl-view-all" to="/catalog">
          Ver Todo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </Link>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20}}>
        {categories.map((cat, i) => (
          <Link to="/catalog" key={i} style={{
            border:"1.5px solid #e5c85a",
            borderRadius:10,
            padding:"18px 10px 12px",
            display:"flex", flexDirection:"column", alignItems:"center",
            cursor:"pointer",
            background:"#fff",
            transition:"box-shadow .2s",
            textDecoration:"none",
          }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow="0 4px 18px rgba(245,197,24,.18)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow="none")}
          >
            <div style={{height:100, display:"flex", alignItems:"center", justifyContent:"center"}}>
              <ProductImage type={cat.img} />
            </div>
            <span style={{marginTop:10, fontSize:13, fontWeight:600, color:"#111"}}>{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* dots */}
      <div style={{display:"flex", justifyContent:"center", gap:6, marginBottom:8}}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: i===0 ? 22 : 8,
            height:8,
            borderRadius:4,
            background: i===0 ? "#f5c518" : "#ddd",
            cursor:"pointer"
          }}/>
        ))}
      </div>
    </div>
  );
}
