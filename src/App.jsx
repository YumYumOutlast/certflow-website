import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Blog from "./Blog.jsx";
import About from "./About.jsx";
import BlogPost from "./BlogPost.jsx";
import CommandCenter from "./CommandCenter.jsx";

const SECTIONS = ["hero", "how", "why", "faq", "contact"];

function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(6,10,18,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(232,160,32,0.12)" : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #B8860B, #E8A020)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 900, color: "#060A12", fontFamily: "monospace",
          }}>CF</div>
          <span
            onMouseDown={() => { window._cfTimer = setTimeout(() => { navigate("/engine"); }, 2000); }}
            onMouseUp={() => { clearTimeout(window._cfTimer); }}
            onMouseLeave={() => { clearTimeout(window._cfTimer); }}
            onTouchStart={() => { window._cfTimer = setTimeout(() => { navigate("/engine"); }, 2000); }}
            onTouchEnd={() => { clearTimeout(window._cfTimer); }}
            style={{
              fontSize: 18, fontWeight: 800, color: "#E8A020",
              fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: 2,
              userSelect: "none", cursor: "default",
            }}>CERTFLOW</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          {[["how", "How It Works"], ["why", "Why CertFlow"], ["faq", "FAQ"], ["contact", "Contact"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: "none", border: "none",
              color: active === id ? "#E8A020" : "#8a8a9a",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              fontWeight: active === id ? 700 : 400, transition: "color 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.color = "#E8A020"}
            onMouseOut={e => { if (active !== id) e.currentTarget.style.color = "#8a8a9a"; }}
            >{label}</button>
          ))}
          {/* Blog link */}
          <button onClick={() => navigate("/blog")} style={{
            background: "none", border: "none",
            color: location.pathname.startsWith("/blog") ? "#E8A020" : "#8a8a9a",
            fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            fontWeight: location.pathname.startsWith("/blog") ? 700 : 400, transition: "color 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.color = "#E8A020"}
          onMouseOut={e => { if (!location.pathname.startsWith("/blog")) e.currentTarget.style.color = "#8a8a9a"; }}
          >Blog</button>
          <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #B8860B, #E8A020)",
            border: "none", color: "#060A12", fontSize: 12, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
          }}>GET A DEMO</button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative", overflow: "hidden",
      background: "radial-gradient(ellipse at 30% 20%, rgba(232,160,32,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(46,134,193,0.04) 0%, transparent 60%), #060A12",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(232,160,32,0.3) 60px, rgba(232,160,32,0.3) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(232,160,32,0.3) 60px, rgba(232,160,32,0.3) 61px)",
      }} />
      <div style={{ textAlign: "center", maxWidth: 750, padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: 11, fontFamily: "monospace", color: "#E8A020",
          letterSpacing: 4, marginBottom: 24, opacity: 0.8,
        }}>COI AUTOMATION FOR TRUCKING AGENCIES</div>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800,
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#f0e8d8", lineHeight: 1.15, margin: "0 0 24px 0",
        }}>
          Your CSRs never touch an<br />
          <span style={{ color: "#E8A020" }}>ACORD form</span> again.
        </h1>
        <p style={{
          fontSize: 18, color: "#8a8a9a", lineHeight: 1.7, margin: "0 0 40px 0",
          fontFamily: "'DM Sans', sans-serif", maxWidth: 560, marginLeft: "auto", marginRight: "auto",
        }}>
          CSR emails a request in plain English. Completed certificate comes back in minutes.
          Endorsements, carrier quirks, validation — all handled.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
            padding: "14px 32px", borderRadius: 10,
            background: "linear-gradient(135deg, #B8860B, #E8A020)",
            border: "none", color: "#060A12", fontSize: 15, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
          }}>Request a Demo</button>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "14px 32px", borderRadius: 10,
            background: "rgba(232,160,32,0.08)", border: "1px solid rgba(232,160,32,0.25)",
            color: "#E8A020", fontSize: 15, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
          }}>See How It Works</button>
        </div>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[["< 5 min", "Average turnaround"], ["15+", "Edge cases trained"], ["10+", "Carriers mapped"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#E8A020", fontFamily: "monospace" }}>{num}</div>
              <div style={{ fontSize: 11, color: "#556", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "CSR Sends Email", desc: "Your CSR emails the COI request in plain English. No forms, no templates required. Shorthand, messy, however they normally write — it all works.", icon: "✉️", color: "#2E86C1" },
    { num: "02", title: "AI Extracts & Validates", desc: "CertFlow's AI reads the email, extracts every ACORD 25 field, identifies endorsement requirements, and validates against carrier-specific rules.", icon: "🧠", color: "#00C9A7" },
    { num: "03", title: "Certificate Generated", desc: "A completed ACORD 25 certificate is generated with proper endorsement forms, coverage limits, and cert holder information — all verified.", icon: "📄", color: "#E8A020" },
    { num: "04", title: "Delivered in Minutes", desc: "The completed certificate is sent back to the CSR's email thread with the PDF attached. Ready to forward to the certificate holder.", icon: "⚡", color: "#8E44AD" },
  ];
  return (
    <section id="how" style={{ padding: "120px 24px", background: "#060A12", borderTop: "1px solid rgba(232,160,32,0.06)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#E8A020", letterSpacing: 4, marginBottom: 12 }}>THE PROCESS</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: "#f0e8d8", margin: 0 }}>Email in. Certificate out.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {steps.map((s) => (
            <div key={s.num} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid " + s.color + "18", borderRadius: 16, padding: "32px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -5, fontSize: 72, fontWeight: 900, color: s.color + "08", fontFamily: "monospace" }}>{s.num}</div>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#8a8a9a", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCertFlow() {
  const features = [
    { title: "Deep Trucking Intelligence", desc: "Trained on 15+ real-world edge cases and 10+ carrier-specific quirks. Knows Progressive's blanket AI endorsements, Canal's non-standard dec pages, Great West's per-location aggregates, and more.", color: "#2E86C1" },
    { title: "Endorsement Aware", desc: "Correctly handles CG 20 01, CG 20 37, CA 04 44, CG 24 04, MCS-90, and dozens of other endorsement forms. Knows the difference between loss payee and additional insured.", color: "#00C9A7" },
    { title: "Smart Validation", desc: "Catches missing fields, expired policies, and inconsistencies before a bad cert goes out. A delayed cert is better than a wrong cert. Your E&O exposure drops.", color: "#E8A020" },
    { title: "Plain English Input", desc: "Your CSRs don't need training. They email the way they always have — shorthand, abbreviations, messy requests. The AI understands CSR language.", color: "#8E44AD" },
    { title: "Batch Processing", desc: "Multiple certificates from one email? Different endorsement requirements per cert holder? Handled. Each cert gets its own validation and generation.", color: "#C0392B" },
    { title: "Complete Audit Trail", desc: "Every request logged with timestamp, turnaround time, status, and full extraction data. Know exactly what your team is processing and how fast.", color: "#1A8A4A" },
  ];
  return (
    <section id="why" style={{ padding: "120px 24px", background: "radial-gradient(ellipse at 50% 0%, rgba(232,160,32,0.04) 0%, transparent 60%), #060A12", borderTop: "1px solid rgba(232,160,32,0.06)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#E8A020", letterSpacing: 4, marginBottom: 12 }}>THE EDGE</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: "#f0e8d8", margin: "0 0 16px 0" }}>Not another generic AI tool.</h2>
          <p style={{ fontSize: 16, color: "#8a8a9a", fontFamily: "'DM Sans', sans-serif", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Built by someone from the trucking industry who learned insurance from the inside out.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: "28px 24px", background: "rgba(255,255,255,0.015)", border: "1px solid " + f.color + "15", borderRadius: 14, borderLeft: "3px solid " + f.color }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: f.color, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#8a8a9a", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "What exactly does CertFlow do?", a: "CertFlow automates the intake and processing of Certificate of Insurance requests for trucking insurance agencies. Your CSR emails a COI request in plain English, and CertFlow's AI extracts all ACORD 25 fields, validates endorsements, generates the certificate, and sends it back — in minutes instead of 20-30 minutes of manual work." },
    { q: "Does CertFlow replace our agency management system?", a: "No. CertFlow works alongside your existing AMS. We handle the intake and data extraction — reading the email, identifying fields, validating endorsements. We're the brain between the email and the form." },
    { q: "Is CertFlow acting as an insurance agent or broker?", a: "No. CertFlow provides administrative and clerical data processing services only. We do not bind coverage, make coverage recommendations, or act as a producer on any certificate." },
    { q: "What endorsements and edge cases does it handle?", a: "CertFlow is trained on 15+ real-world trucking COI edge cases including additional insured (CG 20 01, CG 20 10), primary and non-contributory (CG 20 37), waiver of subrogation (CG 24 04 for GL, CA 04 44 for auto), MCS-90, loss payee vs additional insured, batch requests, and more. It also has carrier-specific intelligence for Progressive, Canal, Northland, Great West, CNA, and others." },
    { q: "How much does it cost?", a: "CertFlow is a flat monthly fee per agency. Founding rate is $299/mo for the first 5 agencies — locked forever. No per-certificate charges, no setup fees." },
    { q: "How long does implementation take?", a: "Most agencies are up and running within a week. Your CSRs don't need training — they just email requests the way they always have." },
  ];
  return (
    <section id="faq" style={{ padding: "120px 24px", background: "#060A12", borderTop: "1px solid rgba(232,160,32,0.06)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#E8A020", letterSpacing: 4, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: "#f0e8d8", margin: 0 }}>Questions answered.</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((f, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{
              background: open === i ? "rgba(232,160,32,0.04)" : "rgba(255,255,255,0.015)",
              border: "1px solid " + (open === i ? "rgba(232,160,32,0.2)" : "rgba(255,255,255,0.06)"),
              borderRadius: 12, padding: "18px 22px", cursor: "pointer", transition: "all 0.2s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: open === i ? "#E8A020" : "#c8c0b0", fontFamily: "'DM Sans', sans-serif" }}>{f.q}</div>
                <div style={{ fontSize: 18, color: "#E8A020", transform: open === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12 }}>+</div>
              </div>
              {open === i && <div style={{ fontSize: 13, color: "#8a8a9a", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(232,160,32,0.1)" }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", agency: "", message: "" });
  return (
    <section id="contact" style={{ padding: "120px 24px", background: "radial-gradient(ellipse at 50% 100%, rgba(232,160,32,0.06) 0%, transparent 60%), #060A12", borderTop: "1px solid rgba(232,160,32,0.06)" }}>
      <div style={{ maxWidth: 550, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#E8A020", letterSpacing: 4, marginBottom: 12 }}>GET STARTED</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif", color: "#f0e8d8", margin: "0 0 16px 0" }}>See it in action.</h2>
          <p style={{ fontSize: 15, color: "#8a8a9a", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>Request a 5-minute live demo. We'll process a COI request in real time while you watch.</p>
        </div>
        {!sent ? (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(232,160,32,0.12)", borderRadius: 16, padding: 32 }}>
            {[{ key: "name", label: "Your Name", placeholder: "Dylan Brown" }, { key: "email", label: "Email", placeholder: "you@agency.com" }, { key: "agency", label: "Agency Name (optional)", placeholder: "Smith Insurance Agency" }].map((f) => (
              <div key={f.key} style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, color: "#E8A020", fontFamily: "monospace", letterSpacing: 1, marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ width: "100%", background: "rgba(232,160,32,0.04)", border: "1px solid rgba(232,160,32,0.15)", borderRadius: 8, padding: "12px 14px", color: "#e0d8c8", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <button onClick={() => { if (form.name && form.email) setSent(true); }} style={{ width: "100%", padding: "14px", borderRadius: 10, background: form.name && form.email ? "linear-gradient(135deg, #B8860B, #E8A020)" : "rgba(255,255,255,0.05)", border: "none", color: form.name && form.email ? "#060A12" : "#556", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: form.name && form.email ? "pointer" : "not-allowed", letterSpacing: 1 }}>REQUEST DEMO</button>
          </div>
        ) : (
          <div style={{ background: "rgba(26,138,74,0.08)", border: "1px solid rgba(26,138,74,0.25)", borderRadius: 16, padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A8A4A", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>Demo Requested</div>
            <div style={{ fontSize: 13, color: "#8a8a9a", fontFamily: "'DM Sans', sans-serif" }}>We'll be in touch within 24 hours to schedule your live demo.</div>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(232,160,32,0.08)", background: "#040810" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#E8A020", fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: 2 }}>CERTFLOW</div>
        <div style={{ fontSize: 11, color: "#445", fontFamily: "'DM Sans', sans-serif" }}>CertFlow Administrative Services LLC · Administrative COI Processing</div>
        <div style={{ fontSize: 11, color: "#445", fontFamily: "'DM Sans', sans-serif" }}>© 2026 CertFlow. All rights reserved.</div>
      </div>
    </footer>
  );
}

function HomePage() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#060A12", color: "#c8c0b0", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: rgba(232,160,32,0.2); border-radius: 3px; } ::placeholder { color: #556; } @media (max-width: 768px) { nav > div > div:last-child > button:not(:last-child) { display: none !important; } }`}</style>
      <Nav active={active} />
      <Hero />
      <HowItWorks />
      <WhyCertFlow />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/engine" element={<CommandCenter />} />
	<Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
