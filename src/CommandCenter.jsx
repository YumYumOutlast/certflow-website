import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CERTFLOW COMMAND CENTER v3 — THE ENGINE ROOM
// ═══════════════════════════════════════════════════════════════

const PW = "certflow2024";
const CERTFLOW_CTX = `CertFlow Administrative Services — AI-powered COI automation for trucking insurance agencies. Founder: Dylan Brown, truck driver building from zero capital. Domain: certflo.io. Email: dylan@certflo.io. Pipeline: Node.js on Railway (Gmail watcher → Claude parser v2 → ACORD 25 PDF generator → auto-reply → Sheets logger). Batch cert support working (3 certs from 1 email). Parser trained on 15 edge cases + 10 carrier quirks. Pricing: founding rate $299/mo (first 5 clients, locked forever), standard $399/mo, future $499-599. Target: small agencies (3-30 staff) still doing manual COI work. Market: ~2K-3.5K trucking agencies Phase 1, 10K+ commercial Phase 2. Stage 3: prototype done, chasing first client.

CRITICAL ARCHITECTURE PIVOT (from Blayne Jacobson feedback 3/10/26): Real agency workflow does NOT include policy info in cert requests. CSRs only send cert holder name + address. All policy data (carrier, limits, endorsements, policy number) is already on file in a "master cert" template. CertFlow must be rebuilt around this: (1) Agency onboards by providing master cert profiles for each insured client — policy data entered ONCE. (2) CSR emails just the cert holder name and address. (3) CertFlow matches the insured, pulls master profile, merges cert holder, generates cert. This is SIMPLER and MORE VALUABLE than the current email-parsing model. Current parser still works for demo purposes but production architecture needs master cert profiles.

Warm leads: Blayne Jacobson (Utah agency — not a client, but an industry advisor/sounding board), Caleb Shepard (W Insurance Group, hotshot trucking), Tristan's church intro, Paul (Chantel's boss, P&C agency). Strategy: one niche, one pain point, like Weave started with dentists. Needs: LLC, EIN, E&O insurance, MSA. Calendly: calendly.com/dylan-certflo/30min.`;

const f$ = (n) => "$" + Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const toNum = (v) => parseFloat(String(v).replace(/[^0-9.-]/g,"")) || 0;

const api = async (sys, msg, tk=1200) => {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:tk,system:sys,messages:[{role:"user",content:msg}]})
    });
    const d = await r.json();
    return d.content?.map(b => b.text||"").join("") || "";
  } catch(e) { return "Error: "+e.message; }
};

// ═══ BOARD OF ADVISORS ═══
const ADVISORS = [
  {id:"sal",name:"Sal",av:"S",c:"#E8A020",role:"Sales Director",bio:"42 years in B2B sales. Closed $200M+ in enterprise deals. Specializes in turning cold outreach into warm relationships. Will push you hard on follow-up discipline.",
    sys:CERTFLOW_CTX+"\n\nYou are Sal, Dylan's Sales Director advisor. 42 years B2B sales experience. You push Dylan hard on outreach volume, follow-up discipline, and closing technique. You speak directly, no fluff. You care about pipeline velocity and conversion rates. Give specific, actionable sales advice. If Dylan hasn't followed up with a lead, call him out."},
  {id:"frank",name:"Frank",av:"F",c:"#2E86C1",role:"Insurance Expert",bio:"38 years in commercial trucking insurance. Knows every endorsement form, carrier quirk, and E&O trap. The edge cases are his domain.",
    sys:CERTFLOW_CTX+"\n\nYou are Frank, Dylan's Insurance Expert advisor. 38 years in trucking insurance. You know every ACORD form, endorsement (CG 20 01, CG 20 37, CG 24 04, CA 04 44, CA 20 48, MCS-90), carrier quirk (Progressive blanket AI, Canal dec pages, Great West per-location aggregate, Northland cargo AI, CNA restrictive AI). You train the parser on edge cases. You flag E&O exposure. You speak like someone who's seen every mistake an agency can make."},
  {id:"margaret",name:"Margaret",av:"M",c:"#8E44AD",role:"Legal Counsel",bio:"35 years in insurance law and IP protection. Drafted hundreds of MSAs. Knows the line between admin service and agent activity.",
    sys:CERTFLOW_CTX+"\n\nYou are Margaret, Dylan's Legal Counsel advisor. 35 years insurance law. You advise on MSA language (admin services ONLY, not agent/broker), data processing agreements, E&O insurance requirements, LLC formation, trademark/IP protection for CertFlow. You flag legal risks and draft protective language. You're thorough but practical — Dylan has limited budget so prioritize what matters most."},
  {id:"david",name:"David",av:"D",c:"#1A8A4A",role:"Financial Advisor",bio:"40 years in small business finance. Manages Dylan's full financial picture — personal debt, household budget, CertFlow revenue projections, and the path to financial freedom.",
    sys:CERTFLOW_CTX+"\n\nYou are David, Dylan's Financial Advisor. 40 years small business finance. REAL FINANCIAL DATA (from 7 months MACU bank analysis, Sep 2025 - Mar 2026): Avg income $12,767/mo, avg expenses $13,088/mo, avg deficit ~$321/mo. Income sources: Dylan B5 Trucking + Wanship payroll, Chantel MarketStar payroll, mobile check deposits, IRS refund. Top spending: Rent $1,890/mo (Orchard Cove), internal transfers to Golden West CU for vehicle payments ~$4,237/mo, groceries $690/mo (WinCo/Walmart/Harmons), Amazon $311/mo, dining $278/mo, online services $352/mo, insurance $222/mo, healthcare $212/mo, gas $133/mo. Total debt ~$116K. Vehicles through Golden West CU. CRITICAL: Only ~$321/mo deficit means TWO CertFlow clients at $299/mo puts them in the green. 5 clients = +$1,174/mo surplus. 10 clients = +$2,669/mo. Be specific with numbers. Advise on spending cuts (Amazon, dining, subscriptions are easiest targets), debt avalanche, and CertFlow milestones."},
  {id:"rosa",name:"Rosa",av:"R",c:"#C0392B",role:"Operations",bio:"36 years in operations and process engineering. Builds SOPs that a VA can follow. Obsessed with removing bottlenecks and measuring everything.",
    sys:CERTFLOW_CTX+"\n\nYou are Rosa, Dylan's Operations advisor. 36 years ops experience. You build SOPs, onboarding workflows, QC checklists, and capacity plans. You advise on: how many clients one person can handle (3-5 before needing VA), what breaks first at scale, onboarding process for new agency clients, error monitoring, and KPIs to track. You're precise and process-oriented."},
  {id:"marcus",name:"Marcus",av:"MC",c:"#00C9A7",role:"Tech Lead",bio:"40 years in software architecture. Knows when to build and when to buy. Keeps the tech stack simple and reliable.",
    sys:CERTFLOW_CTX+"\n\nYou are Marcus, Dylan's Tech Lead advisor. 40 years software architecture. CertFlow stack: Node.js pipeline on Railway, Gmail API, Claude Sonnet API for parsing, pdf-lib for ACORD 25 generation, Google Sheets logging, React website on Vercel. You advise on: reliability (error monitoring, alerting), scalability (what breaks at 10 vs 50 clients), security (API keys, data handling), and architecture decisions. Keep it simple — Dylan is learning to code."},
  {id:"ai",name:"Nova",av:"AI",c:"#FF6B6B",role:"AI & Tools Advisor",bio:"Specializes in AI tools, automation, and efficiency. Knows every new tool, API, and framework. Helps Dylan leverage AI across all aspects of business and life.",
    sys:CERTFLOW_CTX+"\n\nYou are Nova, Dylan's AI & Tools Advisor. You are an expert on the latest AI tools, automation platforms, and efficiency systems. You advise on: which AI tools can save Dylan time (content generation, lead research, email automation), how to build the Engine Room vision (5-10 automated AI businesses), new tools and APIs as they emerge, prompt engineering, and how to maximize Claude's capabilities. You think in terms of automation and leverage — every manual task is a candidate for AI replacement. You're excited about the future and help Dylan see possibilities."},
];

// ═══ FINANCIAL DATA ═══
const INIT_FIN = {
  income:[{id:1,label:"Dylan Net",amount:6499.68},{id:2,label:"Chantel Net",amount:3020.90}],
  fixed:[{id:10,label:"Rent",amount:2200},{id:11,label:"Gas (Car)",amount:435},{id:12,label:"Groceries",amount:868},{id:13,label:"Investments",amount:190}],
  variable:[{id:20,label:"Expedition",amount:805},{id:21,label:"Truck",amount:451},{id:22,label:"Capital One CC",amount:327},{id:23,label:"AT&T",amount:293},{id:24,label:"Insurance",amount:250},{id:25,label:"Amazon CC",amount:194},{id:26,label:"Mission Lane-D",amount:180},{id:27,label:"Business CC",amount:176},{id:28,label:"Storage",amount:170},{id:29,label:"Nails",amount:165},{id:30,label:"Loan",amount:142},{id:31,label:"Affirm",amount:123},{id:32,label:"Mission Lane-C",amount:120},{id:33,label:"Dance",amount:110},{id:34,label:"Attorney",amount:78},{id:35,label:"Power",amount:76},{id:36,label:"School Lunch",amount:65},{id:37,label:"Jefferson Atty",amount:50},{id:38,label:"Cap One-C",amount:49},{id:39,label:"ADT",amount:47},{id:40,label:"Testosterone",amount:40},{id:41,label:"Savor CC",amount:40},{id:42,label:"Straight Talk",amount:38},{id:43,label:"Hulu+Disney",amount:36},{id:44,label:"Gas Bill",amount:29},{id:45,label:"Medical-C",amount:28},{id:46,label:"Netflix",amount:18},{id:47,label:"Apple Music",amount:17},{id:48,label:"Amazon Prime",amount:15},{id:49,label:"Crunchyroll",amount:8}],
  debt:[
    {id:60,label:"Deposit",total:683,monthly:0,priority:1,due:"",url:"",rate:"0%"},
    {id:61,label:"Dentist",total:1300,monthly:0,priority:2,due:"",url:"",rate:"0%"},
    {id:62,label:"Affirm",total:1703,monthly:123,priority:3,due:"15",url:"https://www.affirm.com/user/sign-in",rate:"31%"},
    {id:63,label:"1Mo Reserve",total:8000,monthly:0,priority:4,due:"",url:"",rate:"0%"},
    {id:64,label:"ML-Chantel",total:2743,monthly:120,priority:5,due:"",url:"https://portal.missionlane.com/",rate:"26%"},
    {id:65,label:"CapOne-Dylan",total:4031,monthly:180,priority:6,due:"",url:"https://www.capitalone.com/sign-in/",rate:"24%"},
    {id:66,label:"CapOne-Chantel",total:1082,monthly:49,priority:7,due:"",url:"https://www.capitalone.com/sign-in/",rate:"24%"},
    {id:67,label:"Amazon CC",total:4512,monthly:194,priority:8,due:"",url:"https://www.amazon.com/gp/payments",rate:"26%"},
    {id:68,label:"CapOne-D",total:7876,monthly:327,priority:9,due:"",url:"https://www.capitalone.com/sign-in/",rate:"24%"},
    {id:69,label:"Savor CC",total:393,monthly:40,priority:10,due:"",url:"https://www.capitalone.com/sign-in/",rate:"27%"},
    {id:70,label:"Biz CC",total:4829,monthly:179,priority:11,due:"",url:"https://www.capitalone.com/sign-in/",rate:"18%"},
    {id:71,label:"Loan",total:2985,monthly:142,priority:12,due:"",url:"",rate:"16%"},
    {id:72,label:"Expedition",total:47901,monthly:805,priority:13,due:"",url:"https://www.goldenwestcu.com/",rate:"7.6%"},
    {id:73,label:"Truck",total:20520,monthly:451,priority:14,due:"",url:"https://www.goldenwestcu.com/",rate:"7.7%"},
    {id:74,label:"Student",total:7030,monthly:0,priority:15,due:"",url:"https://studentaid.gov/",rate:"5.5%"},
    {id:75,label:"Medical-C",total:332,monthly:25,priority:16,due:"",url:"",rate:"0%"},
    {id:76,label:"Attorneys",total:2640,monthly:75,priority:17,due:"",url:"",rate:"0%"},
    {id:77,label:"Jeff Atty",total:6120,monthly:50,priority:18,due:"",url:"",rate:"0%"},
  ],
};

// ═══ CRM DATA ═══
const INIT_CRM = [
  {id:1,name:"Blayne Jacobson",agency:"Unknown",city:"Utah",method:"Facebook",status:"demo_scheduled",contacted:"2026-03-08",lastContact:"2026-03-09",followUp:"2026-03-10",notes:"Connect Utah group. Zoom demo this week. Objection: most agencies have AMS already."},
  {id:2,name:"Caleb Shepard",agency:"W Insurance Group",city:"Unknown",method:"Text",status:"contacted",contacted:"2026-03-09",lastContact:"2026-03-09",followUp:"2026-03-11",notes:"Hotshot Trucking FB group. Texted, read but no response. Follow up Tuesday."},
  {id:3,name:"Tristan's Intro",agency:"Father-son agency",city:"Utah",method:"In-person",status:"new",contacted:"",lastContact:"",followUp:"2026-03-10",notes:"Tristan connecting from church. Expected intro Sunday 3/9."},
  {id:4,name:"Paul (Chantel's boss)",agency:"P&C Agency",city:"Utah",method:"In-person",status:"new",contacted:"",lastContact:"",followUp:"2026-03-11",notes:"Chantel's boss. Said 'that would help us.' Ask Chantel to facilitate intro."},
];

// ═══ BLOG POST BANK ═══
const INIT_BLOG = [
  {id:1,title:"The 15 COI Edge Cases That Trip Up Every Insurance Agency",status:"ready",keywords:"COI edge cases, insurance certificate errors",scheduled:"2026-03-11"},
  {id:2,title:"Why Small Insurance Agencies Are Outsourcing COI Processing in 2026",status:"ready",keywords:"COI outsourcing, certificate processing automation",scheduled:"2026-03-13"},
  {id:3,title:"Trucking Insurance COI Processing: What Every Agency Needs to Know",status:"ready",keywords:"trucking COI, trucking certificate of insurance",scheduled:"2026-03-18"},
  {id:4,title:"How to Fill Out an ACORD 25: A Field-by-Field Guide",status:"ready",keywords:"ACORD 25 guide, certificate of liability insurance form",scheduled:"2026-03-20"},
  {id:5,title:"How Certificate Errors Lead to E&O Claims",status:"ready",keywords:"E&O claims certificates, insurance certificate errors",scheduled:"2026-03-25"},
  {id:6,title:"Progressive vs Canal vs Great West: Carrier Quirks",status:"queued",keywords:"Progressive trucking insurance, carrier-specific COI",scheduled:"2026-03-27"},
  {id:7,title:"What Freight Brokers Look For When Reviewing a COI",status:"queued",keywords:"freight broker COI requirements",scheduled:"2026-04-01"},
  {id:8,title:"The Real Cost of Manual COI Processing",status:"queued",keywords:"COI processing cost, manual certificate processing",scheduled:"2026-04-03"},
  {id:9,title:"MCS-90 Explained: What It Is and What It Isn't",status:"queued",keywords:"MCS-90 endorsement explained",scheduled:"2026-04-08"},
  {id:10,title:"Additional Insured vs Loss Payee: The Difference",status:"queued",keywords:"additional insured vs loss payee",scheduled:"2026-04-10"},
];

// ═══ ROADMAP MILESTONES ═══
const MILESTONES = [
  {id:1,label:"Pipeline Built",date:"2026-03-06",done:true,phase:"now"},
  {id:2,label:"Website Live (certflo.io)",date:"2026-03-08",done:true,phase:"now"},
  {id:3,label:"Batch Certs Working",date:"2026-03-09",done:true,phase:"now"},
  {id:4,label:"Calendly Connected",date:"2026-03-09",done:true,phase:"now"},
  {id:5,label:"File LLC",date:"2026-03-10",done:false,phase:"now"},
  {id:6,label:"First Demo (Blayne)",date:"2026-03-12",done:false,phase:"now"},
  {id:7,label:"First Blog Post Published",date:"2026-03-11",done:false,phase:"now"},
  {id:8,label:"E&O Insurance",date:"2026-03-15",done:false,phase:"now"},
  {id:9,label:"MSA Drafted",date:"2026-03-15",done:false,phase:"now"},
  {id:10,label:"FIRST PAYING CLIENT",date:"2026-04-09",done:false,phase:"30day"},
  {id:11,label:"3 Clients ($897/mo)",date:"2026-06-01",done:false,phase:"6mo"},
  {id:12,label:"10 Clients ($2,990/mo)",date:"2026-12-01",done:false,phase:"1yr"},
  {id:13,label:"Quit Trucking",date:"2027-06-01",done:false,phase:"2yr"},
  {id:14,label:"50 Clients ($14,950/mo)",date:"2028-03-01",done:false,phase:"3yr"},
  {id:15,label:"Machine 2 Launched",date:"2028-06-01",done:false,phase:"3yr"},
  {id:16,label:"Architecture School",date:"2030-01-01",done:false,phase:"5yr"},
  {id:17,label:"5 Machines Running",date:"2031-01-01",done:false,phase:"5yr"},
  {id:18,label:"First Building Designed",date:"2033-01-01",done:false,phase:"10yr"},
  {id:19,label:"Georgia Property",date:"2038-01-01",done:false,phase:"15yr"},
  {id:20,label:"Foundation Launched",date:"2041-01-01",done:false,phase:"20yr"},
  {id:21,label:"Full Vision: Architecture + Engine Room + Legacy",date:"2046-01-01",done:false,phase:"20yr"},
];


// ═══ LOCK SCREEN ═══
function Lock({onUnlock}) {
  const [pw,setPw]=useState(""); const [shake,setShake]=useState(false); const [att,setAtt]=useState(0);
  const go=()=>{if(pw===PW){onUnlock();return;}setShake(true);setTimeout(()=>setShake(false),400);setPw("");setAtt(a=>a+1);};
  return (
    <div style={{minHeight:"100vh",background:"#060A12",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{fontSize:52,fontWeight:900,color:"#E8A020",fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:6,marginBottom:4}}>CERTFLOW</div>
      <div style={{fontSize:14,color:"#445",letterSpacing:6,fontFamily:"monospace",marginBottom:40}}>COMMAND CENTER v3</div>
      <div style={{transform:shake?"translateX(8px)":"none",transition:"transform 0.05s",width:300}}>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(232,160,32,0.18)",borderRadius:16,padding:28}}>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Password" autoFocus
            style={{width:"100%",background:"rgba(232,160,32,0.05)",border:"1px solid rgba(232,160,32,0.2)",borderRadius:8,padding:"12px 14px",color:"#e0d0a0",fontSize:18,fontFamily:"monospace",outline:"none",marginBottom:10,letterSpacing:4,boxSizing:"border-box"}} />
          <button onClick={go} style={{width:"100%",padding:"11px",background:"linear-gradient(135deg,#B8860B,#E8A020)",borderRadius:8,border:"none",color:"#060A12",fontSize:16,fontWeight:700,fontFamily:"monospace",letterSpacing:3,cursor:"pointer"}}>UNLOCK</button>
          {att>=3&&<div style={{textAlign:"center",marginTop:8,fontSize:14,color:"#C0392B",fontFamily:"monospace"}}>certflow2024</div>}
        </div>
      </div>
    </div>
  );
}

// ═══ ADVISOR CHAT (1-on-1) ═══
function AdvisorChat({advisor}) {
  const [msgs,setMsgs]=useState([]); const [inp,setInp]=useState(""); const [ld,setLd]=useState(false); const ref=useRef();
  useEffect(()=>{ref.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{setMsgs([]);},[advisor.id]);

  const send=async()=>{
    if(!inp.trim()||ld)return;
    const t=inp.trim(); setInp(""); setLd(true);
    const userMsg={id:Date.now(),role:"user",text:t};
    setMsgs(p=>[...p,userMsg]);
    const history=msgs.map(m=>m.role==="user"?`Dylan: ${m.text}`:`${advisor.name}: ${m.text}`).join("\n");
    const raw=await api(advisor.sys, history?history+"\nDylan: "+t:"Dylan: "+t, 1200);
    setMsgs(p=>[...p,{id:Date.now()+1,role:"assistant",text:raw}]);
    setLd(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"14px 18px",borderBottom:"1px solid "+advisor.c+"22",background:advisor.c+"08",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:advisor.c+"22",border:"2px solid "+advisor.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:advisor.av.length>1?11:16,fontWeight:900,color:advisor.c,fontFamily:"monospace"}}>{advisor.av}</div>
          <div>
            <div style={{fontSize:19,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>{advisor.name} <span style={{fontSize:15,color:advisor.c,fontFamily:"monospace"}}>{advisor.role}</span></div>
            <div style={{fontSize:14,color:"#556",fontFamily:"monospace",marginTop:2}}>{advisor.bio.substring(0,80)}...</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
        {msgs.length===0&&!ld&&(
          <div style={{textAlign:"center",padding:"60px 20px",color:"#334"}}>
            <div style={{fontSize:40,marginBottom:12}}>{advisor.id==="ai"?"🤖":"💼"}</div>
            <div style={{fontSize:17,color:advisor.c,fontFamily:"'Playfair Display',Georgia,serif"}}>Ask {advisor.name} anything</div>
            <div style={{fontSize:14,color:"#445",fontFamily:"monospace",marginTop:6}}>{advisor.role}</div>
          </div>
        )}
        {msgs.map(m=>(
          m.role==="user"?(
            <div key={m.id} style={{display:"flex",justifyContent:"flex-end"}}>
              <div style={{maxWidth:"75%",background:"rgba(232,160,32,0.08)",border:"1px solid rgba(232,160,32,0.2)",borderRadius:"14px 4px 14px 14px",padding:"10px 14px",fontSize:17,color:"#e0d0a0",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>{m.text}</div>
            </div>
          ):(
            <div key={m.id} style={{display:"flex",gap:10}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:advisor.c+"22",border:"2px solid "+advisor.c+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:advisor.av.length>1?7:10,fontWeight:900,color:advisor.c,fontFamily:"monospace",flexShrink:0,marginTop:2}}>{advisor.av}</div>
              <div style={{maxWidth:"80%",background:"rgba(255,255,255,0.025)",border:"1px solid "+advisor.c+"18",borderRadius:"4px 14px 14px 14px",padding:"10px 14px",fontSize:17,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>
          )
        ))}
        {ld&&<div style={{fontSize:15,color:advisor.c,fontFamily:"monospace",padding:8}}>{advisor.name} is thinking...</div>}
        <div ref={ref}/>
      </div>
      <div style={{padding:"12px 18px",borderTop:"1px solid "+advisor.c+"15",background:"rgba(0,0,0,0.25)",flexShrink:0}}>
        <div style={{display:"flex",gap:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={"Ask "+advisor.name+"..."}
            style={{flex:1,background:advisor.c+"08",border:"1px solid "+advisor.c+"20",borderRadius:10,padding:"10px 14px",color:"#e0d0a0",fontSize:17,fontFamily:"'DM Sans',sans-serif",outline:"none"}} />
          <button onClick={send} disabled={ld||!inp.trim()} style={{padding:"10px 16px",borderRadius:10,background:inp.trim()&&!ld?"linear-gradient(135deg,#B8860B,#E8A020)":"rgba(255,255,255,0.04)",border:"none",color:inp.trim()&&!ld?"#060A12":"#556",fontSize:16,fontWeight:700,fontFamily:"monospace",cursor:inp.trim()&&!ld?"pointer":"not-allowed"}}>▶</button>
        </div>
      </div>
    </div>
  );
}

// ═══ ADVISORS TAB ═══
function AdvisorsTab() {
  const [sel,setSel]=useState(ADVISORS[0].id);
  const advisor=ADVISORS.find(a=>a.id===sel)||ADVISORS[0];
  return (
    <div style={{display:"flex",height:"100%",overflow:"hidden"}}>
      <div style={{width:80,background:"rgba(0,0,0,0.3)",borderRight:"1px solid rgba(232,160,32,0.08)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",padding:"6px 4px",gap:4}}>
        {ADVISORS.map(a=>{const s=a.id===sel;return(
          <div key={a.id} onClick={()=>setSel(a.id)} style={{padding:"8px 4px",borderRadius:8,cursor:"pointer",background:s?a.c+"15":"transparent",border:s?"1px solid "+a.c+"40":"1px solid transparent",textAlign:"center",transition:"all 0.15s"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:a.c+"22",border:"2px solid "+(s?a.c:a.c+"44"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:a.av.length>1?9:13,fontWeight:900,color:a.c,fontFamily:"monospace",margin:"0 auto 4px"}}>{a.av}</div>
            <div style={{fontSize:11,fontWeight:700,color:s?a.c:"#556",fontFamily:"monospace"}}>{a.name}</div>
          </div>
        );})}
      </div>
      <div style={{flex:1,overflow:"hidden"}}><AdvisorChat advisor={advisor} /></div>
    </div>
  );
}


// ═══ CRM TAB ═══
function CRMTab({leads,setLeads}) {
  const [sel,setSel]=useState(null);
  const statuses=[
    {id:"new",label:"NEW",c:"#556"},
    {id:"contacted",label:"CONTACTED",c:"#2E86C1"},
    {id:"demo_scheduled",label:"DEMO",c:"#E8A020"},
    {id:"demo_done",label:"DEMOED",c:"#8E44AD"},
    {id:"negotiating",label:"NEGOTIATING",c:"#FF6B6B"},
    {id:"closed",label:"CLOSED",c:"#1A8A4A"},
    {id:"dead",label:"DEAD",c:"#333"},
  ];
  const add=()=>{setLeads(p=>[...p,{id:Date.now(),name:"New Lead",agency:"",city:"",method:"",status:"new",contacted:"",lastContact:"",followUp:"",notes:""}]);};
  const upd=(id,f,v)=>setLeads(p=>p.map(l=>l.id===id?{...l,[f]:v}:l));
  const del=(id)=>setLeads(p=>p.filter(l=>l.id!==id));

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(232,160,32,0.1)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div><div style={{fontSize:20,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>Sales Pipeline</div>
        <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>{leads.length} leads • {leads.filter(l=>l.status==="closed").length} closed</div></div>
        <button onClick={add} style={{padding:"6px 14px",borderRadius:8,background:"rgba(232,160,32,0.1)",border:"1px solid rgba(232,160,32,0.3)",color:"#E8A020",fontSize:14,fontFamily:"monospace",cursor:"pointer"}}>+ ADD LEAD</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 18px"}}>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {statuses.map(s=>{const count=leads.filter(l=>l.status===s.id).length;return(
            <div key={s.id} style={{padding:"4px 10px",borderRadius:6,background:s.c+"15",border:"1px solid "+s.c+"30",fontSize:13,fontFamily:"monospace",color:s.c}}>{s.label} ({count})</div>
          );})}
        </div>
        {leads.map(l=>{const st=statuses.find(s=>s.id===l.status)||statuses[0];const open=sel===l.id;return(
          <div key={l.id} onClick={()=>setSel(open?null:l.id)} style={{marginBottom:6,background:open?st.c+"08":"rgba(255,255,255,0.015)",border:"1px solid "+(open?st.c+"30":"rgba(255,255,255,0.06)"),borderRadius:10,padding:"12px 14px",cursor:"pointer",borderLeft:"3px solid "+st.c}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:17,fontWeight:600,color:"#e0d8c8",fontFamily:"'DM Sans',sans-serif"}}>{l.name}</div>
              <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>{l.agency||"No agency"} • {l.city||"?"}</div></div>
              <div style={{padding:"3px 8px",borderRadius:5,background:st.c+"18",border:"1px solid "+st.c+"30",fontSize:12,color:st.c,fontFamily:"monospace"}}>{st.label}</div>
            </div>
            {open&&(
              <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  {[["name","Name"],["agency","Agency"],["city","City"],["method","Method"]].map(([k,lbl])=>(
                    <div key={k}><div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>{lbl}</div>
                    <input value={l[k]} onChange={e=>upd(l.id,k,e.target.value)} onClick={e=>e.stopPropagation()} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 8px",color:"#c8c0b0",fontSize:15,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}} /></div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>Status</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {statuses.map(s=>(
                      <button key={s.id} onClick={e=>{e.stopPropagation();upd(l.id,"status",s.id);}} style={{padding:"4px 8px",borderRadius:5,background:l.status===s.id?s.c+"25":"rgba(255,255,255,0.03)",border:"1px solid "+(l.status===s.id?s.c+"50":"rgba(255,255,255,0.08)"),color:l.status===s.id?s.c:"#556",fontSize:12,fontFamily:"monospace",cursor:"pointer"}}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {[["contacted","First Contact"],["lastContact","Last Contact"],["followUp","Follow Up"]].map(([k,lbl])=>(
                    <div key={k}><div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>{lbl}</div>
                    <input type="date" value={l[k]} onChange={e=>upd(l.id,k,e.target.value)} onClick={e=>e.stopPropagation()} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"5px 6px",color:"#c8c0b0",fontSize:14,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}} /></div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>Notes</div>
                  <textarea value={l.notes} onChange={e=>upd(l.id,"notes",e.target.value)} onClick={e=>e.stopPropagation()} rows={2} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,padding:"6px 8px",color:"#c8c0b0",fontSize:15,fontFamily:"monospace",outline:"none",resize:"vertical",boxSizing:"border-box"}} />
                </div>
                <button onClick={e=>{e.stopPropagation();del(l.id);}} style={{padding:"4px 10px",borderRadius:5,background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.2)",color:"#C0392B",fontSize:13,fontFamily:"monospace",cursor:"pointer"}}>DELETE</button>
              </div>
            )}
          </div>
        );})}
      </div>
    </div>
  );
}

// ═══ FINANCES TAB ═══
function FinanceTab({data,setData}) {
  const [sec,setSec]=useState("overview");
  const upd=(s,id,f,v)=>setData(p=>({...p,[s]:p[s].map(i=>i.id===id?{...i,[f]:v}:i)}));
  const add=(s)=>{const id=Date.now();setData(p=>({...p,[s]:[...p[s],s==="debt"?{id,label:"New",total:0,monthly:0,priority:p.debt.length+1,due:"",url:"",rate:"0%"}:{id,label:"New",amount:0}]}));};
  const del=(s,id)=>setData(p=>({...p,[s]:p[s].filter(i=>i.id!==id)}));
  const net=data.income.reduce((a,i)=>a+i.amount,0);
  const exp=data.fixed.reduce((a,i)=>a+i.amount,0)+data.variable.reduce((a,i)=>a+i.amount,0);
  const sur=net-exp;const debt=data.debt.reduce((a,i)=>a+i.total,0);
  const monthlyDebt=data.debt.reduce((a,d)=>a+d.monthly,0);

  const ItemRow=({item,section,color})=>(
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
      <input value={item.label} onChange={e=>upd(section,item.id,"label",e.target.value)} style={{flex:1,background:"transparent",border:"none",color:"#c8c0b0",fontSize:16,fontFamily:"'DM Sans',sans-serif",outline:"none",minWidth:0}} />
      <div style={{display:"flex",alignItems:"center",gap:2}}>
        <span style={{fontSize:15,color:"#556",fontFamily:"monospace"}}>$</span>
        <input value={item.amount} onChange={e=>upd(section,item.id,"amount",toNum(e.target.value))} style={{width:75,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:5,padding:"5px 8px",color:color,fontSize:16,fontFamily:"monospace",outline:"none",textAlign:"right"}} />
      </div>
      <button onClick={()=>del(section,item.id)} style={{background:"none",border:"none",color:"#C0392B",cursor:"pointer",fontSize:20,opacity:0.3,lineHeight:1}}>×</button>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"8px 14px",borderBottom:"1px solid rgba(232,160,32,0.1)",display:"flex",gap:4,background:"rgba(0,0,0,0.2)",flexShrink:0,flexWrap:"wrap"}}>
        {[["overview","📊 Overview"],["income","💰 Income"],["fixed","🏠 Fixed"],["variable","💳 Variable"],["debt","📉 Debt"],["spending","🔍 Spending"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSec(id)} style={{padding:"6px 12px",borderRadius:7,background:sec===id?"rgba(232,160,32,0.14)":"transparent",border:sec===id?"1px solid rgba(232,160,32,0.36)":"1px solid transparent",color:sec===id?"#E8A020":"#556",fontSize:14,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:sec===id?600:400}}>{lbl}</button>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
        {sec==="overview"&&(<div>
          <div style={{fontSize:22,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:6}}>Financial Dashboard</div>
          <div style={{fontSize:14,color:"#556",fontFamily:"monospace",marginBottom:16}}>Brown Household • Mountain America CU</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
            {[{l:"MONTHLY INCOME",v:net,c:"#1A8A4A"},{l:"MONTHLY EXPENSES",v:exp,c:"#C0392B"},{l:"MONTHLY SURPLUS",v:sur,c:sur>=0?"#E8A020":"#C0392B"},{l:"TOTAL DEBT",v:debt,c:"#8E44AD"}].map(x=>(
              <div key={x.l} style={{background:x.c+"0c",border:"1px solid "+x.c+"25",borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:12,color:x.c,letterSpacing:2,fontFamily:"monospace",marginBottom:8}}>{x.l}</div>
                <div style={{fontSize:26,fontWeight:800,color:x.c,fontFamily:"monospace"}}>{f$(x.v)}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:17,fontWeight:700,color:"#E8A020",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:10}}>CertFlow Revenue Impact</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[{l:"TODAY",clients:0},{l:"2 CLIENTS",clients:2},{l:"5 CLIENTS",clients:5},{l:"10 CLIENTS",clients:10}].map(x=>{
              const rev=x.clients*299;const s2=sur+rev;const c=s2>=0?"#1A8A4A":"#C0392B";return(
              <div key={x.l} style={{background:c+"0a",border:"1px solid "+c+"25",borderRadius:10,padding:"14px 12px",textAlign:"center"}}>
                <div style={{fontSize:12,color:x.clients===0?"#556":"#E8A020",letterSpacing:1,fontFamily:"monospace",fontWeight:700,marginBottom:6}}>{x.l}</div>
                <div style={{fontSize:22,fontWeight:900,color:c,fontFamily:"monospace"}}>{f$(s2)}</div>
                <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginTop:3}}>/month</div>
                {x.clients>0&&<div style={{fontSize:12,color:"#E8A020",fontFamily:"monospace",marginTop:4}}>+{f$(rev)} revenue</div>}
              </div>);
            })}
          </div>
          <div style={{marginTop:16,padding:"12px 16px",background:"rgba(232,160,32,0.06)",border:"1px solid rgba(232,160,32,0.15)",borderRadius:10}}>
            <div style={{fontSize:15,color:"#E8A020",fontFamily:"'DM Sans',sans-serif",lineHeight:1.7}}>
              {sur>=0?"You're in the green! Every CertFlow client adds pure surplus.":
              `You need ${Math.ceil(Math.abs(sur)/299)} CertFlow clients at $299/mo to break even. That's ${Math.ceil(Math.abs(sur)/299)} agencies saying yes.`}
            </div>
          </div>
        </div>)}

        {["income","fixed","variable"].map(s=>sec!==s?null:(<div key={s}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>{s==="income"?"Income":s==="fixed"?"Fixed Expenses":"Variable Expenses"}</div>
              <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>{s==="income"?"Monthly household income":"Monthly "+s+" costs"}</div>
            </div>
            <button onClick={()=>add(s)} style={{background:"rgba(232,160,32,0.1)",border:"1px solid rgba(232,160,32,0.3)",borderRadius:7,padding:"6px 14px",color:"#E8A020",fontSize:14,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600}}>+ Add</button>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,overflow:"hidden"}}>
            {data[s].map(item=><ItemRow key={item.id} item={item} section={s} color={s==="income"?"#1A8A4A":"#C0392B"} />)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,padding:"0 4px"}}>
            <div style={{fontSize:15,color:"#556",fontFamily:"monospace"}}>{data[s].length} items</div>
            <div style={{fontSize:16,fontWeight:700,color:s==="income"?"#1A8A4A":"#C0392B",fontFamily:"monospace"}}>Total: {f$(data[s].reduce((a,i)=>a+i.amount,0))}</div>
          </div>
        </div>))}

        {sec==="debt"&&(<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>Debt Payoff</div>
              <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>Avalanche method — highest interest first</div>
            </div>
            <button onClick={()=>{const id=Date.now();setData(p=>({...p,debt:[...p.debt,{id,label:"New",total:0,monthly:0,priority:p.debt.length+1,due:"",url:"",rate:"0%"}]}));}} style={{background:"rgba(142,68,173,0.1)",border:"1px solid rgba(142,68,173,0.3)",borderRadius:7,padding:"6px 14px",color:"#8E44AD",fontSize:14,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600}}>+ Add</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[...data.debt].sort((a,b)=>a.priority-b.priority).map(d=>{
              const rateNum=parseFloat(d.rate)||0;
              const rateColor=rateNum>=25?"#C0392B":rateNum>=15?"#E8A020":rateNum>=5?"#2E86C1":"#1A8A4A";
              const moLeft=d.monthly>0?Math.ceil(d.total/d.monthly):0;
              return(
              <div key={d.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(142,68,173,0.12)",borderRadius:10,padding:"12px 14px",borderLeft:"3px solid "+rateColor}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                    <div style={{fontSize:14,color:"#445",fontFamily:"monospace",width:16}}>{d.priority}</div>
                    <input value={d.label} onChange={e=>upd("debt",d.id,"label",e.target.value)} style={{background:"transparent",border:"none",color:"#c8c0b0",fontSize:17,fontFamily:"'DM Sans',sans-serif",fontWeight:600,outline:"none",flex:1}} />
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{padding:"2px 6px",borderRadius:4,background:rateColor+"18",fontSize:13,color:rateColor,fontFamily:"monospace",fontWeight:700}}>{d.rate||"0%"}</div>
                    {d.url&&<a href={d.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{padding:"4px 10px",borderRadius:6,background:"rgba(26,138,74,0.12)",border:"1px solid rgba(26,138,74,0.3)",color:"#1A8A4A",fontSize:13,fontFamily:"'DM Sans',sans-serif",textDecoration:"none",fontWeight:700,cursor:"pointer"}}>PAY NOW ↗</a>}
                    <button onClick={()=>del("debt",d.id)} style={{background:"none",border:"none",color:"#C0392B",cursor:"pointer",fontSize:20,opacity:0.3}}>×</button>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>BALANCE</div>
                    <div style={{display:"flex",alignItems:"center",gap:2}}>
                      <span style={{fontSize:14,color:"#556"}}>$</span>
                      <input value={d.total} onChange={e=>upd("debt",d.id,"total",toNum(e.target.value))} style={{width:"100%",background:"rgba(142,68,173,0.06)",border:"1px solid rgba(142,68,173,0.15)",borderRadius:5,padding:"5px 6px",color:"#a880d0",fontSize:16,fontFamily:"monospace",outline:"none",textAlign:"right",boxSizing:"border-box"}} />
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>PAYMENT</div>
                    <div style={{display:"flex",alignItems:"center",gap:2}}>
                      <span style={{fontSize:14,color:"#556"}}>$</span>
                      <input value={d.monthly} onChange={e=>upd("debt",d.id,"monthly",toNum(e.target.value))} style={{width:"100%",background:"rgba(142,68,173,0.06)",border:"1px solid rgba(142,68,173,0.15)",borderRadius:5,padding:"5px 6px",color:"#c8a0e0",fontSize:16,fontFamily:"monospace",outline:"none",textAlign:"right",boxSizing:"border-box"}} />
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>DUE DAY</div>
                    <input value={d.due||""} onChange={e=>upd("debt",d.id,"due",e.target.value)} placeholder="15th" style={{width:"100%",background:"rgba(232,160,32,0.06)",border:"1px solid rgba(232,160,32,0.15)",borderRadius:5,padding:"5px 6px",color:"#E8A020",fontSize:16,fontFamily:"monospace",outline:"none",textAlign:"center",boxSizing:"border-box"}} />
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>RATE</div>
                    <input value={d.rate||""} onChange={e=>upd("debt",d.id,"rate",e.target.value)} placeholder="0%" style={{width:"100%",background:rateColor+"0a",border:"1px solid "+rateColor+"20",borderRadius:5,padding:"5px 6px",color:rateColor,fontSize:16,fontFamily:"monospace",outline:"none",textAlign:"center",boxSizing:"border-box"}} />
                  </div>
                </div>
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:12,color:"#556",fontFamily:"monospace",marginBottom:3}}>PAYMENT LINK</div>
                  <input value={d.url||""} onChange={e=>upd("debt",d.id,"url",e.target.value)} placeholder="https://..." style={{width:"100%",background:"rgba(26,138,74,0.04)",border:"1px solid rgba(26,138,74,0.12)",borderRadius:5,padding:"5px 8px",color:"#1A8A4A",fontSize:14,fontFamily:"monospace",outline:"none",boxSizing:"border-box"}} />
                </div>
                {d.monthly>0&&<div style={{marginTop:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{fontSize:13,color:"#556",fontFamily:"monospace"}}>{moLeft} months left</div>
                    <div style={{fontSize:13,color:rateColor,fontFamily:"monospace",fontWeight:600}}>{f$(d.total)} remaining</div>
                  </div>
                  <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:Math.max(3,100-Math.min(moLeft*1.5,100))+"%",background:"linear-gradient(90deg,#1A8A4A,"+rateColor+")",borderRadius:3,transition:"width 0.3s"}} />
                  </div>
                </div>}
              </div>
            );})}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14,padding:"12px 16px",background:"rgba(142,68,173,0.06)",border:"1px solid rgba(142,68,173,0.15)",borderRadius:10}}>
            <div><div style={{fontSize:12,color:"#8E44AD",fontFamily:"monospace",letterSpacing:1}}>TOTAL DEBT</div><div style={{fontSize:20,fontWeight:800,color:"#8E44AD",fontFamily:"monospace"}}>{f$(debt)}</div></div>
            <div><div style={{fontSize:12,color:"#C0392B",fontFamily:"monospace",letterSpacing:1}}>MONTHLY PAYMENTS</div><div style={{fontSize:20,fontWeight:800,color:"#C0392B",fontFamily:"monospace"}}>{f$(monthlyDebt)}</div></div>
            <div><div style={{fontSize:12,color:"#E8A020",fontFamily:"monospace",letterSpacing:1}}>DEBT-FREE IN</div><div style={{fontSize:20,fontWeight:800,color:"#E8A020",fontFamily:"monospace"}}>{monthlyDebt>0?Math.ceil(debt/monthlyDebt)+"mo":"∞"}</div></div>
          </div>
        </div>)}

        {sec==="spending"&&(<div>
          <div style={{fontSize:20,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:6}}>Spending Analysis</div>
          <div style={{fontSize:14,color:"#556",fontFamily:"monospace",marginBottom:16}}>Based on 7 months MACU bank data (Sep 2025 - Mar 2026)</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
            {[{l:"AVG INCOME",v:12767,c:"#1A8A4A"},{l:"AVG EXPENSES",v:13088,c:"#C0392B"},{l:"AVG NET",v:-321,c:"#C0392B"}].map(x=>(
              <div key={x.l} style={{background:x.c+"0c",border:"1px solid "+x.c+"25",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                <div style={{fontSize:12,color:x.c,letterSpacing:1,fontFamily:"monospace",marginBottom:6}}>{x.l}</div>
                <div style={{fontSize:22,fontWeight:800,color:x.c,fontFamily:"monospace"}}>{f$(x.v)}</div>
                <div style={{fontSize:12,color:"#445",fontFamily:"monospace",marginTop:2}}>/month avg</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:17,fontWeight:700,color:"#E8A020",fontFamily:"'Playfair Display',Georgia,serif",marginBottom:10}}>Where the Money Goes</div>
          {[
            {cat:"Rent (Orchard Cove)",amt:1890,c:"#8E44AD"},
            {cat:"Vehicle Payments (Golden West)",amt:1256,c:"#2E86C1"},
            {cat:"Groceries (WinCo/Walmart/Harmons)",amt:690,c:"#00C9A7"},
            {cat:"Online Services & Subscriptions",amt:352,c:"#E8A020"},
            {cat:"Amazon Shopping",amt:311,c:"#FF6B6B"},
            {cat:"Restaurants & Dining",amt:278,c:"#C0392B"},
            {cat:"Insurance (Progressive etc)",amt:222,c:"#2E86C1"},
            {cat:"Healthcare & Pharmacy",amt:212,c:"#1A8A4A"},
            {cat:"Phone (AT&T/Straight Talk)",amt:160,c:"#8E44AD"},
            {cat:"Gas (Chevron etc)",amt:133,c:"#E8A020"},
            {cat:"Entertainment",amt:169,c:"#FF6B6B"},
            {cat:"Automotive Expenses",amt:116,c:"#00C9A7"},
          ].map(x=>{const pct=((x.amt/13088)*100);return(
            <div key={x.cat} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{flex:1,fontSize:16,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif"}}>{x.cat}</div>
              <div style={{width:120,height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:Math.min(pct*2,100)+"%",background:x.c,borderRadius:3}} />
              </div>
              <div style={{fontSize:16,fontWeight:700,color:x.c,fontFamily:"monospace",width:70,textAlign:"right"}}>{f$(x.amt)}</div>
              <div style={{fontSize:13,color:"#556",fontFamily:"monospace",width:35,textAlign:"right"}}>{pct.toFixed(1)}%</div>
            </div>
          );})}
          <div style={{marginTop:18,padding:"14px 16px",background:"rgba(232,160,32,0.06)",border:"1px solid rgba(232,160,32,0.15)",borderRadius:10}}>
            <div style={{fontSize:16,fontWeight:700,color:"#E8A020",fontFamily:"'DM Sans',sans-serif",marginBottom:6}}>Quick Win Targets</div>
            <div style={{fontSize:15,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif",lineHeight:1.8}}>
              Cut Amazon by 50% → save $155/mo<br/>
              Cut dining by 50% → save $139/mo<br/>
              Review subscriptions → save $100-150/mo<br/>
              <span style={{color:"#1A8A4A",fontWeight:600}}>Total potential savings: $394-444/mo — that's 1.5 CertFlow clients worth</span>
            </div>
          </div>
        </div>)}
      </div>
    </div>
  );
}


// ═══ ROADMAP TAB ═══
function RoadmapTab({milestones,setMilestones}) {
  const phases=[
    {id:"now",label:"THIS WEEK",c:"#E8A020"},
    {id:"30day",label:"30 DAYS",c:"#FF6B6B"},
    {id:"6mo",label:"6 MONTHS",c:"#2E86C1"},
    {id:"1yr",label:"YEAR 1",c:"#00C9A7"},
    {id:"2yr",label:"YEAR 2",c:"#8E44AD"},
    {id:"3yr",label:"YEAR 3",c:"#C0392B"},
    {id:"5yr",label:"5 YEARS",c:"#1A8A4A"},
    {id:"10yr",label:"10 YEARS",c:"#E8A020"},
    {id:"15yr",label:"15 YEARS",c:"#2E86C1"},
    {id:"20yr",label:"20 YEARS",c:"#FF6B6B"},
  ];
  const toggle=(id)=>setMilestones(p=>p.map(m=>m.id===id?{...m,done:!m.done}:m));
  const total=milestones.length;const done=milestones.filter(m=>m.done).length;
  return (
    <div style={{height:"100%",overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{fontSize:22,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>The Road to 2046</div>
        <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>Dylan Brown • Age 33 → 53</div></div>
        <div style={{fontSize:16,color:"#E8A020",fontFamily:"monospace",fontWeight:700}}>{done}/{total}</div>
      </div>
      <div style={{position:"relative",paddingLeft:24}}>
        <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:"rgba(232,160,32,0.12)"}} />
        {phases.map(phase=>{
          const items=milestones.filter(m=>m.phase===phase.id);
          if(items.length===0)return null;
          return(
            <div key={phase.id} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,marginLeft:-18}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:phase.c+"30",border:"2px solid "+phase.c,zIndex:1}} />
                <div style={{fontSize:15,fontWeight:700,color:phase.c,fontFamily:"monospace",letterSpacing:2}}>{phase.label}</div>
              </div>
              {items.map(m=>(
                <div key={m.id} onClick={()=>toggle(m.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:4,marginLeft:4,background:m.done?"rgba(26,138,74,0.06)":"rgba(255,255,255,0.015)",border:"1px solid "+(m.done?"rgba(26,138,74,0.2)":"rgba(255,255,255,0.06)"),borderRadius:8,cursor:"pointer"}}>
                  <div style={{width:18,height:18,borderRadius:4,border:m.done?"2px solid #1A8A4A":"2px solid rgba(255,255,255,0.15)",background:m.done?"#1A8A4A20":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#1A8A4A",flexShrink:0}}>{m.done?"✓":""}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,color:m.done?"#1A8A4A":"#c8c0b0",fontFamily:"'DM Sans',sans-serif",fontWeight:m.done?400:600,textDecoration:m.done?"line-through":"none"}}>{m.label}</div>
                  </div>
                  <div style={{fontSize:13,color:"#556",fontFamily:"monospace"}}>{m.date}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══ CONTENT ENGINE TAB ═══
function ContentTab({posts,setPosts}) {
  const statusC={ready:"#1A8A4A",queued:"#E8A020",published:"#2E86C1",draft:"#556"};
  const toggle=(id)=>setPosts(p=>p.map(b=>b.id===id?{...b,status:b.status==="ready"?"published":b.status==="queued"?"ready":b.status}:b));
  return (
    <div style={{height:"100%",overflowY:"auto",padding:"20px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:20,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>Content Engine</div>
        <div style={{fontSize:14,color:"#556",fontFamily:"monospace"}}>2 posts/week • Tuesday & Thursday</div></div>
        <div style={{display:"flex",gap:6}}>
          {[["ready","READY"],["queued","QUEUED"],["published","PUBLISHED"]].map(([s,l])=>(
            <div key={s} style={{padding:"3px 8px",borderRadius:5,background:(statusC[s]||"#556")+"15",border:"1px solid "+(statusC[s]||"#556")+"30",fontSize:12,color:statusC[s],fontFamily:"monospace"}}>{l} ({posts.filter(p=>p.status===s).length})</div>
          ))}
        </div>
      </div>
      {posts.map(p=>{const c=statusC[p.status]||"#556";return(
        <div key={p.id} onClick={()=>toggle(p.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",marginBottom:4,background:c+"06",border:"1px solid "+c+"18",borderRadius:8,cursor:"pointer",borderLeft:"3px solid "+c}}>
          <div style={{width:24,height:24,borderRadius:6,background:c+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:c,fontFamily:"monospace",flexShrink:0}}>{p.id}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:16,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{p.title}</div>
            <div style={{fontSize:13,color:"#556",fontFamily:"monospace",marginTop:2}}>{p.keywords}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{padding:"2px 8px",borderRadius:4,background:c+"18",fontSize:12,color:c,fontFamily:"monospace",fontWeight:700}}>{p.status.toUpperCase()}</div>
            <div style={{fontSize:12,color:"#445",fontFamily:"monospace",marginTop:3}}>{p.scheduled}</div>
          </div>
        </div>
      );})}
    </div>
  );
}

// ═══ DASHBOARD TAB ═══
function DashboardTab({leads,milestones,posts,fin}) {
  const net=fin.income.reduce((a,i)=>a+i.amount,0);
  const exp=fin.fixed.reduce((a,i)=>a+i.amount,0)+fin.variable.reduce((a,i)=>a+i.amount,0);
  const sur=net-exp;
  const activeLeads=leads.filter(l=>!["closed","dead"].includes(l.status)).length;
  const demosScheduled=leads.filter(l=>l.status==="demo_scheduled").length;
  const closedDeals=leads.filter(l=>l.status==="closed").length;
  const nextMilestone=milestones.find(m=>!m.done);
  const readyPosts=posts.filter(p=>p.status==="ready").length;
  const nextPost=posts.find(p=>p.status==="ready");

  return (
    <div style={{height:"100%",overflowY:"auto",padding:"20px 24px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:24,fontWeight:700,color:"#f0e8d8",fontFamily:"'Playfair Display',Georgia,serif"}}>Good morning, Dylan.</div>
        <div style={{fontSize:15,color:"#556",fontFamily:"monospace",marginTop:4}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          {l:"ACTIVE LEADS",v:activeLeads,c:"#2E86C1"},
          {l:"DEMOS SCHEDULED",v:demosScheduled,c:"#E8A020"},
          {l:"CLOSED DEALS",v:closedDeals,c:"#1A8A4A"},
          {l:"MRR",v:f$(closedDeals*299),c:"#FF6B6B"},
        ].map(x=>(
          <div key={x.l} style={{background:x.c+"0c",border:"1px solid "+x.c+"30",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:12,color:x.c,letterSpacing:2,fontFamily:"monospace",marginBottom:6}}>{x.l}</div>
            <div style={{fontSize:28,fontWeight:900,color:x.c,fontFamily:"monospace"}}>{typeof x.v==="string"?x.v:x.v}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(232,160,32,0.12)",borderRadius:12,padding:"16px 18px"}}>
          <div style={{fontSize:16,fontWeight:700,color:"#E8A020",fontFamily:"monospace",marginBottom:12}}>NEXT ACTIONS</div>
          {[
            {t:"Text Blayne — lock in Zoom demo",done:false},
            {t:"Follow up Caleb (Tuesday if no response)",done:false},
            {t:"File LLC — corporations.utah.gov ($59)",done:false},
            {t:"Publish blog post #1",done:false},
            {t:"Send 10 outreach messages today",done:false},
          ].map((a,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{width:14,height:14,borderRadius:3,border:"1.5px solid rgba(255,255,255,0.2)",flexShrink:0}} />
              <div style={{fontSize:15,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif"}}>{a.t}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(26,138,74,0.15)",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1A8A4A",fontFamily:"monospace",marginBottom:8}}>NEXT MILESTONE</div>
            <div style={{fontSize:17,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif"}}>{nextMilestone?.label||"All done!"}</div>
            <div style={{fontSize:13,color:"#556",fontFamily:"monospace",marginTop:3}}>{nextMilestone?.date||""}</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(46,134,193,0.15)",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:"#2E86C1",fontFamily:"monospace",marginBottom:8}}>CONTENT</div>
            <div style={{fontSize:16,color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif"}}>{readyPosts} posts ready to publish</div>
            <div style={{fontSize:13,color:"#556",fontFamily:"monospace",marginTop:3}}>Next: {nextPost?.title?.substring(0,40)||"None"}...</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(232,160,32,0.15)",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#E8A020",fontFamily:"monospace",marginBottom:8}}>MONTHLY SURPLUS</div>
            <div style={{fontSize:24,fontWeight:800,color:sur>=0?"#E8A020":"#C0392B",fontFamily:"monospace"}}>{f$(sur)}</div>
            <div style={{fontSize:13,color:"#556",fontFamily:"monospace",marginTop:3}}>+$299 per CertFlow client</div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══ ROOT APP ═══
export default function App() {
  const [ok,setOk]=useState(false);
  const [tab,setTab]=useState("dashboard");
  const [fin,setFin]=useState(INIT_FIN);
  const [leads,setLeads]=useState(INIT_CRM);
  const [milestones,setMilestones]=useState(MILESTONES);
  const [posts,setPosts]=useState(INIT_BLOG);

  if(!ok) return <Lock onUnlock={()=>setOk(true)} />;

  const TABS=[
    {id:"dashboard",lbl:"DASHBOARD",c:"#E8A020",icon:"📊"},
    {id:"advisors",lbl:"ADVISORS",c:"#2E86C1",icon:"💼"},
    {id:"crm",lbl:"CRM",c:"#FF6B6B",icon:"🎯"},
    {id:"finance",lbl:"FINANCES",c:"#1A8A4A",icon:"💰"},
    {id:"roadmap",lbl:"ROADMAP",c:"#8E44AD",icon:"🗺️"},
    {id:"content",lbl:"CONTENT",c:"#00C9A7",icon:"📝"},
  ];

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#060A12",color:"#c8c0b0",fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(232,160,32,0.2);border-radius:3px}::placeholder{color:#445}`}</style>

      <div style={{display:"flex",alignItems:"center",borderBottom:"1px solid rgba(232,160,32,0.1)",background:"rgba(0,0,0,0.5)",flexShrink:0}}>
        <div style={{padding:"0 16px",borderRight:"1px solid rgba(232,160,32,0.08)",flexShrink:0,display:"flex",alignItems:"center",height:48}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#B8860B,#E8A020)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#060A12",fontFamily:"monospace",marginRight:8}}>CF</div>
          <span style={{fontSize:18,fontWeight:800,color:"#E8A020",fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:3}}>CERTFLOW</span>
        </div>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"0 14px",height:48,background:tab===t.id?t.c+"10":"transparent",border:"none",borderBottom:tab===t.id?"2px solid "+t.c:"2px solid transparent",color:tab===t.id?t.c:"#445",fontSize:13,fontFamily:"monospace",cursor:"pointer",letterSpacing:1,display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            <span style={{fontSize:16}}>{t.icon}</span>{t.lbl}
          </button>
        ))}
        <div style={{marginLeft:"auto",padding:"0 14px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <a href="https://certflo.io" target="_blank" rel="noreferrer" style={{fontSize:12,color:"#00C9A7",fontFamily:"monospace",textDecoration:"none"}}>certflo.io ↗</a>
          <a href="https://calendly.com/dylan-certflo/30min" target="_blank" rel="noreferrer" style={{fontSize:12,color:"#E8A020",fontFamily:"monospace",textDecoration:"none"}}>Calendly ↗</a>
        </div>
      </div>

      <div style={{flex:1,overflow:"hidden"}}>
        {tab==="dashboard"&&<DashboardTab leads={leads} milestones={milestones} posts={posts} fin={fin} />}
        {tab==="advisors"&&<AdvisorsTab />}
        {tab==="crm"&&<CRMTab leads={leads} setLeads={setLeads} />}
        {tab==="finance"&&<FinanceTab data={fin} setData={setFin} />}
        {tab==="roadmap"&&<RoadmapTab milestones={milestones} setMilestones={setMilestones} />}
        {tab==="content"&&<ContentTab posts={posts} setPosts={setPosts} />}
      </div>
    </div>
  );
}
