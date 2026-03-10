import React, { useEffect, useRef, useState } from "react";

const gold = "#E8A020";
const goldDim = "rgba(232,160,32,0.15)";
const goldBorder = "rgba(232,160,32,0.25)";
const dark = "#060A12";
const darkCard = "#0C1220";
const textMuted = "rgba(255,255,255,0.5)";
const textBody = "rgba(255,255,255,0.82)";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const milestones = [
  {
    year: "The Problem",
    title: "Watching It Break in Real Time",
    body: "I drive trucks. I've sat in brokers' offices, watched dispatchers blow up CSRs' phones, seen loads get delayed for hours because a certificate wasn't ready. I wasn't an insurance guy — I was the guy on the other side of that broken system. I saw it hundreds of times before I understood what I was actually looking at.",
  },
  {
    year: "The Insight",
    title: "This Is an Admin Problem, Not an Insurance Problem",
    body: "The agents knew their stuff. The carriers were fine. The problem was the process — a human manually reading an email, opening a policy, typing fields into a form, and sending a PDF back. The same task. Dozens of times a day. Every day. That's not insurance work. That's clerical work. And clerical work is exactly what AI does best.",
  },
  {
    year: "The Build",
    title: "Zero Capital. Zero Connections. Just the Work.",
    body: "I built CertFlo from a truck cab and a laptop. Node.js pipeline. Claude API for extraction. ACORD 25 generation. Gmail integration. Google Sheets logging. I trained it on 15 carrier-specific edge cases and 10 quirks I'd seen in the wild. I deployed it on Railway. I pointed a domain at Vercel. I did all of it before I had a single paying client — because I needed to know it worked before I asked anyone to trust it.",
  },
  {
    year: "The Mission",
    title: "Machine One of Many",
    body: "CertFlo isn't just a product. It's proof of a pattern. Identify a process that's broken, that real people are suffering through, that has a clear repeatable solution — then build the machine that fixes it and runs itself. CertFlo is Machine One. The goal is a fleet of them. Each one solving a real problem. Each one running autonomously. Each one funding what comes next.",
  },
];

const values = [
  {
    icon: "⚙️",
    title: "Built by Someone Who's Been There",
    body: "I'm not a VC-backed founder who read about trucking insurance. I drive. I've lived the friction CertFlo solves.",
  },
  {
    icon: "🔒",
    title: "Admin Only. Never an Agent.",
    body: "CertFlo processes certificates. We don't give insurance advice, we don't act as brokers, we don't touch underwriting. Clean boundaries. Real compliance.",
  },
  {
    icon: "📈",
    title: "Obsessed with the Long Game",
    body: "The founding rate exists because early clients deserve to win with us. We're building a decade-long relationship, not a monthly recurring invoice.",
  },
  {
    icon: "🤖",
    title: "AI That Actually Works",
    body: "Trained on real trucking COI edge cases — MCS-90, CG 20 01, CA 04 44, carrier-specific quirks. Not a generic AI wrapper. A purpose-built machine.",
  },
];

export default function About() {
  return (
    <div style={{
      background: dark,
      minHeight: "100vh",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6,10,18,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${goldBorder}`,
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg, ${gold}, #C47A0A)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: dark,
            }}>CF</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "0.04em", fontFamily: "Georgia, serif" }}>CertFlo</span>
          </a>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <a href="/" style={{ color: textMuted, textDecoration: "none", fontSize: 14, letterSpacing: "0.06em" }}>HOME</a>
            <a href="/blog" style={{ color: textMuted, textDecoration: "none", fontSize: 14, letterSpacing: "0.06em" }}>BLOG</a>
            <a
              href="https://calendly.com/dylan-certflo/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: gold, color: dark, padding: "8px 20px",
                borderRadius: 6, fontSize: 13, fontWeight: 700,
                textDecoration: "none", letterSpacing: "0.06em",
              }}
            >GET A DEMO</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        paddingTop: 160, paddingBottom: 100, paddingLeft: 24, paddingRight: 24,
        maxWidth: 800, margin: "0 auto", textAlign: "center",
        position: "relative",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: `radial-gradient(ellipse, rgba(232,160,32,0.07) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <FadeIn>
          <div style={{
            display: "inline-block",
            border: `1px solid ${goldBorder}`,
            borderRadius: 20, padding: "6px 16px",
            fontSize: 11, letterSpacing: "0.14em", color: gold,
            marginBottom: 32, textTransform: "uppercase",
          }}>
            The Story Behind CertFlo
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 400, lineHeight: 1.15,
            margin: "0 0 28px",
            letterSpacing: "-0.02em",
          }}>
            I Built This From a{" "}
            <span style={{ color: gold, fontStyle: "italic" }}>Truck Cab.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, marginTop: 16 }}>
  <img
    src="/dylan.jpg"
    alt="Dylan Brown, founder of CertFlo"
    style={{
      width: 160, height: 160, borderRadius: "50%",
      objectFit: "cover", objectPosition: "center top",
      border: `2px solid ${goldBorder}`,
      filter: "grayscale(100%)",
    }}
  />
  <p style={{
    fontSize: "clamp(17px, 2.5vw, 20px)",
    color: textBody, lineHeight: 1.75,
    margin: "0 auto", maxWidth: 640,
  }}>
    I'm Dylan Brown. I drive trucks for a living. I also built an AI company that automates one of the most tedious, error-prone processes in trucking insurance — because I watched it break too many times to keep ignoring it.
  </p>
</div>

        </FadeIn>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${goldBorder}, transparent)` }} />
      </div>

      {/* Story Timeline */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px" }}>
        {milestones.map((m, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{
              display: "flex", gap: 40, marginBottom: 64,
              alignItems: "flex-start",
            }}>
              {/* Line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: `1.5px solid ${gold}`,
                  background: darkCard,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: gold, fontWeight: 700, letterSpacing: "0.04em",
                  textAlign: "center", padding: 4,
                  fontFamily: "Georgia, serif",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                {i < milestones.length - 1 && (
                  <div style={{
                    width: 1, flexGrow: 1, minHeight: 40,
                    background: `linear-gradient(180deg, ${goldBorder}, transparent)`,
                    marginTop: 8,
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingTop: 8 }}>
                <div style={{
                  fontSize: 11, letterSpacing: "0.12em", color: gold,
                  textTransform: "uppercase", marginBottom: 8,
                }}>{m.year}</div>
                <h2 style={{
                  fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400,
                  margin: "0 0 16px", letterSpacing: "-0.01em", lineHeight: 1.3,
                }}>{m.title}</h2>
                <p style={{
                  color: textBody, lineHeight: 1.8, fontSize: 16, margin: 0,
                }}>{m.body}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${goldBorder}, transparent)` }} />
      </div>

      {/* Values Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <FadeIn>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400,
            textAlign: "center", margin: "0 0 16px", letterSpacing: "-0.02em",
          }}>How We Operate</h2>
          <p style={{
            color: textMuted, textAlign: "center", fontSize: 16,
            margin: "0 auto 56px", maxWidth: 500,
          }}>The principles behind every decision we make.</p>
        </FadeIn>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {values.map((v, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                background: darkCard,
                border: `1px solid ${goldBorder}`,
                borderRadius: 12, padding: 28,
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = gold;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = goldBorder;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{
                  fontSize: 16, fontWeight: 600, margin: "0 0 12px",
                  letterSpacing: "-0.01em", lineHeight: 1.3,
                }}>{v.title}</h3>
                <p style={{ color: textBody, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${goldBorder}, transparent)` }} />
      </div>

      {/* CTA */}
      <div style={{
        maxWidth: 700, margin: "0 auto",
        padding: "100px 24px 120px", textAlign: "center",
      }}>
        <FadeIn>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400,
            margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            Still doing COIs{" "}
            <span style={{ color: gold, fontStyle: "italic" }}>manually?</span>
          </h2>
          <p style={{
            color: textBody, fontSize: 17, lineHeight: 1.75,
            margin: "0 auto 40px", maxWidth: 520,
          }}>
            Book a 20-minute demo. We'll process a real certificate from your agency live, on the call. No slides. No fluff. Just the machine working.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://calendly.com/dylan-certflo/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: gold, color: dark, padding: "14px 32px",
                borderRadius: 8, fontSize: 14, fontWeight: 700,
                textDecoration: "none", letterSpacing: "0.08em",
                display: "inline-block",
              }}
            >BOOK A DEMO</a>
            <a
              href="mailto:dylan@certflo.io"
              style={{
                background: "transparent",
                border: `1px solid ${goldBorder}`,
                color: "#fff", padding: "14px 32px",
                borderRadius: 8, fontSize: 14, fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.06em",
                display: "inline-block",
              }}
            >dylan@certflo.io</a>
          </div>
        </FadeIn>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${goldBorder}`,
        padding: "32px 24px", textAlign: "center",
      }}>
        <p style={{ color: textMuted, fontSize: 13, margin: 0, letterSpacing: "0.04em" }}>
          © 2026 CertFlo Administrative Services · Not an insurance agent or broker
        </p>
      </div>
    </div>
  );
}
