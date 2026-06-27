import { useState } from "react";

const GS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;background:#f7f7f7;color:#1a1a1a}button,input,select,textarea{font-family:'Inter',sans-serif}`;

// ── UNIT TYPES ──────────────────────────────────────────────────────────────
// FIXED QTY  : unit, nos, no, kg, roll, litre, ml, bag, set, sheet, can
// LENGTH/AREA : metre, sq ft, sq m, running ft  → smart calculator shown
// TILE packs  : sq ft / sq m WITH tilesPerPack → pack-based calculator shown

const PRODUCTS = [
  // ── Architecture / Civil ─────────────────────────────────────────────────
  {id:1,sid:"S1",sn:"BuildRight Supplies",name:"AAC Lightweight Block 600×200mm",brand:"UltraTech",cat:"Bricks & Blocks",sub:"arch",price:38,old:49,rating:4.4,rev:1240,disc:22,icon:"🧱",
    desc:"Autoclaved Aerated Concrete blocks — lighter, stronger, thermally superior to clay bricks. ISI certified. 600×200×200mm size.",
    unit:"unit",badge:"Best Seller",stock:5000,
    // FIXED QTY — buyer enters how many blocks needed, qty×38=total
    calcType:"fixed",
    hint:"~8.3 blocks needed per sq ft of wall (200mm thick)"},

  {id:2,sid:"S1",sn:"BuildRight Supplies",name:"PPC 53-Grade Portland Cement 50kg",brand:"Ambuja",cat:"Cement",sub:"arch",price:358,old:420,rating:4.9,rev:3860,disc:15,icon:"🏗️",
    desc:"Premium Portland Pozzolana Cement for all structural applications. High durability, low heat of hydration.",
    unit:"bag",badge:"Top Rated",stock:200,calcType:"fixed",hint:"1 bag (50kg) covers ~35 bricks with mortar or ~15 sq ft plaster"},

  {id:3,sid:"S1",sn:"BuildRight Supplies",name:"TMT Fe-500 Steel Bar 12mm/kg",brand:"TATA Steel",cat:"Steel & TMT",sub:"arch",price:62,old:72,rating:4.7,rev:980,disc:14,icon:"⚙️",
    desc:"Fe-500 grade TMT bars. Earthquake resistant, BIS marked. Sold per kg.",
    unit:"kg",badge:"ISI Certified",stock:10000,calcType:"fixed",hint:"~3.5 kg of steel per sq ft of RCC slab (standard)"},

  {id:4,sid:"S1",sn:"BuildRight Supplies",name:"FR PVC House Wire 1.5sqmm",brand:"Polycab",cat:"Electrical",sub:"arch",price:2520,old:3060,rating:4.8,rev:2100,disc:18,icon:"⚡",
    desc:"ISI marked flame retardant PVC insulated copper conductor wire. 1.5sqmm. Sold in 90m roll.",
    unit:"roll",badge:"Best Seller",stock:200,calcType:"fixed",
    packLabel:"1 Roll = 90 metres",packMetre:90,pricePerMetre:28,
    hint:"1 roll = 90m. 1 BHK typically needs 4–6 rolls (360–540m)"},

  {id:5,sid:"S1",sn:"BuildRight Supplies",name:"Astral CPVC Pipe 1 inch",brand:"Astral",cat:"Plumbing",sub:"arch",price:88,old:110,rating:4.5,rev:720,disc:20,icon:"🔧",
    desc:"CPVC pipe for hot & cold water up to 93°C. SDR-11, IS 15778. Lead-free. Each piece = 3 metres.",
    unit:"piece",badge:"",stock:500,calcType:"length",
    packLabel:"1 piece = 3 metres",metresPerUnit:3,pricePerMetre:88,
    hint:"Enter total pipe length needed — calculator will tell you how many 3m pieces to buy"},

  {id:6,sid:"S1",sn:"BuildRight Supplies",name:"Dr. Fixit Waterproofing Compound 1kg",brand:"Pidilite",cat:"Waterproofing",sub:"arch",price:620,old:750,rating:4.6,rev:540,disc:17,icon:"💧",
    desc:"Integral waterproofing compound. 1kg covers ~35 sq ft (2 coats). Water permeability reduced by 95%.",
    unit:"kg",badge:"",stock:150,calcType:"fixed",hint:"1kg covers ~35 sq ft (2 coats)"},

  // ── Interior / Flooring ──────────────────────────────────────────────────
  {id:7,sid:"S2",sn:"TileWorld India",name:"Porcelain Marble Tile 600×600mm (2×2 ft)",brand:"Kajaria",cat:"Tiles & Flooring",sub:"interior",price:68,old:95,rating:4.7,rev:924,disc:28,icon:"🪟",
    desc:"Full-body vitrified porcelain tile 600×600mm (2ft×2ft). Scratch resistant, R9 anti-slip. Each box has 4 tiles covering ~1.44 sqm (15.5 sq ft).",
    unit:"sq ft",badge:"Trending",stock:800,calcType:"tile",
    tileW:2,tileH:2,tilesPerPack:4,packSqft:16,packPrice:68*16,
    packLabel:"1 Box = 4 tiles (2×2 ft each) = 16 sq ft"},

  {id:21,sid:"S2",sn:"TileWorld India",name:"Porcelain Marble Tile 600×1200mm (2×4 ft)",brand:"Kajaria",cat:"Tiles & Flooring",sub:"interior",price:85,old:120,rating:4.7,rev:680,disc:29,icon:"🟦",
    desc:"Large format vitrified porcelain tile 600×1200mm (2ft×4ft). Each box has 2 tiles covering ~1.44 sqm (15.5 sq ft). Fewer grout lines, premium look.",
    unit:"sq ft",badge:"Premium",stock:400,calcType:"tile",
    tileW:2,tileH:4,tilesPerPack:2,packSqft:16,packPrice:85*16,
    packLabel:"1 Box = 2 tiles (2×4 ft each) = 16 sq ft"},

  {id:8,sid:"S2",sn:"TileWorld India",name:"Apex Exterior Emulsion 20L",brand:"Asian Paints",cat:"Paint & Textures",sub:"interior",price:3840,old:4500,rating:4.8,rev:2340,disc:15,icon:"🎨",
    desc:"100% acrylic exterior paint. UV shield, anti-algae, 10-year warranty. 1 litre covers ~130–150 sq ft (2 coats). 20L = up to 3000 sq ft.",
    unit:"can",badge:"Top Rated",stock:80,calcType:"coverage",
    coveragePerLitre:140,litresPerPack:20,packPrice:3840,
    hint:"20L can covers ~2,800 sq ft (2 coats on smooth wall)"},

  {id:9,sid:"S2",sn:"TileWorld India",name:"Lumeno Smart LED Panel 18W",brand:"Havells",cat:"Lighting",sub:"interior",price:1020,old:1240,rating:4.6,rev:578,disc:18,icon:"💡",
    desc:"Smart dimmable LED panel. 2700K warm white, 90+ CRI, app-controlled. 1 unit per 80–100 sq ft room.",
    unit:"unit",badge:"",stock:300,calcType:"fixed",hint:"1 panel recommended per 80–100 sq ft"},

  {id:10,sid:"S2",sn:"TileWorld India",name:"Single Lever Basin Mixer Chrome",brand:"Jaquar",cat:"Bathroom",sub:"interior",price:4200,old:5100,rating:4.5,rev:430,disc:18,icon:"🚿",
    desc:"WRAS approved single lever basin mixer. Ceramic disc cartridge, aerator, 5-year warranty.",
    unit:"unit",badge:"",stock:40,calcType:"fixed",hint:"1 unit per wash basin"},

  {id:11,sid:"S2",sn:"TileWorld India",name:"Modular Kitchen Pull-Out Basket Set",brand:"Hettich",cat:"Modular Kitchen",sub:"interior",price:3200,old:3900,rating:4.8,rev:210,disc:18,icon:"🍳",
    desc:"Soft-close tandem pull-out basket. 25kg capacity, epoxy coated, 100,000 cycles tested.",
    unit:"set",badge:"Best Seller",stock:60,calcType:"fixed",hint:"1 set per cabinet unit"},

  {id:12,sid:"S2",sn:"TileWorld India",name:"BWR Grade Plywood 19mm 8×4ft",brand:"Greenply",cat:"Wood & Boards",sub:"interior",price:1840,old:2200,rating:4.6,rev:670,disc:16,icon:"🪵",
    desc:"Boiling Water Resistant plywood. IS:303 graded. Each sheet = 8ft×4ft = 32 sq ft. For furniture, kitchen cabinets.",
    unit:"sheet",badge:"",stock:120,calcType:"fixed",
    packLabel:"1 Sheet = 8×4 ft = 32 sq ft",hint:"1 sheet covers 32 sq ft"},

  {id:13,sid:"S2",sn:"TileWorld India",name:"Vinyl Plank Flooring 4mm (per sq ft)",brand:"FloorMax",cat:"Tiles & Flooring",sub:"interior",price:55,old:70,rating:4.5,rev:520,disc:21,icon:"🟫",
    desc:"Waterproof luxury vinyl plank 4mm. Each plank 4ft×8 inches (0.33ft). Carton = 20 sq ft. Click-lock, float installation.",
    unit:"sq ft",badge:"",stock:1200,calcType:"tile",
    tileW:0.67,tileH:4,tilesPerPack:9,packSqft:24,packPrice:55*24,
    packLabel:"1 Carton = ~9 planks (4ft×0.67ft each) = 24 sq ft"},

  {id:14,sid:"S2",sn:"TileWorld India",name:"3D Wallpaper Brick Pattern 5m Roll",brand:"WallDecor Pro",cat:"Home Decor",sub:"decor",price:650,old:850,rating:4.4,rev:340,disc:24,icon:"🖼️",
    desc:"Self-adhesive 3D PVC wallpaper. Each roll: 5m×0.6m = 3 sq m (32 sq ft). Waterproof, heat resistant.",
    unit:"roll",badge:"New",stock:200,calcType:"fixed",
    packLabel:"1 Roll = 5m × 0.6m = 3 sq m (32 sq ft)",hint:"Measure total wall area ÷ 32 = rolls needed"},

  {id:15,sid:"S2",sn:"TileWorld India",name:"Handwoven Jute Area Rug 5×7ft",brand:"CraftIndia",cat:"Home Decor",sub:"decor",price:2200,old:2900,rating:4.6,rev:290,disc:24,icon:"🏮",
    desc:"Handwoven natural jute rug with cotton border. 5ft×7ft = 35 sq ft. Reversible, non-slip backing.",
    unit:"unit",badge:"New",stock:50,calcType:"fixed"},

  {id:16,sid:"S2",sn:"TileWorld India",name:"Sconce Wall Light Brass Finish",brand:"Orient Electric",cat:"Lighting",sub:"decor",price:1800,old:2400,rating:4.3,rev:180,disc:25,icon:"🕯️",
    desc:"Antique brass finish wall sconce with E27 holder. Compatible with LED bulbs.",
    unit:"unit",badge:"",stock:35,calcType:"fixed"},

  {id:17,sid:"S2",sn:"TileWorld India",name:"Premium Roller Blind Blackout 4×5ft",brand:"Magicblind",cat:"Home Decor",sub:"decor",price:1450,old:1900,rating:4.5,rev:380,disc:24,icon:"🪟",
    desc:"100% blackout polyester roller blind. 4ft×5ft. UV blocking, thermal insulating, chain operation.",
    unit:"unit",badge:"",stock:90,calcType:"fixed",hint:"1 unit per window. Measure window width×height"},

  {id:18,sid:"S2",sn:"TileWorld India",name:"Decorative Concrete Pot Set of 3",brand:"UrbanCraft",cat:"Home Decor",sub:"decor",price:890,old:1200,rating:4.4,rev:155,disc:26,icon:"🏺",
    desc:"Set of 3 minimalist concrete planters. Weather resistant for indoor/outdoor.",
    unit:"set",badge:"",stock:70,calcType:"fixed"},

  {id:19,sid:"S1",sn:"BuildRight Supplies",name:"River Sand Fine Grade",brand:"Local Grade A",cat:"Aggregates",sub:"arch",price:45,old:55,rating:4.2,rev:890,disc:18,icon:"🪨",
    desc:"Washed fine river sand. Silt content <3%. 1 bag ≈ 1 cubic ft.",
    unit:"bag",badge:"",stock:2000,calcType:"fixed",hint:"~1.5 bags of sand per bag of cement for mortar"},

  {id:20,sid:"S1",sn:"BuildRight Supplies",name:"Galvalume Roofing Sheet 0.47mm",brand:"JSW Steel",cat:"Roofing",sub:"arch",price:340,old:400,rating:4.3,rev:310,disc:15,icon:"🏠",
    desc:"Galvalume coated corrugated sheet. Each sheet: 10ft×3ft = 30 sq ft. 3× corrosion resistance, 25yr durability.",
    unit:"sheet",badge:"",stock:400,calcType:"fixed",
    packLabel:"1 Sheet = 10ft×3ft = 30 sq ft",hint:"Measure roof area ÷ 30 = sheets needed (add 10% for overlap)"},
];

const SELLERS = [
  {id:"S1",name:"BuildRight Supplies",owner:"Rahul Sharma",email:"rahul@buildright.in",phone:"9876543210",city:"Bhopal",gst:"23ABCDE1234F1Z5",status:"approved",plan:"paid",joined:"2026-01-10",totalOrders:142,earnings:84200,pendingPayout:12400,commission:8,delivery:["self","platform"]},
  {id:"S2",name:"TileWorld India",owner:"Priya Kulkarni",email:"priya@tileworld.in",phone:"9123456780",city:"Indore",gst:"23XYZAB5678G2H6",status:"approved",plan:"paid",joined:"2026-02-14",totalOrders:98,earnings:62100,pendingPayout:8800,commission:8,delivery:["platform"]},
  {id:"S3",name:"DecorHaven",owner:"Arjun Mehta",email:"arjun@decorhaven.in",phone:"9988776655",city:"Pune",gst:"27LMNOP9012I3J7",status:"pending",plan:"free",joined:"2026-06-20",totalOrders:0,earnings:0,pendingPayout:0,commission:0,delivery:["self"]},
  {id:"S4",name:"ElectroMart Pro",owner:"Sunita Verma",email:"sunita@electromart.in",phone:"9001122334",city:"Nagpur",gst:"27QRSTU3456K4L8",status:"rejected",plan:"free",joined:"2026-06-18",totalOrders:0,earnings:0,pendingPayout:0,commission:0,delivery:["self"]},
];

const ORDERS_SEED = [
  {id:"ORD001",buyer:"Vikram Joshi",city:"Bhopal",date:"2026-06-18",items:[{...PRODUCTS[0],qty:50},{...PRODUCTS[1],qty:10}],total:5458,status:"delivered",sid:"S1",sn:"BuildRight Supplies",payment:"UPI",delivery:"platform",tracking:"SHIP8821",commission:436},
  {id:"ORD002",buyer:"Meena Patel",city:"Indore",date:"2026-06-20",items:[{...PRODUCTS[6],qty:120}],total:8160,status:"dispatched",sid:"S2",sn:"TileWorld India",payment:"Card",delivery:"platform",tracking:"SHIP9034",commission:653},
  {id:"ORD003",buyer:"Suresh Kumar",city:"Nagpur",date:"2026-06-21",items:[{...PRODUCTS[8],qty:8}],total:8160,status:"confirmed",sid:"S2",sn:"TileWorld India",payment:"COD",delivery:"self",tracking:"",commission:653},
  {id:"ORD004",buyer:"Anjali Singh",city:"Jabalpur",date:"2026-06-22",items:[{...PRODUCTS[5],qty:5}],total:3100,status:"pending",sid:"S1",sn:"BuildRight Supplies",payment:"UPI",delivery:"self",tracking:"",commission:248},
  {id:"ORD005",buyer:"Rohit Gupta",city:"Pune",date:"2026-06-22",items:[{...PRODUCTS[13],qty:3},{...PRODUCTS[14],qty:1}],total:4150,status:"confirmed",sid:"S2",sn:"TileWorld India",payment:"NetBanking",delivery:"platform",tracking:"",commission:332},
];

const SC = {pending:"#F59E0B",confirmed:"#3B82F6",dispatched:"#8B5CF6",delivered:"#10B981",cancelled:"#EF4444",rejected:"#EF4444",approved:"#10B981"};
const CATS = ["All","Bricks & Blocks","Cement","Steel & TMT","Waterproofing","Plumbing","Electrical","Roofing","Aggregates","Tiles & Flooring","Paint & Textures","Lighting","Bathroom","Wood & Boards","Home Decor","Modular Kitchen"];

// ── Shared UI ──────────────────────────────────────────────────────────────
const Bdg = ({label,color="#10B981"}) => <span style={{background:color+"22",color,fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{label}</span>;
const Btn = ({children,onClick,color="#C84B1F",outline,sm,full,disabled,style:s={}}) => (
  <button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":(disabled?"#ccc":color),color:outline?color:"#fff",border:`1.5px solid ${disabled?"#ccc":color}`,padding:sm?"5px 12px":"10px 20px",borderRadius:8,fontSize:sm?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?.7:1,...s}}>{children}</button>
);
const Card = ({children,style:s={}}) => <div style={{background:"#fff",borderRadius:14,border:"1px solid #e8e8e8",...s}}>{children}</div>;
const StatCard = ({icon,label,value,sub,color="#C84B1F"}) => (
  <Card style={{padding:"18px 20px"}}>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:44,height:44,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color}}>{icon}</div>
      <div><div style={{fontSize:11,color:"#888",marginBottom:2}}>{label}</div><div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#888"}}>{sub}</div>}</div>
    </div>
  </Card>
);
const Inp = ({label,value,onChange,type="text",placeholder}) => (
  <div style={{display:"flex",flexDirection:"column",gap:4}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:"#555"}}>{label}</label>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder||label} style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"9px 12px",fontSize:13,outline:"none",width:"100%"}}/>
  </div>
);
const Stars = ({r}) => <span style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(r)?"#F5A623":"#ddd",fontSize:12}}>★</span>)}</span>;

// ── Portal Selector ────────────────────────────────────────────────────────
function PortalSelect({onSelect}) {
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1a1a,#2d1810)",padding:24}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:800,color:"#fff",marginBottom:4}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div>
      <div style={{fontSize:12,color:"rgba(255,255,255,.4)",letterSpacing:2,marginBottom:44,textTransform:"uppercase"}}>Multi-Vendor Marketplace</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:680,width:"100%"}}>
        {[{role:"buyer",icon:"🛒",title:"Buyer",desc:"Shop architecture & interior products from verified sellers",color:"#C84B1F"},{role:"seller",icon:"🏪",title:"Seller",desc:"List products, manage orders, track earnings & payouts",color:"#7C3AED"},{role:"admin",icon:"⚙️",title:"Admin",desc:"Manage platform, approve sellers, release payouts",color:"#0369A1"}].map(p=>(
          <div key={p.role} onClick={()=>onSelect(p.role)} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,padding:"26px 22px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=p.color+"28";e.currentTarget.style.borderColor=p.color;}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>
            <div style={{fontSize:38,marginBottom:12}}>{p.icon}</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:17,marginBottom:7}}>{p.title} Portal</div>
            <div style={{color:"rgba(255,255,255,.45)",fontSize:12,lineHeight:1.5,marginBottom:18}}>{p.desc}</div>
            <div style={{background:p.color,color:"#fff",padding:"8px 0",borderRadius:8,fontSize:13,fontWeight:600}}>Enter →</div>
          </div>
        ))}
      </div>
      <div style={{color:"rgba(255,255,255,.2)",fontSize:11,marginTop:36}}>Demo mode · All data simulated</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  BUYER PORTAL
// ══════════════════════════════════════════════════════════════════════
function BuyerPortal({onSwitch}) {
  const [page,setPage] = useState("home");
  const [cart,setCart] = useState([]);
  const [wish,setWish] = useState([]);
  const [myOrders,setMyOrders] = useState([]);
  const [detail,setDetail] = useState(null);
  const [prods,setProds] = useState(PRODUCTS);

  const addCart = p => setCart(c=>{const e=c.find(i=>i.id===p.id);return e?c.map(i=>i.id===p.id?{...i,qty:i.qty+(p.qty||1)}:i):[...c,{...p,qty:p.qty||1}];});
  const toggleWish = id => setWish(w=>w.includes(id)?w.filter(i=>i!==id):[...w,id]);
  const go = pg => setPage(pg);

  return (
    <div>
      {/* Navbar */}
      <nav style={{background:"#fff",borderBottom:"1px solid #e8e8e8",position:"sticky",top:0,zIndex:999}}>
        <div style={{background:"#C84B1F",color:"#fff",textAlign:"center",padding:"6px",fontSize:12}}>
          🎉 Mega Sale — 20% off | Code <strong>BUILD20</strong> | Free delivery ₹2,999+
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",gap:12,flexWrap:"wrap"}}>
          <div onClick={()=>go("home")} style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,cursor:"pointer"}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div>
          <div style={{display:"flex",background:"#f5f5f5",border:"1.5px solid #e0e0e0",borderRadius:8,overflow:"hidden",flex:"0 1 320px"}}>
            <input placeholder="Search products, brands..." style={{border:"none",background:"transparent",padding:"9px 12px",fontSize:13,outline:"none",flex:1}}/>
            <button style={{background:"#C84B1F",border:"none",color:"#fff",padding:"9px 14px"}}>🔍</button>
          </div>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            {[{icon:"👤",label:"Account",pg:"login"},{icon:"♥",label:`Wish${wish.length?"("+wish.length+")":""}`,pg:"shop"}].map(a=>(
              <button key={a.pg} onClick={()=>go(a.pg)} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:1,color:"#555",fontSize:10}}><span style={{fontSize:19}}>{a.icon}</span>{a.label}</button>
            ))}
            <button onClick={()=>go("cart")} style={{background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:1,color:"#C84B1F",fontSize:10,position:"relative"}}>
              <span style={{fontSize:19}}>🛒</span>
              {cart.length>0&&<span style={{position:"absolute",top:-4,right:-6,background:"#C84B1F",color:"#fff",fontSize:9,width:15,height:15,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{cart.reduce((s,i)=>s+i.qty,0)}</span>}
              Cart
            </button>
            <button onClick={()=>go("orders")} style={{background:"none",border:"none",color:"#555",fontSize:10,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}><span style={{fontSize:19}}>📦</span>Orders</button>
            <button onClick={onSwitch} style={{background:"#1a1a1a",color:"#fff",border:"none",padding:"6px 12px",borderRadius:6,fontSize:11,fontWeight:600}}>⇄ Switch</button>
          </div>
        </div>
        <div style={{display:"flex",borderTop:"1px solid #f0f0f0",paddingLeft:24,overflowX:"auto"}}>
          {["Home","Shop","Contact"].map(p=>(
            <button key={p} onClick={()=>go(p.toLowerCase())} style={{padding:"9px 14px",fontSize:12,color:page===p.toLowerCase()?"#C84B1F":"#555",borderBottom:page===p.toLowerCase()?"2px solid #C84B1F":"2px solid transparent",background:"none",border:"none",borderBottom:page===p.toLowerCase()?"2px solid #C84B1F":"2px solid transparent",fontWeight:500,whiteSpace:"nowrap"}}>{p}</button>
          ))}
          {["Bricks","Cement","Tiles","Paint","Lighting","Decor"].map(c=>(
            <button key={c} onClick={()=>go("shop")} style={{padding:"9px 14px",fontSize:11,color:"#666",background:"none",border:"none",borderBottom:"2px solid transparent",whiteSpace:"nowrap"}}>{c}</button>
          ))}
        </div>
      </nav>

      {page==="home" && <BHome prods={prods} go={go} addCart={addCart} toggleWish={toggleWish} wish={wish} setDetail={setDetail}/>}
      {page==="shop" && <BShop prods={prods} addCart={addCart} toggleWish={toggleWish} wish={wish} go={go} setDetail={setDetail}/>}
      {page==="detail" && detail && <BDetail p={detail} addCart={addCart} toggleWish={toggleWish} wish={wish} go={go} prods={prods} setDetail={setDetail}/>}
      {page==="cart" && <BCart cart={cart} setCart={setCart} go={go}/>}
      {page==="checkout" && <BCheckout cart={cart} setCart={setCart} go={go} addOrder={o=>setMyOrders(x=>[o,...x])}/>}
      {page==="orders" && <BOrders orders={myOrders} go={go}/>}
      {page==="login" && <BLogin go={go}/>}
      {page==="contact" && <BContact/>}

      <footer style={{background:"#1a1a1a",color:"#fff",marginTop:40,padding:"28px 24px 14px"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:24,marginBottom:20}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:8}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div>
            <p style={{fontSize:12,color:"#888",lineHeight:1.7}}>India's multi-vendor marketplace for architecture & interior materials. 340+ verified sellers.</p>
          </div>
          {[{t:"Shop",l:["Architecture","Interior","Home Decor","Deals"]},{t:"Help",l:["Track Order","Returns","Bulk Orders","Contact"]},{t:"Sellers",l:["Sell on ArchiMart","Seller Login","Commission Policy","Payouts"]}].map(col=>(
            <div key={col.t}><div style={{fontSize:13,fontWeight:700,marginBottom:10}}>{col.t}</div>{col.l.map(l=><div key={l} style={{fontSize:12,color:"#888",marginBottom:5,cursor:"pointer"}}>{l}</div>)}</div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #2a2a2a",paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:11,color:"#555"}}>© 2026 ArchiMart. Multi-Vendor Marketplace.</div>
          <div style={{display:"flex",gap:5}}>{["UPI","Visa","MC","EMI"].map(m=><span key={m} style={{background:"#2a2a2a",border:"1px solid #333",borderRadius:3,padding:"2px 7px",fontSize:10,color:"#777",fontWeight:600}}>{m}</span>)}</div>
        </div>
      </footer>
    </div>
  );
}

function PCard({p,addCart,toggleWish,isWished,go,setDetail}) {
  return (
    <div onClick={()=>{setDetail(p);go("detail");}} style={{background:"#fff",border:"1px solid #ebebeb",borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="#C84B1F";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="#ebebeb";e.currentTarget.style.transform="none";}}>
      <div style={{background:"#F9F4F1",height:148,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontSize:50}}>
        {p.icon}
        {p.disc>0&&<span style={{position:"absolute",top:8,left:8,background:"#C84B1F",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4}}>-{p.disc}%</span>}
        {p.badge&&<span style={{position:"absolute",bottom:8,left:8,background:"#1a1a1a",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:4}}>{p.badge}</span>}
        <button onClick={e=>{e.stopPropagation();toggleWish(p.id);}} style={{position:"absolute",top:6,right:8,background:"#fff",border:"1px solid #ebebeb",borderRadius:"50%",width:27,height:27,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:isWished?"#C84B1F":"#bbb"}}>{isWished?"♥":"♡"}</button>
      </div>
      <div style={{padding:"11px 13px",flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:10,color:"#999",fontWeight:500,textTransform:"uppercase",marginBottom:2}}>{p.brand} · <span style={{color:"#7C3AED"}}>{p.sn}</span></div>
        <div style={{fontSize:12,fontWeight:600,color:"#1a1a1a",marginBottom:5,lineHeight:1.3,flex:1}}>{p.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:5}}><Stars r={p.rating}/><span style={{fontSize:10,color:"#999"}}>({p.rev.toLocaleString()})</span></div>
        <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:8}}>
          <span style={{fontSize:16,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>₹{p.price.toLocaleString()}</span>
          <span style={{fontSize:11,color:"#bbb",textDecoration:"line-through"}}>₹{p.old}</span>
          <span style={{fontSize:10,color:"#2E9E5B",fontWeight:600}}>/{p.unit}</span>
        </div>
        <button onClick={e=>{e.stopPropagation();addCart(p);}} style={{background:"#C84B1F",color:"#fff",border:"none",width:"100%",padding:7,borderRadius:7,fontSize:11,fontWeight:600}}>🛒 Add to cart</button>
      </div>
    </div>
  );
}

function BHome({prods,go,addCart,toggleWish,wish,setDetail}) {
  return (
    <div style={{background:"#fff"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",background:"#FDF6F3",minHeight:380}}>
        <div style={{padding:"50px 40px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span style={{display:"inline-block",background:"#C84B1F",color:"#fff",fontSize:10,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",padding:"3px 10px",borderRadius:4,marginBottom:14}}>Multi-Vendor Marketplace</span>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:800,lineHeight:1.08,color:"#1a1a1a",marginBottom:12,letterSpacing:-1}}>Build & Design Your<br/><span style={{color:"#C84B1F"}}>Dream Home</span></h1>
          <p style={{fontSize:14,color:"#666",lineHeight:1.7,marginBottom:24,maxWidth:360}}>Shop from verified sellers across India — architecture materials, interior products & home décor in one place.</p>
          <div style={{display:"flex",gap:10,marginBottom:24}}>
            <Btn onClick={()=>go("shop")}>Shop Now</Btn>
            <Btn onClick={()=>go("shop")} outline>Browse Catalogue</Btn>
          </div>
          <div style={{display:"flex",gap:16}}>{["🚚 Free delivery ₹2,999+","✅ Verified sellers","🔄 Easy returns"].map(t=><span key={t} style={{fontSize:11,color:"#666"}}>{t}</span>)}</div>
        </div>
        <div style={{background:"#C84B1F",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#fff",borderRadius:14,width:"100%",padding:18,textAlign:"center"}}>
            <div style={{height:160,background:"#F5EFE9",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:64,marginBottom:10}}>🪟</div>
            <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>Kajaria Porcelain Marble Tiles</div>
            <span style={{fontSize:19,fontWeight:700,color:"#C84B1F",fontFamily:"'Playfair Display',serif"}}>₹68</span>
            <span style={{fontSize:11,color:"#999",textDecoration:"line-through",marginLeft:6}}>₹95/sq ft</span>
            <div style={{background:"#EDFAF3",color:"#2E9E5B",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:5,display:"inline-block",margin:"6px 0 8px",marginLeft:6}}>28% OFF</div>
            <button onClick={()=>addCart(prods[6])} style={{background:"#1a1a1a",color:"#fff",border:"none",width:"100%",padding:9,borderRadius:8,fontSize:12,fontWeight:600,display:"block"}}>🛒 Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700}}>Shop by category</h2>
          <button onClick={()=>go("shop")} style={{fontSize:12,color:"#C84B1F",fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>View all →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:8}}>
          {[{icon:"🧱",name:"Bricks"},{icon:"🏗️",name:"Cement"},{icon:"🪟",name:"Tiles"},{icon:"🎨",name:"Paint"},{icon:"💡",name:"Lighting"},{icon:"⚡",name:"Electrical"},{icon:"🚿",name:"Bathroom"},{icon:"🏮",name:"Home Decor"}].map(c=>(
            <div key={c.name} onClick={()=>go("shop")} style={{background:"#FDF6F3",borderRadius:10,padding:"12px 6px 9px",textAlign:"center",cursor:"pointer",border:"1.5px solid transparent",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#C84B1F";e.currentTarget.style.background="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background="#FDF6F3";}}>
              <div style={{fontSize:24,marginBottom:5}}>{c.icon}</div>
              <div style={{fontSize:10,fontWeight:600}}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits strip */}
      <div style={{margin:"22px 24px 0",background:"#1a1a1a",borderRadius:12,padding:"16px 22px",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        {[{icon:"🚚",t:"Free Delivery",s:"Orders above ₹2,999"},{icon:"✅",t:"Verified Sellers",s:"Admin approved only"},{icon:"🎧",t:"Expert Help",s:"Free architect helpline"}].map((o,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:`0 ${i===0?0:14}px`,borderRight:i<2?"1px solid #333":"none"}}>
            <div style={{width:38,height:38,borderRadius:9,background:"#C84B1F",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{o.icon}</div>
            <div><strong style={{display:"block",fontSize:12,color:"#fff",marginBottom:1}}>{o.t}</strong><span style={{fontSize:11,color:"#888"}}>{o.s}</span></div>
          </div>
        ))}
      </div>

      {/* Top deals */}
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700}}>Today's top deals</h2>
          <button onClick={()=>go("shop")} style={{fontSize:12,color:"#C84B1F",fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>See all →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {prods.slice(0,4).map(p=><PCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} isWished={wish.includes(p.id)} go={go} setDetail={setDetail}/>)}
        </div>
      </div>

      {/* Banners */}
      <div style={{margin:"24px 24px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{bg:"#2C3E50",tag:"Architecture",title:"Structure & Raw Materials",sub:"Cement, steel, bricks — upto 25% off",em:"🏗️"},{bg:"#5D4037",tag:"Interior & Home Decor",title:"Design Your Dream Space",sub:"Tiles, paint, lighting & décor",em:"🏮"}].map((b,i)=>(
          <div key={i} style={{background:b.bg,borderRadius:13,padding:"22px 22px",position:"relative",minHeight:130,display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-8,top:"50%",transform:"translateY(-50%)",fontSize:75,opacity:.1}}>{b.em}</div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(255,255,255,.5)",textTransform:"uppercase",marginBottom:4}}>{b.tag}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:5}}>{b.title}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:10}}>{b.sub}</div>
            <button onClick={()=>go("shop")} style={{background:"#fff",border:"none",color:"#1a1a1a",fontSize:11,fontWeight:700,padding:"6px 14px",borderRadius:5,width:"fit-content",cursor:"pointer"}}>Shop Now</button>
          </div>
        ))}
      </div>

      {/* More products */}
      <div style={{padding:"24px 24px 0"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:14}}>Interior & Home Decor</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {prods.filter(p=>p.sub==="decor").slice(0,4).map(p=><PCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} isWished={wish.includes(p.id)} go={go} setDetail={setDetail}/>)}
        </div>
      </div>
      <div style={{padding:"24px 24px"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:14}}>More from sellers</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {prods.slice(4,8).map(p=><PCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} isWished={wish.includes(p.id)} go={go} setDetail={setDetail}/>)}
        </div>
      </div>
    </div>
  );
}

function BShop({prods,addCart,toggleWish,wish,go,setDetail}) {
  const [cat,setCat] = useState("All");
  const [sub,setSub] = useState("All");
  const [sort,setSort] = useState("popular");
  const [q,setQ] = useState("");
  let list = prods.filter(p=>{
    if(cat!=="All"&&p.cat!==cat) return false;
    if(sub!=="All"&&p.sub!==sub) return false;
    if(q&&!p.name.toLowerCase().includes(q.toLowerCase())&&!p.brand.toLowerCase().includes(q.toLowerCase())&&!p.sn.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  if(sort==="low") list=[...list].sort((a,b)=>a.price-b.price);
  else if(sort==="high") list=[...list].sort((a,b)=>b.price-a.price);
  else if(sort==="rating") list=[...list].sort((a,b)=>b.rating-a.rating);
  else if(sort==="disc") list=[...list].sort((a,b)=>b.disc-a.disc);
  return (
    <div style={{display:"grid",gridTemplateColumns:"210px 1fr",minHeight:"80vh"}}>
      <div style={{borderRight:"1px solid #e8e8e8",padding:"18px 14px",background:"#fafafa"}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Filters</h3>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search product/brand..." style={{width:"100%",border:"1px solid #e0e0e0",borderRadius:6,padding:"7px 9px",fontSize:12,outline:"none",marginBottom:16}}/>
        <div style={{fontSize:10,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:.5,marginBottom:7}}>Type</div>
        {["All","arch","interior","decor"].map(s=>(
          <div key={s} onClick={()=>setSub(s)} style={{padding:"5px 9px",borderRadius:5,cursor:"pointer",fontSize:12,fontWeight:sub===s?600:400,color:sub===s?"#C84B1F":"#555",background:sub===s?"#FDF6F3":"transparent",marginBottom:1,textTransform:"capitalize"}}>{s==="All"?"All Types":s==="arch"?"Architecture":s}</div>
        ))}
        <div style={{fontSize:10,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:.5,marginBottom:7,marginTop:14}}>Categories</div>
        {CATS.map(c=>(
          <div key={c} onClick={()=>setCat(c)} style={{padding:"4px 9px",borderRadius:5,cursor:"pointer",fontSize:11,fontWeight:cat===c?600:400,color:cat===c?"#C84B1F":"#555",background:cat===c?"#FDF6F3":"transparent",marginBottom:1}}>{c}</div>
        ))}
      </div>
      <div style={{padding:"20px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:"#666"}}>Showing <strong style={{color:"#1a1a1a"}}>{list.length}</strong> products</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:12,color:"#666"}}>Sort:</span>
            <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:"1px solid #e0e0e0",borderRadius:6,padding:"5px 9px",fontSize:12,outline:"none"}}>
              <option value="popular">Popular</option><option value="low">Price ↑</option><option value="high">Price ↓</option><option value="rating">Top Rated</option><option value="disc">Best Discount</option>
            </select>
          </div>
        </div>
        {list.length===0?<div style={{textAlign:"center",padding:"60px 0",color:"#999"}}><div style={{fontSize:44,marginBottom:10}}>🔍</div><div style={{fontWeight:600}}>No products found</div></div>:
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {list.map(p=><PCard key={p.id} p={p} addCart={addCart} toggleWish={toggleWish} isWished={wish.includes(p.id)} go={go} setDetail={setDetail}/>)}
          </div>}
      </div>
    </div>
  );
}

function BDetail({p,addCart,toggleWish,wish,go,prods,setDetail}) {
  const [qty,setQty] = useState(1);
  const [tab,setTab] = useState("desc");

  // ── Smart calc states ──────────────────────────────────────────────────────
  const [roomL,setRoomL] = useState("");
  const [roomW,setRoomW] = useState("");
  const [roomSqft,setRoomSqft] = useState("");
  const [lengthNeeded,setLengthNeeded] = useState(""); // for pipe/wire length input
  const [waste,setWaste] = useState(10);
  const [coverage,setCoverage] = useState("");         // for paint sqft

  const related = prods.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,3);

  // ── Calculation logic ──────────────────────────────────────────────────────
  const calcType = p.calcType || "fixed";

  // TILE mode
  const tileSqft = (roomL&&roomW) ? parseFloat(roomL)*parseFloat(roomW) : parseFloat(roomSqft)||0;
  const tileWithWaste = tileSqft>0 ? tileSqft*(1+waste/100) : 0;
  const packsNeeded = (calcType==="tile"&&tileWithWaste>0) ? Math.ceil(tileWithWaste/p.packSqft) : 0;
  const totalTileSqft = packsNeeded*p.packSqft;
  const totalTilePrice = packsNeeded*(p.packPrice||p.price*p.packSqft);

  // LENGTH mode (pipe sold per piece of fixed metres)
  const mtrNeeded = parseFloat(lengthNeeded)||0;
  const piecesNeeded = (calcType==="length"&&mtrNeeded>0) ? Math.ceil(mtrNeeded/p.metresPerUnit) : 0;
  const totalLengthPrice = piecesNeeded*p.price;

  // COVERAGE mode (paint)
  const paintSqft = parseFloat(coverage)||0;
  const litresNeeded = (calcType==="coverage"&&paintSqft>0) ? paintSqft/p.coveragePerLitre : 0;
  const cansNeeded = litresNeeded>0 ? Math.ceil(litresNeeded/p.litresPerPack) : 0;
  const totalPaintPrice = cansNeeded*p.packPrice;

  // Final cart values
  const finalQty = calcType==="tile"&&packsNeeded>0 ? packsNeeded
                 : calcType==="length"&&piecesNeeded>0 ? piecesNeeded
                 : calcType==="coverage"&&cansNeeded>0 ? cansNeeded
                 : qty;
  const finalPrice = calcType==="tile"&&packsNeeded>0 ? totalTilePrice
                   : calcType==="length"&&piecesNeeded>0 ? totalLengthPrice
                   : calcType==="coverage"&&cansNeeded>0 ? totalPaintPrice
                   : p.price*qty;

  const smartCalcActive = (calcType==="tile"&&packsNeeded>0)
                        ||(calcType==="length"&&piecesNeeded>0)
                        ||(calcType==="coverage"&&cansNeeded>0);

  const cartMeta = {
    ...(calcType==="tile"&&packsNeeded>0 ? {packsNeeded,tileSqft:tileWithWaste,tilesPerPack:p.tilesPerPack} : {}),
    ...(calcType==="length"&&piecesNeeded>0 ? {piecesNeeded,lengthNeeded:mtrNeeded,metresPerUnit:p.metresPerUnit} : {}),
    ...(calcType==="coverage"&&cansNeeded>0 ? {cansNeeded,paintSqft,litresNeeded:litresNeeded.toFixed(1)} : {}),
  };

  return (
    <div style={{maxWidth:1020,margin:"0 auto",padding:"32px 24px"}}>
      <div style={{fontSize:12,color:"#999",marginBottom:18}}>
        <span onClick={()=>go("home")} style={{cursor:"pointer",color:"#C84B1F"}}>Home</span> / <span onClick={()=>go("shop")} style={{cursor:"pointer",color:"#C84B1F"}}>Shop</span> / {p.name}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,marginBottom:40}}>
        {/* Left: image */}
        <div>
          <div style={{background:"#F9F4F1",borderRadius:14,height:340,display:"flex",alignItems:"center",justifyContent:"center",fontSize:96,marginBottom:12,border:"1px solid #f0e8e4"}}>{p.icon}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7}}>
            {[0,1,2,3].map(i=><div key={i} style={{background:"#F9F4F1",borderRadius:8,height:58,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:i===0?"2px solid #C84B1F":"1px solid #f0e8e4",cursor:"pointer"}}>{p.icon}</div>)}
          </div>
        </div>

        {/* Right: info + calculator */}
        <div>
          <div style={{display:"flex",gap:5,marginBottom:9,flexWrap:"wrap"}}>
            {p.badge&&<Bdg label={p.badge} color="#C84B1F"/>}
            <Bdg label="In Stock" color="#10B981"/>
            <Bdg label={"Sold by: "+p.sn} color="#7C3AED"/>
            {calcType!=="fixed"&&<Bdg label="Smart Calculator" color="#0369A1"/>}
          </div>
          <div style={{fontSize:10,color:"#999",textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>{p.brand} · {p.cat}</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#1a1a1a",marginBottom:9,lineHeight:1.2}}>{p.name}</h1>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
            <Stars r={p.rating}/><span style={{fontSize:12,fontWeight:600}}>{p.rating}</span>
            <span style={{fontSize:11,color:"#999"}}>({p.rev.toLocaleString()} reviews)</span>
          </div>
          {p.packLabel&&<div style={{fontSize:11,color:"#7C3AED",fontWeight:600,marginBottom:6}}>📦 {p.packLabel}</div>}
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
            <span style={{fontSize:30,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>₹{p.price.toLocaleString()}</span>
            <span style={{fontSize:14,color:"#bbb",textDecoration:"line-through"}}>₹{p.old}</span>
            <span style={{fontSize:11,color:"#fff",background:"#C84B1F",padding:"2px 6px",borderRadius:4,fontWeight:700}}>-{p.disc}%</span>
            <span style={{fontSize:11,color:"#888"}}>/{p.unit}</span>
          </div>
          <div style={{fontSize:12,color:"#2E9E5B",fontWeight:600,marginBottom:12}}>Save ₹{p.old-p.price} per {p.unit}</div>
          {p.hint&&<div style={{fontSize:11,color:"#6B7280",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:6,padding:"6px 10px",marginBottom:12}}>💡 {p.hint}</div>}

          {/* ══ TILE CALCULATOR ════════════════════════════════════════════ */}
          {calcType==="tile"&&(
            <div style={{background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#4338CA",marginBottom:8}}>📐 Area → Pack Calculator</div>
              <div style={{fontSize:11,color:"#6B7280",marginBottom:10}}>
                Each tile: <strong>{p.tileW}ft × {p.tileH}ft</strong> = {(p.tileW*p.tileH).toFixed(2)} sq ft &nbsp;|&nbsp;
                <strong>{p.tilesPerPack} tiles/box = {p.packSqft} sq ft/box</strong> &nbsp;|&nbsp;
                Box price: <strong>₹{(p.packPrice||p.price*p.packSqft).toLocaleString()}</strong>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Room Length (ft)</div>
                  <input type="number" value={roomL} onChange={e=>{setRoomL(e.target.value);setRoomSqft("");}} placeholder="e.g. 14" style={{width:"100%",border:"1px solid #C7D2FE",borderRadius:6,padding:"7px 9px",fontSize:13,outline:"none",background:"#fff"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Room Width (ft)</div>
                  <input type="number" value={roomW} onChange={e=>{setRoomW(e.target.value);setRoomSqft("");}} placeholder="e.g. 12" style={{width:"100%",border:"1px solid #C7D2FE",borderRadius:6,padding:"7px 9px",fontSize:13,outline:"none",background:"#fff"}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>OR total area (sq ft)</div>
                  <input type="number" value={roomSqft} onChange={e=>{setRoomSqft(e.target.value);setRoomL("");setRoomW("");}} placeholder="e.g. 168" style={{width:"100%",border:"1px solid #C7D2FE",borderRadius:6,padding:"7px 9px",fontSize:13,outline:"none",background:"#fff"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Wastage/Breakage</div>
                  <select value={waste} onChange={e=>setWaste(+e.target.value)} style={{width:"100%",border:"1px solid #C7D2FE",borderRadius:6,padding:"7px 9px",fontSize:13,outline:"none",background:"#fff"}}>
                    {[5,10,15,20].map(w=><option key={w} value={w}>{w}% wastage</option>)}
                  </select>
                </div>
              </div>
              {tileWithWaste>0&&(
                <div style={{background:"#fff",borderRadius:8,padding:"10px 12px",border:"1px solid #C7D2FE"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,marginBottom:8}}>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#F5F3FF",borderRadius:6}}>
                      <div style={{color:"#7C3AED",fontWeight:700,fontSize:13}}>{tileSqft.toFixed(1)} sq ft</div>
                      <div style={{color:"#888",marginTop:1}}>Room area</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#FEF3C7",borderRadius:6}}>
                      <div style={{color:"#D97706",fontWeight:700,fontSize:13}}>{tileWithWaste.toFixed(1)} sq ft</div>
                      <div style={{color:"#888",marginTop:1}}>+{waste}% waste</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#EDFAF3",borderRadius:6}}>
                      <div style={{color:"#10B981",fontWeight:700,fontSize:14}}>{packsNeeded} Boxes</div>
                      <div style={{color:"#888",marginTop:1}}>= {totalTileSqft} sq ft</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:"1px dashed #e0e0e0",fontSize:12}}>
                    <span style={{color:"#666"}}>{packsNeeded} boxes × {p.tilesPerPack} tiles × {p.tileW}×{p.tileH}ft = {totalTileSqft} sq ft covered</span>
                    <span style={{fontWeight:800,color:"#C84B1F",fontSize:16,fontFamily:"'Playfair Display',serif"}}>₹{totalTilePrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ LENGTH CALCULATOR (pipe, wire sold per piece of N metres) ══ */}
          {calcType==="length"&&(
            <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#065F46",marginBottom:8}}>📏 Length → Pieces Calculator</div>
              <div style={{fontSize:11,color:"#6B7280",marginBottom:8}}>
                Each piece = <strong>{p.metresPerUnit}m</strong> &nbsp;|&nbsp; Rate: ₹{p.pricePerMetre}/m &nbsp;|&nbsp; Piece price: <strong>₹{p.price}</strong>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Total length needed (metres)</div>
                <input type="number" value={lengthNeeded} onChange={e=>setLengthNeeded(e.target.value)} placeholder="e.g. 25 metres total" style={{width:"100%",border:"1px solid #BBF7D0",borderRadius:6,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}/>
              </div>
              {piecesNeeded>0&&(
                <div style={{marginTop:9,background:"#fff",borderRadius:8,padding:"10px 12px",border:"1px solid #BBF7D0"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,marginBottom:6}}>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#F0FDF4",borderRadius:6}}>
                      <div style={{color:"#10B981",fontWeight:700,fontSize:13}}>{mtrNeeded}m</div>
                      <div style={{color:"#888",marginTop:1}}>Length needed</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#EEF2FF",borderRadius:6}}>
                      <div style={{color:"#7C3AED",fontWeight:700,fontSize:14}}>{piecesNeeded} pieces</div>
                      <div style={{color:"#888",marginTop:1}}>× {p.metresPerUnit}m each</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#FEF3C7",borderRadius:6}}>
                      <div style={{color:"#D97706",fontWeight:700,fontSize:13}}>{piecesNeeded*p.metresPerUnit}m</div>
                      <div style={{color:"#888",marginTop:1}}>total supplied</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:"1px dashed #e0e0e0",fontSize:12}}>
                    <span style={{color:"#666"}}>{piecesNeeded} × ₹{p.price} = total</span>
                    <span style={{fontWeight:800,color:"#C84B1F",fontSize:16,fontFamily:"'Playfair Display',serif"}}>₹{totalLengthPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ COVERAGE CALCULATOR (paint) ════════════════════════════════ */}
          {calcType==="coverage"&&(
            <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:8}}>🎨 Wall Area → Paint Calculator</div>
              <div style={{fontSize:11,color:"#6B7280",marginBottom:8}}>
                Coverage: <strong>{p.coveragePerLitre} sq ft/litre</strong> (2 coats) &nbsp;|&nbsp; 1 can = {p.litresPerPack}L = ~{p.coveragePerLitre*p.litresPerPack} sq ft
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Total wall/ceiling area (sq ft)</div>
                <input type="number" value={coverage} onChange={e=>setCoverage(e.target.value)} placeholder="e.g. 800 sq ft" style={{width:"100%",border:"1px solid #FED7AA",borderRadius:6,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}/>
              </div>
              {cansNeeded>0&&(
                <div style={{marginTop:9,background:"#fff",borderRadius:8,padding:"10px 12px",border:"1px solid #FED7AA"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,marginBottom:6}}>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#FFF7ED",borderRadius:6}}>
                      <div style={{color:"#D97706",fontWeight:700,fontSize:13}}>{paintSqft} sq ft</div>
                      <div style={{color:"#888",marginTop:1}}>Area to paint</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#F5F3FF",borderRadius:6}}>
                      <div style={{color:"#7C3AED",fontWeight:700,fontSize:13}}>{litresNeeded.toFixed(1)}L</div>
                      <div style={{color:"#888",marginTop:1}}>litres needed</div>
                    </div>
                    <div style={{textAlign:"center",padding:"6px 4px",background:"#EDFAF3",borderRadius:6}}>
                      <div style={{color:"#10B981",fontWeight:700,fontSize:14}}>{cansNeeded} can{cansNeeded>1?"s":""}</div>
                      <div style={{color:"#888",marginTop:1}}>= {cansNeeded*p.litresPerPack}L</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:"1px dashed #e0e0e0",fontSize:12}}>
                    <span style={{color:"#666"}}>{cansNeeded} × ₹{p.packPrice.toLocaleString()} ({p.litresPerPack}L can)</span>
                    <span style={{fontWeight:800,color:"#C84B1F",fontSize:16,fontFamily:"'Playfair Display',serif"}}>₹{totalPaintPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ FIXED QTY (unit/bag/kg/roll etc.) ══════════════════════════ */}
          {calcType==="fixed"&&(
            <>
              <div style={{background:"#FDF6F3",borderRadius:7,padding:"9px 12px",marginBottom:12,fontSize:11}}>🚚 Free delivery on orders ₹2,999+ &nbsp;|&nbsp; 🔄 10-day easy returns</div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:600}}>Qty ({p.unit})</span>
                <div style={{display:"flex",alignItems:"center",border:"1px solid #e0e0e0",borderRadius:7,overflow:"hidden"}}>
                  <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:32,height:32,border:"none",background:"#f5f5f5",fontSize:16}}>−</button>
                  <span style={{width:36,textAlign:"center",fontSize:13,fontWeight:600}}>{qty}</span>
                  <button onClick={()=>setQty(qty+1)} style={{width:32,height:32,border:"none",background:"#f5f5f5",fontSize:16}}>+</button>
                </div>
                <span style={{fontSize:12,color:"#666"}}>= <strong>₹{(p.price*qty).toLocaleString()}</strong></span>
              </div>
            </>
          )}

          {/* ── CTA Buttons ── */}
          {calcType!=="fixed"&&<div style={{background:"#FDF6F3",borderRadius:7,padding:"7px 10px",marginBottom:10,fontSize:11}}>🚚 Free delivery on orders ₹2,999+ &nbsp;|&nbsp; 🔄 10-day easy returns</div>}
          {calcType!=="fixed"&&!smartCalcActive&&<div style={{fontSize:11,color:"#F59E0B",fontWeight:500,marginBottom:10}}>⚠️ Enter dimensions above to auto-calculate quantity & price</div>}

          <div style={{display:"flex",gap:9,marginBottom:9}}>
            <Btn full onClick={()=>{addCart({...p,qty:finalQty,...cartMeta});go("cart");}}>
              Buy Now {smartCalcActive?"— ₹"+finalPrice.toLocaleString():""}
            </Btn>
            <Btn full onClick={()=>addCart({...p,qty:finalQty,...cartMeta})} color="#1a1a1a">
              🛒 Add to Cart
            </Btn>
          </div>
          <Btn full outline onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?"♥ Saved to Wishlist":"♡ Save to Wishlist"}</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:"1px solid #e8e8e8",display:"flex",marginBottom:18}}>
        {["desc","specs","reviews"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 20px",border:"none",borderBottom:tab===t?"2px solid #C84B1F":"2px solid transparent",background:"none",fontSize:13,fontWeight:tab===t?600:400,color:tab===t?"#C84B1F":"#666",cursor:"pointer"}}>{t==="desc"?"Description":t==="specs"?"Specifications":"Reviews"}</button>
        ))}
      </div>
      {tab==="desc"&&<p style={{fontSize:14,color:"#555",lineHeight:1.8,maxWidth:600}}>{p.desc}</p>}
      {tab==="specs"&&(
        <table style={{borderCollapse:"collapse",fontSize:13,maxWidth:460}}>
          {[
            ["Brand",p.brand],["Seller",p.sn],["Category",p.cat],
            ["Sold as",p.unit],["Stock",p.stock+" available"],
            ...(p.packLabel?[["Pack info",p.packLabel]]:[]),
            ["Rating",p.rating+" / 5"]
          ].map(([k,v])=>(
            <tr key={k} style={{borderBottom:"1px solid #f0f0f0"}}>
              <td style={{padding:"8px 14px",fontWeight:600,color:"#666",width:150}}>{k}</td>
              <td style={{padding:"8px 14px"}}>{v}</td>
            </tr>
          ))}
        </table>
      )}
      {tab==="reviews"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:600}}>
          {[{n:"Rajesh S.",l:"Bhopal",t:"Excellent quality, delivered on time.",r:5},{n:"Priya K.",l:"Indore",t:"Good value, matches description perfectly.",r:4},{n:"Arjun M.",l:"Pune",t:"Genuine product. Smart calculator helped a lot!",r:5}].map((r,i)=>(
            <div key={i} style={{background:"#FDF6F3",borderRadius:10,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#C84B1F",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>{r.n[0]}</div>
                <div><div style={{fontSize:12,fontWeight:600}}>{r.n}</div><div style={{fontSize:10,color:"#999"}}>{r.l}</div></div>
                <div style={{marginLeft:"auto"}}><Stars r={r.r}/></div>
              </div>
              <p style={{fontSize:12,color:"#555"}}>{r.t}</p>
            </div>
          ))}
        </div>
      )}
      {related.length>0&&(
        <div style={{marginTop:36}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,marginBottom:14}}>Related products</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {related.map(x=><PCard key={x.id} p={x} addCart={addCart} toggleWish={toggleWish} isWished={wish.includes(x.id)} go={go} setDetail={setDetail}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

function BCart({cart,setCart,go}) {
  const upd=(id,q)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:q}:i));
  const rem=id=>setCart(c=>c.filter(i=>i.id!==id));
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const del=sub>=2999?0:149;
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"32px 24px"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,marginBottom:22}}>Your Cart {cart.length>0&&<span style={{fontSize:13,color:"#999",fontWeight:400}}>({cart.reduce((s,i)=>s+i.qty,0)} items)</span>}</h1>
      {cart.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:56,marginBottom:14}}>🛒</div><h2 style={{fontSize:18,fontWeight:700,marginBottom:10}}>Cart is empty</h2><Btn onClick={()=>go("shop")}>Continue Shopping</Btn></div>:(
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24}}>
          <div>
            {cart.map(item=>(
              <div key={item.id} style={{display:"flex",gap:12,padding:"16px 0",borderBottom:"1px solid #f0f0f0",alignItems:"center"}}>
                <div style={{width:66,height:66,background:"#F9F4F1",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:"#999",textTransform:"uppercase",marginBottom:1}}>{item.brand} · {item.sn}</div>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{item.name}</div>
                  {item.packsNeeded?(
                    <div style={{fontSize:11,color:"#7C3AED",fontWeight:500}}>
                      📦 {item.packsNeeded} boxes × {item.tilesPerPack} tiles — covers {item.tileSqft?.toFixed(0)} sq ft (incl. wastage)
                    </div>
                  ):item.piecesNeeded?(
                    <div style={{fontSize:11,color:"#10B981",fontWeight:500}}>
                      📏 {item.piecesNeeded} pieces × {item.metresPerUnit}m = {item.piecesNeeded*item.metresPerUnit}m total
                    </div>
                  ):item.cansNeeded?(
                    <div style={{fontSize:11,color:"#D97706",fontWeight:500}}>
                      🎨 {item.cansNeeded} can{item.cansNeeded>1?"s":""} — covers {item.paintSqft} sq ft ({item.litresNeeded}L needed)
                    </div>
                  ):(
                    <div style={{fontSize:11,color:"#2E9E5B"}}>₹{item.price.toLocaleString()}/{item.unit}</div>
                  )}
                </div>
                <div style={{display:"flex",alignItems:"center",border:"1px solid #e0e0e0",borderRadius:6,overflow:"hidden"}}>
                  <button onClick={()=>item.qty>1&&upd(item.id,item.qty-1)} style={{width:28,height:28,border:"none",background:"#f5f5f5",fontSize:14}}>−</button>
                  <span style={{width:30,textAlign:"center",fontSize:12,fontWeight:600}}>{item.qty}</span>
                  <button onClick={()=>upd(item.id,item.qty+1)} style={{width:28,height:28,border:"none",background:"#f5f5f5",fontSize:14}}>+</button>
                </div>
                <div style={{width:75,textAlign:"right",fontSize:14,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>₹{(item.price*item.qty).toLocaleString()}</div>
                <button onClick={()=>rem(item.id)} style={{background:"none",border:"none",color:"#bbb",fontSize:17}}>✕</button>
              </div>
            ))}
            <button onClick={()=>go("shop")} style={{marginTop:12,background:"none",border:"1.5px solid #e0e0e0",color:"#444",padding:"7px 16px",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer"}}>← Continue Shopping</button>
          </div>
          <Card style={{padding:18,height:"fit-content"}}>
            <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>Order Summary</h3>
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12,fontSize:12}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666"}}>Subtotal</span><span>₹{sub.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666"}}>Delivery</span><span style={{color:del===0?"#2E9E5B":"#1a1a1a"}}>{del===0?"FREE":"₹"+del}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666"}}>You save</span><span style={{color:"#C84B1F"}}>-₹{cart.reduce((s,i)=>s+(i.old-i.price)*i.qty,0).toLocaleString()}</span></div>
            </div>
            <div style={{borderTop:"1px solid #e8e8e8",paddingTop:10,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700}}><span>Total</span><span>₹{(sub+del).toLocaleString()}</span></div>
            </div>
            <Btn full onClick={()=>go("checkout")}>Proceed to Checkout →</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

function BCheckout({cart,setCart,go,addOrder}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",phone:"",address:"",city:"",pin:"",payment:"upi"});
  const [done,setDone]=useState(false);
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const total=sub+(sub>=2999?0:149);
  const place=()=>{addOrder({id:"ORD"+Date.now().toString().slice(-6),items:[...cart],total,date:new Date().toLocaleDateString("en-IN"),status:"Confirmed",address:form.city,payment:form.payment});setCart([]);setDone(true);};
  if(done) return <div style={{maxWidth:460,margin:"60px auto",textAlign:"center",padding:"0 24px"}}><div style={{fontSize:58,marginBottom:14}}>🎉</div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:800,marginBottom:9,color:"#2E9E5B"}}>Order Placed!</h1><p style={{color:"#666",lineHeight:1.7,marginBottom:22}}>Confirmation sent to {form.email||"your email"}.</p><div style={{display:"flex",gap:10,justifyContent:"center"}}><Btn onClick={()=>go("orders")}>View Orders</Btn><Btn onClick={()=>go("home")} outline>Continue Shopping</Btn></div></div>;
  const f=(k,ph,type="text")=><input type={type} placeholder={ph} value={form[k]} onChange={e=>setForm(x=>({...x,[k]:e.target.value}))} style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"9px 12px",fontSize:13,outline:"none",width:"100%"}}/>;
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,marginBottom:22}}>Checkout</h1>
      <div style={{display:"flex",gap:6,marginBottom:24,alignItems:"center"}}>
        {["Delivery Details","Payment"].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:step>i+1?"#2E9E5B":step===i+1?"#C84B1F":"#e0e0e0",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{step>i+1?"✓":i+1}</div>
            <span style={{fontSize:12,fontWeight:step===i+1?600:400,color:step===i+1?"#C84B1F":"#999"}}>{s}</span>
            {i<1&&<div style={{width:26,height:1,background:"#e0e0e0",margin:"0 5px"}}/>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:24}}>
        <div>
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{f("name","Full name")}{f("phone","Phone","tel")}</div>
              {f("email","Email address","email")}
              {f("address","Complete address")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{f("city","City")}{f("pin","PIN code")}</div>
              <Btn disabled={!form.name||!form.phone||!form.address} onClick={()=>setStep(2)}>Continue to Payment →</Btn>
            </div>
          )}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <h3 style={{fontSize:14,fontWeight:700}}>Payment method</h3>
              {[{k:"upi",l:"UPI / QR Code",i:"📱",s:"Google Pay, PhonePe, Paytm"},{k:"card",l:"Credit / Debit Card",i:"💳",s:"Visa, Mastercard, Rupay"},{k:"netbank",l:"Net Banking",i:"🏦",s:"All major banks"},{k:"cod",l:"Cash on Delivery",i:"💵",s:"Pay when delivered"}].map(m=>(
                <div key={m.k} onClick={()=>setForm(x=>({...x,payment:m.k}))} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",border:form.payment===m.k?"2px solid #C84B1F":"1px solid #e0e0e0",borderRadius:9,cursor:"pointer",background:form.payment===m.k?"#FDF6F3":"#fff"}}>
                  <span style={{fontSize:22}}>{m.i}</span>
                  <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{m.l}</div><div style={{fontSize:11,color:"#999"}}>{m.s}</div></div>
                  <div style={{width:16,height:16,borderRadius:"50%",border:"2px solid "+(form.payment===m.k?"#C84B1F":"#ddd"),background:form.payment===m.k?"#C84B1F":"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{form.payment===m.k&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}</div>
                </div>
              ))}
              <div style={{display:"flex",gap:9}}><Btn outline onClick={()=>setStep(1)}>← Back</Btn><Btn full onClick={place}>Place Order — ₹{total.toLocaleString()}</Btn></div>
            </div>
          )}
        </div>
        <Card style={{padding:16,height:"fit-content"}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:11}}>Summary</h3>
          <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:170,overflowY:"auto",marginBottom:11}}>
            {cart.map(i=><div key={i.id} style={{display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:17}}>{i.icon}</span><div style={{flex:1,fontSize:11,lineHeight:1.3}}>{i.name} ×{i.qty}</div><span style={{fontSize:11,fontWeight:600}}>₹{(i.price*i.qty).toLocaleString()}</span></div>)}
          </div>
          <div style={{borderTop:"1px solid #e8e8e8",paddingTop:9,fontSize:12,display:"flex",flexDirection:"column",gap:5}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666"}}>Subtotal</span><span>₹{sub.toLocaleString()}</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#666"}}>Delivery</span><span style={{color:"#2E9E5B"}}>{sub>=2999?"FREE":"₹149"}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,marginTop:3}}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function BOrders({orders,go}) {
  return (
    <div style={{maxWidth:820,margin:"0 auto",padding:"32px 24px"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:800,marginBottom:22}}>My Orders</h1>
      {orders.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:50,marginBottom:12}}>📦</div><h2 style={{fontSize:17,fontWeight:700,marginBottom:10}}>No orders yet</h2><Btn onClick={()=>go("shop")}>Start Shopping</Btn></div>:orders.map(o=>(
        <Card key={o.id} style={{marginBottom:12,overflow:"hidden"}}>
          <div style={{background:"#f9f9f9",padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e8e8e8"}}>
            <div style={{display:"flex",gap:18}}>
              {[["ORDER ID","#"+o.id],["DATE",o.date],["TOTAL","₹"+o.total.toLocaleString()],["PAYMENT",o.payment]].map(([k,v])=><div key={k}><div style={{fontSize:9,color:"#999"}}>{k}</div><div style={{fontWeight:700,fontSize:12,color:k==="ORDER ID"?"#C84B1F":"#1a1a1a"}}>{v}</div></div>)}
            </div>
            <Bdg label={o.status} color="#10B981"/>
          </div>
          <div style={{padding:"12px 16px"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {o.items.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#F9F4F1",borderRadius:6,padding:"5px 9px",fontSize:11}}><span style={{fontSize:15}}>{item.icon}</span>{item.name} ×{item.qty}</div>)}
            </div>
            <div style={{display:"flex",gap:7}}>
              {["📄 Invoice","🔄 Reorder","📦 Track"].map(b=><button key={b} style={{background:"none",border:"1px solid #e0e0e0",color:b.includes("Track")?"#C84B1F":"#444",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>{b}</button>)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function BLogin({go}) {
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"",phone:"",password:""});
  const f=(k,ph,type="text")=><input type={type} placeholder={ph} value={form[k]} onChange={e=>setForm(x=>({...x,[k]:e.target.value}))} style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",width:"100%"}}/>;
  return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"#FDF6F3"}}>
      <Card style={{padding:"32px 32px",width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div><p style={{color:"#999",fontSize:12,marginTop:3}}>{mode==="login"?"Welcome back!":"Create your account"}</p></div>
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:8,padding:3,marginBottom:18}}>
          {["login","register"].map(m=><button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"7px 0",border:"none",borderRadius:6,background:mode===m?"#fff":"transparent",fontSize:12,fontWeight:mode===m?600:400,color:mode===m?"#C84B1F":"#666",cursor:"pointer"}}>{m==="login"?"Sign In":"Register"}</button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          {mode==="register"&&f("name","Full name")}
          {f("email","Email address","email")}
          {mode==="register"&&f("phone","Phone number","tel")}
          {f("password","Password","password")}
          {mode==="login"&&<div style={{textAlign:"right"}}><span style={{fontSize:11,color:"#C84B1F",cursor:"pointer"}}>Forgot password?</span></div>}
          <Btn full onClick={()=>go("home")}>{mode==="login"?"Sign In":"Create Account"}</Btn>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {["🇬 Google","📱 OTP"].map(b=><button key={b} onClick={()=>go("home")} style={{border:"1px solid #e0e0e0",background:"#fff",padding:"9px 0",borderRadius:7,fontSize:12,fontWeight:600,color:"#444",cursor:"pointer"}}>{b}</button>)}
          </div>
        </div>
      </Card>
    </div>
  );
}

function BContact() {
  const [sent,setSent]=useState(false);
  const [form,setForm]=useState({name:"",email:"",phone:"",subject:"",message:""});
  if(sent) return <div style={{maxWidth:460,margin:"60px auto",textAlign:"center",padding:"0 24px"}}><div style={{fontSize:50,marginBottom:12}}>📬</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#2E9E5B",marginBottom:9}}>Message Sent!</h2><p style={{color:"#666"}}>We'll get back to you within 24 hours.</p></div>;
  const f=(k,ph,type="text")=><input type={type} placeholder={ph} value={form[k]} onChange={e=>setForm(x=>({...x,[k]:e.target.value}))} style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",width:"100%"}}/>;
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"40px 24px"}}>
      <div style={{textAlign:"center",marginBottom:36}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:800,marginBottom:9}}>Contact Us</h1><p style={{color:"#666"}}>Reach out for queries, bulk orders, or expert advice.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40}}>
        <div>
          {[{icon:"📍",title:"Office",lines:["ArchiMart HQ, DB City Mall Road","Bhopal, MP — 462016"]},{icon:"📞",title:"Phone",lines:["+91 98765 43210","Mon–Sat, 9am–7pm"]},{icon:"📧",title:"Email",lines:["hello@archimart.in","support@archimart.in"]}].map(c=>(
            <div key={c.title} style={{display:"flex",gap:12,marginBottom:20}}>
              <div style={{width:42,height:42,borderRadius:10,background:"#FDF6F3",border:"1px solid #f0e8e4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{c.icon}</div>
              <div><div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{c.title}</div>{c.lines.map(l=><div key={l} style={{fontSize:12,color:"#666"}}>{l}</div>)}</div>
            </div>
          ))}
        </div>
        <Card style={{padding:24}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,marginBottom:16}}>Send a message</h3>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{f("name","Name")}{f("phone","Phone","tel")}</div>
            {f("email","Email","email")}
            <select value={form.subject} onChange={e=>setForm(x=>({...x,subject:e.target.value}))} style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none"}}><option value="">Select subject</option><option>Bulk order</option><option>Product query</option><option>Delivery issue</option><option>Return/Refund</option></select>
            <textarea value={form.message} onChange={e=>setForm(x=>({...x,message:e.target.value}))} placeholder="Your message..." rows={3} style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",resize:"vertical"}}/>
            <Btn full onClick={()=>setSent(true)}>Send Message 📤</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  SELLER PORTAL
// ══════════════════════════════════════════════════════════════════════
function SellerPortal({onSwitch}) {
  const [loggedIn,setLoggedIn]=useState(false);
  const [isNew,setIsNew]=useState(false);
  const [seller,setSeller]=useState({...SELLERS[0]});
  const [page,setPage]=useState("dashboard");
  const [orders,setOrders]=useState(ORDERS_SEED.filter(o=>o.sid==="S1"));
  const [prods,setProds]=useState(PRODUCTS.filter(p=>p.sid==="S1"));

  if(!loggedIn) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1a1a,#2d1810)",padding:24}}>
      <Card style={{padding:"32px 32px",width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:22}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div><div style={{fontSize:11,color:"#999",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>Seller Portal</div></div>
        <div style={{display:"flex",background:"#f5f5f5",borderRadius:8,padding:3,marginBottom:18}}>
          {["login","register"].map(m=>(
            <button key={m} style={{flex:1,padding:"7px 0",border:"none",borderRadius:6,background:"transparent",fontSize:12,fontWeight:600,color:"#7C3AED",cursor:"pointer"}}>{m==="login"?"Sign In":"Register as Seller"}</button>
          ))}
        </div>
        <div style={{background:"#EEF2FF",border:"1px solid #C7D2FE",borderRadius:8,padding:"9px 12px",fontSize:11,color:"#4338CA",marginBottom:14}}>
          <strong>Free plan:</strong> List 2 products free · After 5 orders: 8% commission · ₹999/mo for unlimited listings
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <input placeholder="Email address" style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"9px 12px",fontSize:13,outline:"none"}}/>
          <input type="password" placeholder="Password" style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"9px 12px",fontSize:13,outline:"none"}}/>
          <Btn full color="#7C3AED" onClick={()=>{setIsNew(false);setLoggedIn(true);}}>Sign In to Dashboard</Btn>
          <Btn full color="#7C3AED" outline onClick={()=>{setIsNew(true);setLoggedIn(true);}}>Register — Submit Application</Btn>
          <button onClick={onSwitch} style={{background:"none",border:"none",color:"#999",fontSize:11,cursor:"pointer"}}>← Back to Portal Select</button>
        </div>
      </Card>
    </div>
  );

  if(isNew) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f7f7f7"}}>
      <Card style={{padding:"40px 36px",maxWidth:460,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:14}}>⏳</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,marginBottom:9}}>Application Under Review</h2>
        <p style={{color:"#666",lineHeight:1.7,marginBottom:18}}>Your seller account is pending admin approval. You'll receive an email within 24–48 hours.</p>
        <div style={{background:"#FDF6F3",borderRadius:10,padding:16,marginBottom:18,fontSize:12,textAlign:"left"}}>
          <div style={{fontWeight:700,marginBottom:6}}>What happens next?</div>
          {["Admin reviews your GST & documents","Account activated within 48 hours","List up to 2 products for free","After 5 orders, 8% commission applies"].map(t=><div key={t} style={{color:"#666",marginBottom:3}}>✅ {t}</div>)}
        </div>
        <button onClick={onSwitch} style={{background:"none",border:"1.5px solid #C84B1F",color:"#C84B1F",padding:"9px 18px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer"}}>← Back to Portal Select</button>
      </Card>
    </div>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f7f7f7"}}>
      {/* Sidebar */}
      <div style={{width:210,background:"#1a1a1a",display:"flex",flexDirection:"column",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"20px 16px 14px"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:800,color:"#fff"}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div>
          <div style={{fontSize:9,color:"#555",letterSpacing:1,textTransform:"uppercase",marginTop:1}}>Seller Portal</div>
        </div>
        <div style={{padding:"10px 10px",flex:1}}>
          <div style={{background:"rgba(124,58,237,.15)",border:"1px solid rgba(124,58,237,.3)",borderRadius:9,padding:"9px 12px",marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:3}}>{seller.name}</div>
            <div style={{display:"flex",gap:4}}><Bdg label={seller.status} color={SC[seller.status]}/><Bdg label={seller.plan==="paid"?"Paid":"Free"} color={seller.plan==="paid"?"#7C3AED":"#6B7280"}/></div>
          </div>
          {[{k:"dashboard",i:"📊",l:"Dashboard"},{k:"products",i:"📦",l:"My Products"},{k:"orders",i:"🛒",l:"Orders"},{k:"earnings",i:"💰",l:"Earnings & Payouts"},{k:"profile",i:"⚙️",l:"Shop Settings"}].map(item=>(
            <div key={item.k} onClick={()=>setPage(item.k)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,cursor:"pointer",marginBottom:2,background:page===item.k?"rgba(124,58,237,.25)":"transparent",color:page===item.k?"#A78BFA":"rgba(255,255,255,.55)"}}>
              <span style={{fontSize:15}}>{item.i}</span>
              <span style={{fontSize:12,fontWeight:page===item.k?600:400}}>{item.l}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 14px 18px"}}>
          {seller.plan==="free"&&<div style={{background:"#C84B1F",borderRadius:9,padding:"11px 13px",marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:3}}>Upgrade to Paid</div><div style={{fontSize:10,color:"rgba(255,255,255,.7)",marginBottom:7}}>Unlimited listings · Priority support</div><button style={{background:"#fff",color:"#C84B1F",border:"none",padding:"5px 10px",borderRadius:5,fontSize:10,fontWeight:700,cursor:"pointer"}}>₹999/mo →</button></div>}
          <button onClick={onSwitch} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.45)",padding:"7px 12px",borderRadius:7,fontSize:11,cursor:"pointer",width:"100%"}}>⇄ Switch Portal</button>
        </div>
      </div>
      {/* Content */}
      <div style={{flex:1,overflow:"auto"}}>
        {page==="dashboard"&&<SDash seller={seller} orders={orders} prods={prods} setPage={setPage}/>}
        {page==="products"&&<SProducts prods={prods} setProds={setProds} seller={seller}/>}
        {page==="orders"&&<SOrders orders={orders} setOrders={setOrders}/>}
        {page==="earnings"&&<SEarnings seller={seller} orders={orders}/>}
        {page==="profile"&&<SProfile seller={seller} setSeller={setSeller}/>}
      </div>
    </div>
  );
}

function SDash({seller,orders,prods,setPage}) {
  const rev=orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const pending=orders.filter(o=>["pending","confirmed"].includes(o.status)).length;
  const freeLeft=Math.max(0,2-prods.length);
  return (
    <div style={{padding:"24px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800}}>Dashboard</h1><p style={{color:"#888",fontSize:12}}>Welcome back, {seller.owner.split(" ")[0]}!</p></div>
        <Btn color="#7C3AED" onClick={()=>setPage("products")}>+ Add Product</Btn>
      </div>
      {seller.plan==="free"&&freeLeft===0&&(
        <div style={{background:"#FEF3C7",border:"1px solid #FCD34D",borderRadius:9,padding:"11px 14px",marginBottom:18,fontSize:12,display:"flex",alignItems:"center",gap:9}}>
          <span>⚠️</span><span><strong>Free listing limit reached.</strong> Upgrade to add more products.</span>
          <button style={{background:"#F59E0B",color:"#fff",border:"none",padding:"4px 10px",borderRadius:5,fontSize:11,fontWeight:700,cursor:"pointer",marginLeft:"auto"}}>Upgrade ₹999/mo</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <StatCard icon="📦" label="Total Orders" value={seller.totalOrders} sub={`${pending} pending`}/>
        <StatCard icon="💰" label="Revenue (Delivered)" value={`₹${rev.toLocaleString()}`} color="#10B981"/>
        <StatCard icon="⏳" label="Pending Payout" value={`₹${seller.pendingPayout.toLocaleString()}`} sub="Next: Monday" color="#F59E0B"/>
        <StatCard icon="🛍️" label="Products" value={prods.length} sub={seller.plan==="free"?`${freeLeft} free slots left`:"Unlimited"} color="#7C3AED"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card style={{padding:16}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Plan & Commission</h3>
          {[["Plan",<Bdg label={seller.plan==="paid"?"Paid Seller":"Free Seller"} color={seller.plan==="paid"?"#7C3AED":"#6B7280"}/>],["Commission",seller.totalOrders>=5?"8% per order":"0% (first 5 orders free)"],["Free listings","2 products"],["Payout schedule","Every Monday"],["Delivery options",seller.delivery.join(", ")]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f5f5f5",fontSize:12}}><span style={{color:"#666"}}>{k}</span><span style={{fontWeight:600}}>{v}</span></div>
          ))}
        </Card>
        <Card style={{padding:16}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Recent Orders</h3>
          {orders.slice(0,4).map(o=>(
            <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}}>
              <div><div style={{fontWeight:600}}>#{o.id}</div><div style={{color:"#999"}}>{o.buyer}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:600}}>₹{o.total.toLocaleString()}</div><Bdg label={o.status} color={SC[o.status]||"#888"}/></div>
            </div>
          ))}
          <button onClick={()=>setPage("orders")} style={{width:"100%",marginTop:9,background:"none",border:"1px solid #e0e0e0",color:"#7C3AED",padding:"6px 0",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer"}}>View All Orders →</button>
        </Card>
      </div>
    </div>
  );
}

// Unit type groups for smart calc detection
const FIXED_UNITS = ["unit","nos","no","piece","kg","gm","roll","litre","ltr","ml","bag","set","sheet","can","box"];
const AREA_UNITS  = ["sq ft","sq m","sqft","sqm"];
const LENGTH_UNITS= ["metre","mtr","m","running ft","rft","inch","mm","cm","feet","ft"];

function getCalcType(unit=""){
  const u = unit.toLowerCase().trim();
  if(AREA_UNITS.some(x=>u.includes(x))) return "tile";
  if(LENGTH_UNITS.some(x=>u===x||u.startsWith(x+" "))) return "length";
  return "fixed";
}

function SProducts({prods,setProds,seller}) {
  const [showAdd,setShowAdd]=useState(false);
  const [editId,setEditId]=useState(null);
  const emptyForm={name:"",brand:"",cat:"Bricks & Blocks",sub:"arch",
    price:"",old:"",unit:"unit",stock:"",desc:"",icon:"🧱",hint:"",
    // tile fields
    tileW:"",tileH:"",tilesPerPack:"",
    // length fields
    metresPerUnit:"",
    // coverage fields
    coveragePerLitre:"",litresPerPack:""
  };
  const [form,setForm]=useState({...emptyForm});

  const detectedCalcType = getCalcType(form.unit);
  const canAdd=seller.plan==="paid"||prods.length<2;

  const buildProduct = ()=>({
    ...form,
    id: editId||Date.now(),
    sid:seller.id, sn:seller.name,
    price:+form.price, old:+form.old, stock:+form.stock,
    rating:editId?prods.find(p=>p.id===editId)?.rating||0:0,
    rev:editId?prods.find(p=>p.id===editId)?.rev||0:0,
    disc:Math.round((1-(+form.price)/(+form.old))*100)||0,
    badge:editId?prods.find(p=>p.id===editId)?.badge||"New":"New",
    listed:true,
    calcType: detectedCalcType,
    // tile
    ...(detectedCalcType==="tile"&&form.tileW&&form.tileH&&form.tilesPerPack?{
      tileW:+form.tileW, tileH:+form.tileH,
      tilesPerPack:+form.tilesPerPack,
      packSqft:+(form.tileW)* +(form.tileH)* +(form.tilesPerPack),
      packPrice:(+(form.tileW))*(+(form.tileH))*(+(form.tilesPerPack))*(+form.price),
      packLabel:`1 Box = ${form.tilesPerPack} tiles (${form.tileW}×${form.tileH} ft each) = ${(+(form.tileW))*(+(form.tileH))*(+(form.tilesPerPack))} sq ft`,
    }:{}),
    // length
    ...(detectedCalcType==="length"&&form.metresPerUnit?{
      metresPerUnit:+form.metresPerUnit,
      pricePerMetre:+form.price,
      packLabel:`1 piece = ${form.metresPerUnit} ${form.unit}`,
    }:{}),
    // coverage
    ...(detectedCalcType==="tile"&&form.coveragePerLitre?{
      calcType:"coverage",
      coveragePerLitre:+form.coveragePerLitre,
      litresPerPack:+form.litresPerPack||1,
      packPrice:+form.price,
    }:{}),
  });

  const save=()=>{
    const p=buildProduct();
    if(editId) setProds(ps=>ps.map(x=>x.id===editId?p:x));
    else setProds(ps=>[...ps,p]);
    setShowAdd(false); setEditId(null); setForm({...emptyForm});
  };

  const startEdit=(p)=>{
    setForm({
      name:p.name||"",brand:p.brand||"",cat:p.cat||"Bricks & Blocks",sub:p.sub||"arch",
      price:p.price||"",old:p.old||"",unit:p.unit||"unit",stock:p.stock||"",
      desc:p.desc||"",icon:p.icon||"🧱",hint:p.hint||"",
      tileW:p.tileW||"",tileH:p.tileH||"",tilesPerPack:p.tilesPerPack||"",
      metresPerUnit:p.metresPerUnit||"",
      coveragePerLitre:p.coveragePerLitre||"",litresPerPack:p.litresPerPack||"",
    });
    setEditId(p.id); setShowAdd(true);
  };

  const inp=(k,ph,type="text")=>(
    <input type={type} placeholder={ph} value={form[k]}
      onChange={e=>setForm(x=>({...x,[k]:e.target.value}))}
      style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"8px 10px",fontSize:12,outline:"none",width:"100%"}}/>
  );
  const sel=(k,opts)=>(
    <select value={form[k]} onChange={e=>setForm(x=>({...x,[k]:e.target.value}))}
      style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"8px 10px",fontSize:12,outline:"none",width:"100%"}}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  // Unit options grouped
  const UNIT_OPTS=[
    {v:"unit",l:"unit — Fixed qty (nos/piece)"},
    {v:"kg",l:"kg — Weight"},
    {v:"bag",l:"bag — Bag (cement/sand)"},
    {v:"roll",l:"roll — Roll (wire/wallpaper)"},
    {v:"litre",l:"litre — Volume (paint/liquid)"},
    {v:"set",l:"set — Set/Pack (fixed items)"},
    {v:"sheet",l:"sheet — Sheet (plywood/glass)"},
    {v:"can",l:"can — Can (paint)"},
    {v:"sq ft",l:"sq ft — Area (tile/flooring) 📐"},
    {v:"sq m",l:"sq m — Area in sqm 📐"},
    {v:"metre",l:"metre — Length (pipe/wire) 📏"},
    {v:"running ft",l:"running ft — Running length 📏"},
    {v:"inch",l:"inch — Length in inches 📏"},
  ];

  return (
    <div style={{padding:"24px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800}}>My Products</h1>
          <p style={{color:"#888",fontSize:11}}>{seller.plan==="free"?`${prods.length}/2 free listings used`:"Unlimited listings"}</p>
        </div>
        {canAdd
          ? <Btn color="#7C3AED" onClick={()=>{setShowAdd(true);setEditId(null);setForm({...emptyForm});}}>+ Add Product</Btn>
          : <span style={{fontSize:11,color:"#C84B1F",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:7,padding:"6px 12px"}}>Free limit reached — Upgrade</span>}
      </div>

      {showAdd&&(
        <Card style={{padding:20,marginBottom:18,border:"2px solid #7C3AED"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:14,fontWeight:700}}>{editId?"Edit Product":"Add New Product"}</h3>
            <button onClick={()=>{setShowAdd(false);setEditId(null);}} style={{background:"none",border:"none",fontSize:18,color:"#999",cursor:"pointer"}}>✕</button>
          </div>

          {/* Row 1 — Basic info */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:9,marginBottom:9}}>
            {inp("name","Product name (required)")}
            {inp("brand","Brand name")}
            <select value={form.cat} onChange={e=>setForm(x=>({...x,cat:e.target.value}))}
              style={{border:"1px solid #e0e0e0",borderRadius:7,padding:"8px 10px",fontSize:12,outline:"none"}}>
              {CATS.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Row 2 — Price + Unit */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr",gap:9,marginBottom:9}}>
            {inp("price","Selling price ₹","number")}
            {inp("old","MRP ₹","number")}
            {inp("stock","Stock qty","number")}
            {sel("unit",UNIT_OPTS)}
          </div>

          {/* Smart calc hint */}
          {detectedCalcType!=="fixed"&&(
            <div style={{background:detectedCalcType==="tile"?"#EEF2FF":"#F0FDF4",border:`1px solid ${detectedCalcType==="tile"?"#C7D2FE":"#BBF7D0"}`,borderRadius:8,padding:"9px 12px",marginBottom:9,fontSize:11,color:detectedCalcType==="tile"?"#4338CA":"#065F46"}}>
              {detectedCalcType==="tile"
                ? "📐 Area-based unit detected — fill tile/pack size below so buyers get pack calculator"
                : "📏 Length-based unit detected — fill piece length below so buyers get length calculator"}
            </div>
          )}

          {/* TILE extra fields */}
          {detectedCalcType==="tile"&&(
            <div style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:9,padding:"12px 14px",marginBottom:9}}>
              <div style={{fontSize:11,fontWeight:700,color:"#5B21B6",marginBottom:8}}>📐 Tile / Pack Details <span style={{fontWeight:400,color:"#888"}}>(buyers will see area calculator)</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:9,marginBottom:7}}>
                <div><div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Tile Width (ft)</div>{inp("tileW","e.g. 2","number")}</div>
                <div><div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Tile Height (ft)</div>{inp("tileH","e.g. 2","number")}</div>
                <div><div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Tiles per Box/Pack</div>{inp("tilesPerPack","e.g. 4","number")}</div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                  {form.tileW&&form.tileH&&form.tilesPerPack&&(
                    <div style={{background:"#7C3AED",color:"#fff",borderRadius:7,padding:"8px 10px",fontSize:11,fontWeight:600,textAlign:"center"}}>
                      1 Box = {(+form.tileW)*(+form.tileH)*(+form.tilesPerPack)} sq ft<br/>
                      Box price: ₹{((+form.price)*(+form.tileW)*(+form.tileH)*(+form.tilesPerPack)).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
              <div style={{fontSize:10,color:"#888"}}>
                Example: 2×2 ft tile, 4 tiles/box → 1 box = 16 sq ft &nbsp;|&nbsp; 2×4 ft tile, 2 tiles/box → 1 box = 16 sq ft
              </div>
            </div>
          )}

          {/* LENGTH extra fields */}
          {detectedCalcType==="length"&&(
            <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:9,padding:"12px 14px",marginBottom:9}}>
              <div style={{fontSize:11,fontWeight:700,color:"#065F46",marginBottom:8}}>📏 Length / Piece Details <span style={{fontWeight:400,color:"#888"}}>(buyers will see length calculator)</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:"#555",marginBottom:3}}>Length per piece ({form.unit})</div>
                  {inp("metresPerUnit","e.g. 3 (3m per pipe)","number")}
                </div>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
                  {form.metresPerUnit&&form.price&&(
                    <div style={{background:"#10B981",color:"#fff",borderRadius:7,padding:"8px 10px",fontSize:11,fontWeight:600,textAlign:"center"}}>
                      1 piece = {form.metresPerUnit} {form.unit}<br/>
                      ₹{(+form.price).toLocaleString()}/piece
                    </div>
                  )}
                </div>
                <div style={{fontSize:10,color:"#888",display:"flex",alignItems:"center"}}>
                  Example: CPVC pipe 1 inch → 3m/piece<br/>Wire → 90m/roll
                </div>
              </div>
            </div>
          )}

          {/* Row 3 — Icon + Desc + Hint */}
          <div style={{display:"grid",gridTemplateColumns:"70px 1fr 1fr",gap:9,marginBottom:12}}>
            {inp("icon","Emoji 🧱")}
            {inp("desc","Product description")}
            {inp("hint","Buying hint (optional, e.g. 1 bag covers 35 sq ft)")}
          </div>

          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <Btn color="#7C3AED" disabled={!form.name||!form.price||!form.old} onClick={save}>
              {editId?"Update Product":"Save & List Product"}
            </Btn>
            <Btn outline onClick={()=>{setShowAdd(false);setEditId(null);}}>Cancel</Btn>
            {form.price&&form.old&&+form.old>0&&(
              <span style={{fontSize:11,color:"#10B981",fontWeight:600,marginLeft:8}}>
                Discount: {Math.round((1-(+form.price)/(+form.old))*100)}%
              </span>
            )}
          </div>
        </Card>
      )}
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid #e8e8e8",background:"#f9f9f9"}}>{["Product","Category","Price","Stock","Calc Type","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:600,fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
          <tbody>
            {prods.map(p=>(
              <tr key={p.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>{p.icon}</span><div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:"#999"}}>{p.brand}</div></div></div></td>
                <td style={{padding:"10px 14px",color:"#666"}}>{p.cat}</td>
                <td style={{padding:"10px 14px"}}><div style={{fontWeight:700}}>₹{p.price.toLocaleString()}</div>{p.old&&<div style={{fontSize:10,color:"#bbb",textDecoration:"line-through"}}>₹{p.old}</div>}</td>
                <td style={{padding:"10px 14px",fontWeight:600,color:p.stock>50?"#10B981":p.stock>10?"#F59E0B":"#EF4444"}}>{p.stock}</td>
                <td style={{padding:"10px 14px"}}><Bdg label={p.listed?"Listed":"Unlisted"} color={p.listed?"#10B981":"#6B7280"}/></td>
                <td style={{padding:"10px 14px"}}>
                  <Bdg
                    label={p.calcType==="tile"?"📐 Area":p.calcType==="length"?"📏 Length":p.calcType==="coverage"?"🎨 Coverage":"🔢 Fixed"}
                    color={p.calcType==="tile"?"#7C3AED":p.calcType==="length"?"#10B981":p.calcType==="coverage"?"#D97706":"#6B7280"}
                  />
                  {p.packLabel&&<div style={{fontSize:9,color:"#888",marginTop:2}}>{p.packLabel}</div>}
                </td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>startEdit(p)} style={{background:"none",border:"1px solid #C7D2FE",color:"#7C3AED",padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>Edit</button>
                    <button onClick={()=>setProds(ps=>ps.map(x=>x.id===p.id?{...x,listed:!x.listed}:x))} style={{background:"none",border:"1px solid #e0e0e0",color:"#444",padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>{p.listed?"Unlist":"List"}</button>
                    <button onClick={()=>setProds(ps=>ps.filter(x=>x.id!==p.id))} style={{background:"none",border:"1px solid #FECACA",color:"#EF4444",padding:"3px 9px",borderRadius:5,fontSize:10,fontWeight:600,cursor:"pointer"}}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SOrders({orders,setOrders}) {
  const [filter,setFilter]=useState("all");
  const upd=(id,status)=>setOrders(o=>o.map(x=>x.id===id?{...x,status}:x));
  const updTrack=(id,v)=>setOrders(o=>o.map(x=>x.id===id?{...x,tracking:v}:x));
  const NEXT={pending:"confirmed",confirmed:"dispatched",dispatched:"delivered"};
  const list=filter==="all"?orders:orders.filter(o=>o.status===filter);
  return (
    <div style={{padding:"24px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800}}>Orders</h1>
        <div style={{display:"flex",gap:5}}>
          {["all","pending","confirmed","dispatched","delivered"].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{padding:"5px 12px",borderRadius:18,border:`1px solid ${filter===s?"#7C3AED":"#e0e0e0"}`,background:filter===s?"#7C3AED":"#fff",color:filter===s?"#fff":"#666",fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {list.map(o=>(
          <Card key={o.id} style={{overflow:"hidden"}}>
            <div style={{background:"#f9f9f9",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e8e8e8"}}>
              <div style={{display:"flex",gap:16}}>
                {[["ORDER","#"+o.id],["BUYER",o.buyer+" · "+o.city],["DATE",o.date],["AMOUNT","₹"+o.total.toLocaleString()],["PAYMENT",o.payment],["DELIVERY",o.delivery]].map(([k,v])=>(
                  <div key={k}><div style={{fontSize:9,color:"#999"}}>{k}</div><div style={{fontWeight:600,fontSize:11,color:k==="ORDER"?"#7C3AED":"#1a1a1a",textTransform:"capitalize"}}>{v}</div></div>
                ))}
              </div>
              <Bdg label={o.status} color={SC[o.status]||"#888"}/>
            </div>
            <div style={{padding:"12px 16px"}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
                {o.items.map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:5,background:"#F9F4F1",borderRadius:6,padding:"4px 9px",fontSize:11}}><span style={{fontSize:14}}>{item.icon}</span>{item.name} ×{item.qty}</div>)}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {o.status!=="delivered"&&o.status!=="cancelled"&&NEXT[o.status]&&(
                  <Btn sm color="#7C3AED" onClick={()=>upd(o.id,NEXT[o.status])}>
                    {o.status==="pending"?"✅ Confirm":o.status==="confirmed"?"📦 Mark Dispatched":"🏁 Mark Delivered"}
                  </Btn>
                )}
                {o.status==="confirmed"&&(
                  <input placeholder="Tracking / AWB number" value={o.tracking||""} onChange={e=>updTrack(o.id,e.target.value)} style={{border:"1px solid #e0e0e0",borderRadius:6,padding:"4px 9px",fontSize:11,outline:"none",width:160}}/>
                )}
                {o.tracking&&<span style={{fontSize:11,color:"#7C3AED",fontWeight:600}}>📡 {o.tracking}</span>}
                <span style={{fontSize:10,color:"#888",marginLeft:"auto"}}>Commission: ₹{o.commission} (8%)</span>
                {o.status!=="cancelled"&&o.status!=="delivered"&&<button onClick={()=>upd(o.id,"cancelled")} style={{background:"none",border:"1px solid #FECACA",color:"#EF4444",padding:"3px 9px",borderRadius:5,fontSize:10,cursor:"pointer"}}>Cancel</button>}
              </div>
            </div>
          </Card>
        ))}
        {list.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:"#999"}}><div style={{fontSize:38,marginBottom:9}}>📭</div>No orders found</div>}
      </div>
    </div>
  );
}

function SEarnings({seller,orders}) {
  const dlv=orders.filter(o=>o.status==="delivered");
  const rev=dlv.reduce((s,o)=>s+o.total,0);
  const comm=dlv.reduce((s,o)=>s+o.commission,0);
  return (
    <div style={{padding:"24px 24px"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>Earnings & Payouts</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <StatCard icon="💳" label="Total Revenue" value={`₹${rev.toLocaleString()}`} color="#10B981"/>
        <StatCard icon="🏛️" label="Platform Commission" value={`₹${comm.toLocaleString()}`} sub="8% per order" color="#EF4444"/>
        <StatCard icon="💰" label="Net Earnings" value={`₹${(rev-comm).toLocaleString()}`} color="#7C3AED"/>
        <StatCard icon="⏳" label="Pending Payout" value={`₹${seller.pendingPayout.toLocaleString()}`} sub="Pays Monday" color="#F59E0B"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card style={{padding:16}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Payout History</h3>
          {[{date:"2026-06-16",amount:24800},{date:"2026-06-09",amount:18400},{date:"2026-06-02",amount:32100}].map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f5f5f5",fontSize:12}}>
              <div><div style={{fontWeight:600}}>₹{p.amount.toLocaleString()}</div><div style={{fontSize:10,color:"#999"}}>{p.date}</div></div>
              <Bdg label="Paid" color="#10B981"/>
            </div>
          ))}
          <div style={{marginTop:12,padding:"9px 12px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:7,fontSize:12,color:"#10B981",fontWeight:600}}>Next payout: ₹{seller.pendingPayout.toLocaleString()} on Monday</div>
        </Card>
        <Card style={{padding:16}}>
          <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Order Breakdown</h3>
          {dlv.length===0?<div style={{color:"#999",fontSize:12}}>No delivered orders yet</div>:dlv.map(o=>(
            <div key={o.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"7px 0",borderBottom:"1px solid #f5f5f5"}}>
              <div><div style={{fontWeight:600}}>#{o.id}</div><div style={{color:"#999"}}>{o.buyer}</div></div>
              <div style={{textAlign:"right"}}><div>₹{o.total.toLocaleString()} <span style={{color:"#EF4444"}}>-₹{o.commission}</span></div><div style={{color:"#10B981",fontWeight:600}}>Net ₹{(o.total-o.commission).toLocaleString()}</div></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function SProfile({seller,setSeller}) {
  const [form,setForm]=useState({...seller});
  const [saved,setSaved]=useState(false);
  const f=(k,label)=><Inp label={label} value={form[k]} onChange={e=>setForm(x=>({...x,[k]:e.target.value}))}/>;
  return (
    <div style={{padding:"24px 24px",maxWidth:660}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>Shop Settings</h1>
      {saved&&<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#10B981",fontWeight:600}}>✅ Changes saved successfully</div>}
      <Card style={{padding:20,marginBottom:14}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:14}}>Business Details</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {f("name","Shop / Business Name")}{f("owner","Owner Name")}{f("email","Email Address")}{f("phone","Phone Number")}{f("city","City")}{f("gst","GST Number")}
        </div>
      </Card>
      <Card style={{padding:20,marginBottom:14}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Delivery Options</h3>
        <div style={{display:"flex",gap:9}}>
          {["self","platform"].map(d=>(
            <div key={d} onClick={()=>setForm(x=>({...x,delivery:x.delivery.includes(d)?x.delivery.filter(i=>i!==d):[...x.delivery,d]}))} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 14px",border:`2px solid ${form.delivery.includes(d)?"#7C3AED":"#e0e0e0"}`,borderRadius:9,cursor:"pointer",background:form.delivery.includes(d)?"#EEF2FF":"#fff",fontSize:12,fontWeight:600}}>
              <span>{form.delivery.includes(d)?"✅":"⬜"}</span>{d==="self"?"🚛 Self / Own Courier":"📦 Platform Logistics"}
            </div>
          ))}
        </div>
        <p style={{fontSize:11,color:"#999",marginTop:7}}>Platform logistics: Shiprocket/Delhivery integration. Self: You arrange delivery.</p>
      </Card>
      <Btn color="#7C3AED" onClick={()=>{setSeller(form);setSaved(true);setTimeout(()=>setSaved(false),3000);}}>Save Changes</Btn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  ADMIN PORTAL
// ══════════════════════════════════════════════════════════════════════
function AdminPortal({onSwitch}) {
  const [loggedIn,setLoggedIn]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [sellers,setSellers]=useState([...SELLERS]);
  const [orders]=useState([...ORDERS_SEED]);

  if(!loggedIn) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0c1445,#1a237e)",padding:24}}>
      <Card style={{padding:"32px 32px",width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:32,marginBottom:7}}>⚙️</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800}}>Admin Panel</div><p style={{fontSize:11,color:"#999",marginTop:3}}>ArchiMart Platform Management</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <input placeholder="Admin email" defaultValue="admin@archimart.in" style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none"}}/>
          <input type="password" placeholder="Password" defaultValue="••••••••" style={{border:"1px solid #e0e0e0",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none"}}/>
          <Btn full color="#0369A1" onClick={()=>setLoggedIn(true)}>Sign In as Admin</Btn>
          <button onClick={onSwitch} style={{background:"none",border:"none",color:"#999",fontSize:11,cursor:"pointer"}}>← Back to Portal Select</button>
        </div>
      </Card>
    </div>
  );

  const approve=id=>setSellers(s=>s.map(x=>x.id===id?{...x,status:"approved"}:x));
  const reject=id=>setSellers(s=>s.map(x=>x.id===id?{...x,status:"rejected"}:x));
  const gmv=orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
  const comm=orders.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.commission,0);
  const pendingApprovals=sellers.filter(s=>s.status==="pending").length;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f7f7f7"}}>
      <div style={{width:210,background:"#0c1445",display:"flex",flexDirection:"column",minHeight:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"20px 16px 14px"}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:800,color:"#fff"}}>Archi<span style={{color:"#C84B1F"}}>Mart</span></div><div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:1,textTransform:"uppercase",marginTop:1}}>Admin Panel</div></div>
        <div style={{padding:"10px 10px",flex:1}}>
          {[{k:"dashboard",i:"📊",l:"Dashboard"},{k:"sellers",i:"🏪",l:"Sellers",b:pendingApprovals},{k:"orders",i:"🛒",l:"All Orders"},{k:"payouts",i:"💰",l:"Payouts"},{k:"products",i:"📦",l:"Products"}].map(item=>(
            <div key={item.k} onClick={()=>setPage(item.k)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:7,cursor:"pointer",marginBottom:2,background:page===item.k?"rgba(3,105,161,.35)":"transparent",color:page===item.k?"#38BDF8":"rgba(255,255,255,.5)"}}>
              <span style={{fontSize:15}}>{item.i}</span>
              <span style={{fontSize:12,fontWeight:page===item.k?600:400,flex:1}}>{item.l}</span>
              {item.b>0&&<span style={{background:"#EF4444",color:"#fff",fontSize:9,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{item.b}</span>}
            </div>
          ))}
        </div>
        <div style={{padding:"10px 14px 18px"}}><button onClick={onSwitch} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.4)",padding:"7px 12px",borderRadius:7,fontSize:11,cursor:"pointer",width:"100%"}}>⇄ Switch Portal</button></div>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {page==="dashboard"&&(
          <div style={{padding:"24px 24px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,marginBottom:5}}>Platform Dashboard</h1>
            <p style={{color:"#888",fontSize:12,marginBottom:20}}>ArchiMart — full platform overview</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
              <StatCard icon="💹" label="Total GMV" value={`₹${gmv.toLocaleString()}`} color="#0369A1"/>
              <StatCard icon="🏛️" label="Commission Earned" value={`₹${comm.toLocaleString()}`} color="#10B981"/>
              <StatCard icon="🏪" label="Active Sellers" value={sellers.filter(s=>s.status==="approved").length} sub={`${pendingApprovals} pending`} color="#7C3AED"/>
              <StatCard icon="📦" label="Total Products" value={PRODUCTS.length} color="#F59E0B"/>
            </div>
            {pendingApprovals>0&&(
              <div style={{background:"#FEF3C7",border:"1px solid #FCD34D",borderRadius:9,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                <span style={{fontSize:18}}>⚠️</span><span><strong>{pendingApprovals} seller application{pendingApprovals>1?"s":""}</strong> pending approval</span>
                <button onClick={()=>setPage("sellers")} style={{marginLeft:"auto",background:"#F59E0B",color:"#fff",border:"none",padding:"5px 12px",borderRadius:5,fontSize:11,fontWeight:700,cursor:"pointer"}}>Review Now →</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Card style={{padding:16}}><h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Recent Orders</h3>{orders.slice(0,5).map(o=>(
                <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}}>
                  <div><div style={{fontWeight:600}}>#{o.id} · {o.buyer}</div><div style={{color:"#999"}}>{o.sn}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:600}}>₹{o.total.toLocaleString()}</div><Bdg label={o.status} color={SC[o.status]||"#888"}/></div>
                </div>
              ))}</Card>
              <Card style={{padding:16}}><h3 style={{fontSize:13,fontWeight:700,marginBottom:12}}>Sellers Overview</h3>{sellers.map(s=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #f5f5f5",fontSize:11}}>
                  <div><div style={{fontWeight:600}}>{s.name}</div><div style={{color:"#999"}}>{s.city} · {s.owner}</div></div>
                  <Bdg label={s.status} color={SC[s.status]||"#888"}/>
                </div>
              ))}</Card>
            </div>
          </div>
        )}
        {page==="sellers"&&(
          <div style={{padding:"24px 24px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>Seller Management</h1>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {sellers.map(s=>(
                <Card key={s.id} style={{overflow:"hidden"}}>
                  <div style={{background:"#f9f9f9",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e8e8e8"}}>
                    <div style={{display:"flex",gap:16}}>
                      {[["SHOP",s.name],["OWNER",s.owner],["CITY",s.city],["JOINED",s.joined],["PLAN",s.plan]].map(([k,v])=>(
                        <div key={k}><div style={{fontSize:9,color:"#999"}}>{k}</div><div style={{fontWeight:700,fontSize:12,textTransform:"capitalize"}}>{v}</div></div>
                      ))}
                    </div>
                    <Bdg label={s.status} color={SC[s.status]||"#888"}/>
                  </div>
                  <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}>
                    <div style={{display:"flex",gap:16}}>
                      <span style={{color:"#666"}}>{s.email}</span>
                      <span style={{color:"#666"}}>GST: {s.gst}</span>
                      <span>Orders: <strong>{s.totalOrders}</strong></span>
                      <span>Earnings: <strong>₹{s.earnings.toLocaleString()}</strong></span>
                      <span>Commission: <strong>{s.commission}%</strong></span>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      {s.status==="pending"&&<><Btn sm color="#10B981" onClick={()=>approve(s.id)}>✅ Approve</Btn><Btn sm color="#EF4444" onClick={()=>reject(s.id)}>❌ Reject</Btn></>}
                      {s.status==="approved"&&<Btn sm outline onClick={()=>reject(s.id)}>Suspend</Btn>}
                      {s.status==="rejected"&&<Btn sm color="#10B981" onClick={()=>approve(s.id)}>Re-approve</Btn>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {page==="orders"&&(
          <div style={{padding:"24px 24px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>All Orders</h1>
            <Card>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"1px solid #e8e8e8",background:"#f9f9f9"}}>{["Order ID","Buyer","Seller","Amount","Commission","Payment","Delivery","Status"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                      <td style={{padding:"10px 12px",fontWeight:700,color:"#0369A1"}}>#{o.id}</td>
                      <td style={{padding:"10px 12px"}}><div style={{fontWeight:600}}>{o.buyer}</div><div style={{fontSize:10,color:"#999"}}>{o.city}</div></td>
                      <td style={{padding:"10px 12px",color:"#666"}}>{o.sn}</td>
                      <td style={{padding:"10px 12px",fontWeight:700}}>₹{o.total.toLocaleString()}</td>
                      <td style={{padding:"10px 12px",color:"#EF4444",fontWeight:600}}>₹{o.commission}</td>
                      <td style={{padding:"10px 12px"}}>{o.payment}</td>
                      <td style={{padding:"10px 12px",textTransform:"capitalize"}}>{o.delivery}</td>
                      <td style={{padding:"10px 12px"}}><Bdg label={o.status} color={SC[o.status]||"#888"}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {page==="payouts"&&(
          <div style={{padding:"24px 24px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>Payout Management</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
              <StatCard icon="💰" label="Total Pending" value={`₹${sellers.filter(s=>s.status==="approved").reduce((a,s)=>a+s.pendingPayout,0).toLocaleString()}`} color="#F59E0B"/>
              <StatCard icon="✅" label="Paid This Week" value="₹1,24,800" color="#10B981"/>
              <StatCard icon="🏛️" label="Commission This Week" value={`₹${comm.toLocaleString()}`} color="#0369A1"/>
            </div>
            <Card>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"1px solid #e8e8e8",background:"#f9f9f9"}}>{["Seller","City","Plan","Pending Payout","Commission","Bank","Action"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
                <tbody>
                  {sellers.filter(s=>s.status==="approved").map(s=>(
                    <tr key={s.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                      <td style={{padding:"10px 12px"}}><div style={{fontWeight:600}}>{s.name}</div><div style={{fontSize:10,color:"#999"}}>{s.email}</div></td>
                      <td style={{padding:"10px 12px",color:"#666"}}>{s.city}</td>
                      <td style={{padding:"10px 12px"}}><Bdg label={s.plan} color={s.plan==="paid"?"#7C3AED":"#6B7280"}/></td>
                      <td style={{padding:"10px 12px",fontWeight:700,color:"#F59E0B"}}>₹{s.pendingPayout.toLocaleString()}</td>
                      <td style={{padding:"10px 12px"}}>{s.commission}%</td>
                      <td style={{padding:"10px 12px",color:"#666"}}>HDFC ••• 4821</td>
                      <td style={{padding:"10px 12px"}}>
                        {s.pendingPayout>0?<Btn sm color="#10B981" onClick={()=>setSellers(p=>p.map(x=>x.id===s.id?{...x,pendingPayout:0}:x))}>Release ₹{s.pendingPayout.toLocaleString()}</Btn>:<Bdg label="Paid" color="#10B981"/>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
        {page==="products"&&(
          <div style={{padding:"24px 24px"}}>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,marginBottom:18}}>All Products ({PRODUCTS.length})</h1>
            <Card>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"1px solid #e8e8e8",background:"#f9f9f9"}}>{["Product","Seller","Category","Price","Stock","Status"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontWeight:600,fontSize:9,color:"#888",textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}</tr></thead>
                <tbody>
                  {PRODUCTS.map(p=>(
                    <tr key={p.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                      <td style={{padding:"10px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:19}}>{p.icon}</span><div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:10,color:"#999"}}>{p.brand}</div></div></div></td>
                      <td style={{padding:"10px 12px",color:"#7C3AED",fontWeight:600}}>{p.sn}</td>
                      <td style={{padding:"10px 12px",color:"#666"}}>{p.cat}</td>
                      <td style={{padding:"10px 12px",fontWeight:700}}>₹{p.price.toLocaleString()}<span style={{fontSize:10,color:"#999"}}>/{p.unit}</span></td>
                      <td style={{padding:"10px 12px",fontWeight:600,color:p.stock>100?"#10B981":p.stock>20?"#F59E0B":"#EF4444"}}>{p.stock}</td>
                      <td style={{padding:"10px 12px"}}><Bdg label="Listed" color="#10B981"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────
export default function App() {
  const [portal,setPortal]=useState(null);
  return (
    <div>
      <style>{GS}</style>
      {!portal&&<PortalSelect onSelect={setPortal}/>}
      {portal==="buyer"&&<BuyerPortal onSwitch={()=>setPortal(null)}/>}
      {portal==="seller"&&<SellerPortal onSwitch={()=>setPortal(null)}/>}
      {portal==="admin"&&<AdminPortal onSwitch={()=>setPortal(null)}/>}
    </div>
  );
}
