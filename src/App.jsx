import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import FlowStateHome from "./FlowStateHome.jsx";
import Insurance from "./Insurance.jsx";
import Blog from "./Blog.jsx";
import BlogPost from "./BlogPost.jsx";
import CommandCenter from "./CommandCenter.jsx";

const COLORS = {
  bg: "#111118",
  teal: "#00D4AA",
  purple: "#6C63FF",
  text: "#E8E6F0",
  textMuted: "#8A8A9A",
  textDim: "#555566",
  border: "rgba(255,255,255,0.06)",
};

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { label: "FlowState", path: "/" },
    { label: "Insurance", path: "/insurance" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(17,17,24,0.95)" : "rgba(17,17,24,0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled
        ? `1px solid rgba(0,212,170,0.12)`
        : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", display: "flex",
        alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#fff", fontFamily: "monospace",
          }}>CF</div>
          <span style={{
            fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif",
            letterSpacing: 1,
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>CertFlo</span>
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)} style={{
              background: "none", border: "none",
              color: (link.path === "/" ? location.pathname === "/" : isActive(link.path))
                ? COLORS.teal : COLORS.textMuted,
              fontSize: 13, fontFamily: "'Inter', sans-serif", cursor: "pointer",
              fontWeight: (link.path === "/" ? location.pathname === "/" : isActive(link.path)) ? 700 : 400,
              transition: "color 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.color = COLORS.teal}
            onMouseOut={e => {
              const active = link.path === "/" ? location.pathname === "/" : isActive(link.path);
              if (!active) e.currentTarget.style.color = COLORS.textMuted;
            }}
            >{link.label}</button>
          ))}
          <a
            href="https://getfluxe.gumroad.com/l/FlowState"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 20px", borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
              border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
              fontFamily: "'Inter', sans-serif", cursor: "pointer",
              letterSpacing: 1, textDecoration: "none",
            }}
          >GET FLOWSTATE FREE</a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", background: "none", border: "none",
            color: COLORS.text, fontSize: 24, cursor: "pointer", padding: 4,
          }}
        >
          {menuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-dropdown" style={{
          display: "none",
          flexDirection: "column", gap: 8, padding: "12px 0 20px",
          borderTop: `1px solid ${COLORS.border}`,
        }}>
          {navLinks.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)} style={{
              background: "none", border: "none", textAlign: "left",
              color: (link.path === "/" ? location.pathname === "/" : isActive(link.path))
                ? COLORS.teal : COLORS.textMuted,
              fontSize: 15, fontFamily: "'Inter', sans-serif", cursor: "pointer",
              fontWeight: 500, padding: "8px 0",
            }}>{link.label}</button>
          ))}
          <a
            href="https://getfluxe.gumroad.com/l/FlowState"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block", padding: "10px 20px", borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
              color: "#fff", fontSize: 13, fontWeight: 700,
              fontFamily: "'Inter', sans-serif", textDecoration: "none",
              textAlign: "center", marginTop: 4,
            }}
          >GET FLOWSTATE FREE</a>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{
      padding: "48px 24px 32px", borderTop: `1px solid ${COLORS.border}`,
      background: "#0A0A12",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 32, marginBottom: 32,
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif",
            marginBottom: 8,
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>CertFlo</div>
          <div style={{
            fontSize: 13, color: COLORS.textDim, lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
          }}>
            AI automation education and tools.
          </div>
        </div>

        {/* Links */}
        <div>
          <div style={{
            fontSize: 11, fontFamily: "monospace", color: COLORS.teal,
            letterSpacing: 3, marginBottom: 12,
          }}>PAGES</div>
          {[
            { label: "FlowState", action: () => navigate("/") },
            { label: "Insurance (CertFlo)", action: () => navigate("/insurance") },
            { label: "Blog", action: () => navigate("/blog") },
          ].map((l) => (
            <div key={l.label}
              onClick={l.action}
              style={{
                fontSize: 13, color: COLORS.textMuted, cursor: "pointer",
                fontFamily: "'Inter', sans-serif", padding: "4px 0",
                transition: "color 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.color = COLORS.teal}
              onMouseOut={e => e.currentTarget.style.color = COLORS.textMuted}
            >{l.label}</div>
          ))}
        </div>

        {/* External */}
        <div>
          <div style={{
            fontSize: 11, fontFamily: "monospace", color: COLORS.teal,
            letterSpacing: 3, marginBottom: 12,
          }}>CONNECT</div>
          {[
            { label: "Gumroad Store", url: "https://getfluxe.gumroad.com" },
            { label: "@YOutlast on X", url: "https://x.com/YOutlast" },
          ].map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
              display: "block", fontSize: 13, color: COLORS.textMuted,
              fontFamily: "'Inter', sans-serif", padding: "4px 0",
              textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.color = COLORS.teal}
            onMouseOut={e => e.currentTarget.style.color = COLORS.textMuted}
            >{l.label}</a>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: `1px solid ${COLORS.border}`, paddingTop: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{
          fontSize: 11, color: COLORS.textDim, fontFamily: "'Inter', sans-serif",
        }}>
          &copy; {new Date().getFullYear()} CertFlo. All rights reserved.
        </div>
        <div style={{
          fontSize: 11, color: COLORS.textDim, fontFamily: "'Inter', sans-serif",
        }}>
          CertFlo Administrative Services LLC
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#111118", color: "#E8E6F0",
      fontFamily: "'Inter', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,170,0.2); border-radius: 3px; }
        ::placeholder { color: #555566; }
        .desktop-nav { display: flex !important; }
        .mobile-nav-toggle { display: none !important; }
        .mobile-dropdown { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
          .mobile-dropdown { display: flex !important; }
        }
      `}</style>
      <Nav />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<FlowStateHome />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/engine" element={<CommandCenter />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
