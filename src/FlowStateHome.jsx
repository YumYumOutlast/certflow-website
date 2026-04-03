import React, { useState } from "react";

const COLORS = {
  bg: "#111118",
  bgCard: "rgba(255,255,255,0.03)",
  teal: "#00D4AA",
  purple: "#6C63FF",
  text: "#E8E6F0",
  textMuted: "#8A8A9A",
  textDim: "#555566",
  border: "rgba(255,255,255,0.06)",
};

const GUMROAD = {
  free: "https://getfluxe.gumroad.com/l/FlowState",
  starter: "https://getfluxe.gumroad.com/l/StarterKit",
  playbook: "https://getfluxe.gumroad.com/l/Playbook",
  consultant: "https://getfluxe.gumroad.com/l/ConsultantKit",
};

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're in! Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div style={{
        padding: "14px 24px", borderRadius: 10,
        background: "rgba(0,212,170,0.08)",
        border: "1px solid rgba(0,212,170,0.25)",
        color: COLORS.teal, fontSize: 14, fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        textAlign: "center", maxWidth: 480, width: "100%",
      }}>
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex", gap: 8, width: "100%", maxWidth: 480,
    }}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        required
        style={{
          flex: 1, padding: "12px 16px", borderRadius: 10,
          border: status === "error"
            ? "1px solid rgba(255,80,80,0.4)"
            : `1px solid ${COLORS.border}`,
          background: "rgba(255,255,255,0.04)",
          color: COLORS.text, fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "12px 24px", borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
          color: "#fff", fontSize: 13, fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: status === "loading" ? "wait" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {status === "loading" ? "Joining..." : "Get it free"}
      </button>
    </form>
  );
}

function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative", overflow: "hidden",
      background: `radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,212,170,0.06) 0%, transparent 60%), ${COLORS.bg}`,
      paddingTop: 80,
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(108,99,255,0.4) 60px, rgba(108,99,255,0.4) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(108,99,255,0.4) 60px, rgba(108,99,255,0.4) 61px)",
      }} />
      <div style={{
        textAlign: "center", maxWidth: 720, padding: "0 24px",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          display: "inline-block", border: `1px solid rgba(0,212,170,0.3)`,
          borderRadius: 20, padding: "6px 16px", marginBottom: 28,
          fontSize: 11, letterSpacing: "0.14em", color: COLORS.teal,
          textTransform: "uppercase", fontFamily: "'Inter', sans-serif",
        }}>
          FREE GUIDE
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          color: COLORS.text, lineHeight: 1.15, margin: "0 0 24px 0",
        }}>
          Most people are doing work
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>a machine should be doing.</span>
        </h1>

        <p style={{
          fontSize: 18, color: COLORS.textMuted, lineHeight: 1.7,
          margin: "0 auto 40px", maxWidth: 520,
          fontFamily: "'Inter', sans-serif",
        }}>
          FlowState shows you the 5 workflows that quietly save 7+ hours a week.
          Free tools. No coding. Set up each one in 10 minutes.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <EmailCapture />
        </div>

        <div style={{
          marginTop: 12, fontSize: 12, color: COLORS.textDim,
          fontFamily: "'Inter', sans-serif",
        }}>
          Free. No spam. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
}

function StatCards() {
  const stats = [
    { num: "7+ hrs/week", label: "Average time reclaimed", color: COLORS.teal },
    { num: "$0", label: "Everything uses free tools", color: COLORS.purple },
    { num: "10 min", label: "Setup time per workflow", color: COLORS.teal },
    { num: "23K+", label: "Downloads and counting", color: COLORS.purple },
  ];

  return (
    <section style={{
      padding: "100px 24px",
      background: COLORS.bg,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontFamily: "monospace", color: COLORS.teal,
            letterSpacing: 4, marginBottom: 12,
          }}>THE NUMBERS</div>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: COLORS.text, margin: 0,
          }}>Work smarter, not longer.</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {stats.map((s) => (
            <div key={s.num} style={{
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: "36px 28px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -10,
                fontSize: 80, fontWeight: 900, color: s.color,
                opacity: 0.04, fontFamily: "monospace",
              }}>{s.num}</div>
              <div style={{
                fontSize: 36, fontWeight: 900, color: s.color,
                fontFamily: "monospace", marginBottom: 8,
              }}>{s.num}</div>
              <div style={{
                fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5,
                fontFamily: "'Inter', sans-serif",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductTiers() {
  const tiers = [
    {
      name: "FlowState",
      price: "Free",
      priceNote: "",
      desc: "5 workflows that handle your email, meetings, spreadsheets, and reports while you focus on the stuff that actually matters.",
      features: ["5 ready-to-use workflows", "Free tools only", "10-minute setup each", "No coding required"],
      cta: "Get it free",
      url: GUMROAD.free,
      color: COLORS.teal,
      featured: false,
    },
    {
      name: "The AI-Proof Starter Kit",
      price: "$27",
      priceNote: "One-time",
      desc: "15 workflows across 5 departments. The cheat sheet for plugging AI into every corner of your job.",
      features: ["15 department workflows", "Plug-and-play templates", "AI prompt library", "Tool recommendations"],
      cta: "See what's inside",
      url: GUMROAD.starter,
      color: COLORS.purple,
      featured: false,
    },
    {
      name: "The AI-Proof Playbook",
      price: "$79",
      priceNote: "One-time",
      desc: "Stop following templates. Start building your own. The full system for becoming the person on your team everyone asks 'how did you do that so fast.'",
      features: ["Custom workflow builder", "Advanced automation systems", "Full prompt engineering guide", "Private community access"],
      cta: "See what's inside",
      url: GUMROAD.playbook,
      color: COLORS.teal,
      featured: true,
    },
    {
      name: "The Automation Consultant Kit",
      price: "$149",
      priceNote: "One-time",
      desc: "Everything you need to start getting paid for what you just learned. Proposal templates, pricing, scripts, and a client playbook.",
      features: ["Client proposal templates", "Pricing & packaging guide", "Sales scripts & outreach", "Done-for-you deliverables"],
      cta: "See what's inside",
      url: GUMROAD.consultant,
      color: COLORS.purple,
      featured: false,
    },
  ];

  return (
    <section style={{
      padding: "100px 24px",
      background: `radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.05) 0%, transparent 60%), ${COLORS.bg}`,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontFamily: "monospace", color: COLORS.purple,
            letterSpacing: 4, marginBottom: 12,
          }}>THE PRODUCT LINE</div>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: COLORS.text, margin: "0 0 12px 0",
          }}>Start free. Go as deep as you want.</h2>
          <p style={{
            fontSize: 16, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif",
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6,
          }}>
            Pick your level. Every tier builds on the last.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20, alignItems: "stretch",
        }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              background: t.featured ? "rgba(0,212,170,0.04)" : COLORS.bgCard,
              border: t.featured
                ? "1px solid rgba(0,212,170,0.25)"
                : `1px solid ${COLORS.border}`,
              borderRadius: 16, padding: "32px 24px",
              display: "flex", flexDirection: "column",
              position: "relative",
            }}>
              {t.featured && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
                  color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                  padding: "4px 14px", borderRadius: "0 0 8px 8px",
                  fontFamily: "'Inter', sans-serif",
                }}>MOST POPULAR</div>
              )}
              <div style={{
                fontSize: 13, fontWeight: 700, color: t.color,
                fontFamily: "'Inter', sans-serif", marginBottom: 4,
                marginTop: t.featured ? 12 : 0,
              }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontSize: 36, fontWeight: 900, color: COLORS.text,
                  fontFamily: "'Inter', sans-serif",
                }}>{t.price}</span>
                {t.priceNote && <span style={{
                  fontSize: 12, color: COLORS.textDim,
                  fontFamily: "'Inter', sans-serif",
                }}>{t.priceNote}</span>}
              </div>
              <p style={{
                fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6,
                fontFamily: "'Inter', sans-serif", margin: "0 0 20px 0",
              }}>{t.desc}</p>
              <ul style={{
                listStyle: "none", padding: 0, margin: "0 0 24px 0",
                flex: 1,
              }}>
                {t.features.map((f) => (
                  <li key={f} style={{
                    fontSize: 13, color: COLORS.textMuted, padding: "5px 0",
                    fontFamily: "'Inter', sans-serif",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ color: t.color, fontSize: 14 }}>&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={t.url} target="_blank" rel="noopener noreferrer" style={{
                display: "block", textAlign: "center",
                padding: "12px 20px", borderRadius: 10,
                background: t.featured
                  ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`
                  : `rgba(255,255,255,0.05)`,
                border: t.featured ? "none" : `1px solid ${COLORS.border}`,
                color: t.featured ? "#fff" : COLORS.text,
                fontSize: 13, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                textDecoration: "none", letterSpacing: 0.5,
                cursor: "pointer",
              }}>{t.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Preview() {
  const items = [
    { icon: "\u{2709}\u{FE0F}", title: "Email Autopilot", desc: "Stop writing the same emails from scratch. 45 minutes back every day." },
    { icon: "\u{1F4DD}", title: "Meeting Notes AI", desc: "Walk out of meetings with a clean summary you didn't have to write." },
    { icon: "\u{1F4CA}", title: "Spreadsheet Magic", desc: "Formulas, formatting, and analysis in one prompt." },
    { icon: "\u{26A1}", title: "Zapier Automations", desc: "Connect your apps so things happen without you touching them." },
    { icon: "\u{1F4C4}", title: "One-Prompt Reports", desc: "Paste your data, get a finished report. 3 hours back every week." },
  ];

  return (
    <section style={{
      padding: "100px 24px",
      background: COLORS.bg,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            fontSize: 11, fontFamily: "monospace", color: COLORS.teal,
            letterSpacing: 4, marginBottom: 12,
          }}>WHAT'S INSIDE</div>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: COLORS.text, margin: "0 0 12px 0",
          }}>What you're getting</h2>
          <p style={{
            fontSize: 16, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif",
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6,
          }}>
            5 workflows. Each one saves real time. All free tools.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {items.map((item) => (
            <div key={item.title} style={{
              padding: "28px 24px",
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              borderLeft: `3px solid ${COLORS.teal}`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div style={{
                fontSize: 15, fontWeight: 700, color: COLORS.text,
                fontFamily: "'Inter', sans-serif", marginBottom: 8,
              }}>{item.title}</div>
              <div style={{
                fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7,
                fontFamily: "'Inter', sans-serif",
              }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section style={{
      padding: "100px 24px",
      background: `radial-gradient(ellipse at 50% 100%, rgba(0,212,170,0.06) 0%, transparent 60%), ${COLORS.bg}`,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{
        maxWidth: 600, margin: "0 auto", textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          color: COLORS.text, margin: "0 0 16px 0",
        }}>Your coworkers are going to wonder how you got so fast.</h2>
        <p style={{
          fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7,
          fontFamily: "'Inter', sans-serif",
          margin: "0 auto 36px", maxWidth: 440,
        }}>
          It starts with 5 workflows. Takes 10 minutes. Costs nothing.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <EmailCapture />
        </div>
      </div>
    </section>
  );
}

export default function FlowStateHome() {
  return (
    <>
      <Hero />
      <StatCards />
      <ProductTiers />
      <Preview />
      <BottomCTA />
    </>
  );
}
