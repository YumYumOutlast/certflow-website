import React from "react";

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

function BeehiivEmbed() {
  return (
    <iframe
      src="https://getfluxe.beehiiv.com/subscribe"
      style={{
        width: "100%", maxWidth: 480, height: 52, border: "none",
        borderRadius: 10, background: "transparent",
        colorScheme: "dark",
      }}
      title="Subscribe to FlowState"
    />
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
          FlowState by CertFlo
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          color: COLORS.text, lineHeight: 1.15, margin: "0 0 24px 0",
        }}>
          AI is automating your job.
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>This is how you stay ahead.</span>
        </h1>

        <p style={{
          fontSize: 18, color: COLORS.textMuted, lineHeight: 1.7,
          margin: "0 auto 40px", maxWidth: 520,
          fontFamily: "'Inter', sans-serif",
        }}>
          The FlowState guide shows you exactly how to use AI automation to
          future-proof your career — before it's too late.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <BeehiivEmbed />
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
    { num: "85M", label: "Jobs at risk of AI automation worldwide", color: COLORS.teal },
    { num: "1.1M", label: "Tech layoffs in 2024-2025 alone", color: COLORS.purple },
    { num: "18 mo", label: "Until full automation hits most roles", color: COLORS.teal },
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
          }}>THE REALITY</div>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: COLORS.text, margin: 0,
          }}>The shift is already happening.</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                fontSize: 100, fontWeight: 900, color: s.color,
                opacity: 0.04, fontFamily: "monospace",
              }}>{s.num}</div>
              <div style={{
                fontSize: 42, fontWeight: 900, color: s.color,
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
      name: "FlowState Guide",
      price: "Free",
      priceNote: "Lead magnet",
      desc: "The AI automation survival guide. Understand what's coming, what jobs are at risk, and the exact framework to stay ahead.",
      features: ["AI job displacement overview", "The FlowState framework", "Automation readiness checklist", "Career pivot strategies"],
      cta: "Download Free",
      url: GUMROAD.free,
      color: COLORS.teal,
      featured: false,
    },
    {
      name: "Starter Kit",
      price: "$9",
      priceNote: "One-time",
      desc: "Your first AI automation toolkit. Templates, prompts, and workflows to start automating real tasks today.",
      features: ["10 automation templates", "AI prompt library", "Workflow blueprints", "Tool recommendations"],
      cta: "Get the Starter Kit",
      url: GUMROAD.starter,
      color: COLORS.purple,
      featured: false,
    },
    {
      name: "Playbook",
      price: "$37",
      priceNote: "One-time",
      desc: "The complete AI automation playbook. Go from understanding AI to building real automated systems for your work.",
      features: ["Full automation playbook", "Step-by-step system builds", "Revenue automation strategies", "Private community access"],
      cta: "Get the Playbook",
      url: GUMROAD.playbook,
      color: COLORS.teal,
      featured: true,
    },
    {
      name: "Consultant Kit",
      price: "$97",
      priceNote: "One-time",
      desc: "Everything you need to start selling AI automation as a service. Pitch decks, proposals, pricing frameworks, and client workflows.",
      features: ["Client proposal templates", "Pricing & packaging guide", "Sales scripts & outreach", "Done-for-you deliverables"],
      cta: "Get the Consultant Kit",
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
          }}>Pick your level.</h2>
          <p style={{
            fontSize: 16, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif",
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6,
          }}>
            Start free. Go deeper when you're ready.
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
                <span style={{
                  fontSize: 12, color: COLORS.textDim,
                  fontFamily: "'Inter', sans-serif",
                }}>{t.priceNote}</span>
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
    { icon: "\u{1F4CA}", title: "AI Job Risk Framework", desc: "Understand exactly which roles are at risk and the timeline for automation across industries." },
    { icon: "\u{1F9E0}", title: "The FlowState Method", desc: "A step-by-step system for positioning yourself on the right side of the AI shift." },
    { icon: "\u{1F527}", title: "Automation Blueprints", desc: "Real workflows you can implement today to automate tasks and increase your output 10x." },
    { icon: "\u{1F4B0}", title: "Monetization Playbook", desc: "Turn AI skills into income streams — freelancing, consulting, or building automated products." },
    { icon: "\u{1F680}", title: "Tool & Prompt Library", desc: "Curated tools, templates, and prompts tested across real business use cases." },
    { icon: "\u{1F91D}", title: "Consultant Frameworks", desc: "Pitch decks, proposals, and pricing strategies to sell AI automation as a service." },
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
          }}>Everything you need to stay ahead.</h2>
          <p style={{
            fontSize: 16, color: COLORS.textMuted, fontFamily: "'Inter', sans-serif",
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6,
          }}>
            From understanding the threat to building a new income stream.
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
        }}>Don't get left behind.</h2>
        <p style={{
          fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7,
          fontFamily: "'Inter', sans-serif",
          margin: "0 auto 36px", maxWidth: 440,
        }}>
          Get the free FlowState guide and start building your AI advantage today.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BeehiivEmbed />
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
