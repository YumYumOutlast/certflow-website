import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostBySlug, getAllPosts } from "./posts/index.jsx";

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const related = getAllPosts().filter(p => p.slug !== slug).slice(0, 3);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} | CertFlo`;
  }, [slug]);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
      setScrolled(scrollTop > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) return (
    <div style={{ minHeight: "100vh", background: "#060A12", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
        <div style={{ color: "#8a8a9a", marginBottom: 24 }}>Post not found.</div>
        <button onClick={() => navigate("/blog")} style={{
          background: "linear-gradient(135deg, #B8860B, #E8A020)",
          border: "none", color: "#060A12", padding: "10px 24px",
          borderRadius: 8, cursor: "pointer", fontWeight: 700,
        }}>← Back to Blog</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#060A12", color: "#c8c0b0", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes cfFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .related-card:hover { border-color: rgba(232,160,32,0.25) !important; }
        .related-card { transition: border-color 0.2s; }
      `}</style>

      {/* Reading progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, zIndex: 200,
        height: 2, background: "linear-gradient(90deg, #B8860B, #E8A020)",
        width: `${progress}%`, transition: "width 0.15s linear",
      }} />

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(6,10,18,0.97)" : "rgba(6,10,18,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(232,160,32,0.1)",
        padding: "0 24px", transition: "background 0.3s",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", display: "flex",
          alignItems: "center", justifyContent: "space-between", height: 64,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #B8860B, #E8A020)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "#060A12", fontFamily: "monospace",
            }}>CF</div>
            <span style={{
              fontSize: 18, fontWeight: 800, color: "#E8A020",
              fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: 2,
            }}>CertFlo</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <button onClick={() => navigate("/blog")} style={{
              background: "none", border: "none", color: "#8a8a9a",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>← All Posts</button>
            <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
              padding: "8px 20px", borderRadius: 8,
              background: "linear-gradient(135deg, #B8860B, #E8A020)",
              border: "none", color: "#060A12", fontSize: 12, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
            }}>GET A DEMO</button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{
        paddingTop: 110, paddingBottom: 48, paddingLeft: 24, paddingRight: 24,
        borderBottom: "1px solid rgba(232,160,32,0.08)",
        background: "radial-gradient(ellipse at 20% 50%, rgba(232,160,32,0.04) 0%, transparent 50%), #060A12",
        animation: "cfFadeUp 0.4s ease both",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 11, fontFamily: "monospace" }}>
            <span onClick={() => navigate("/blog")} style={{ color: "#E8A020", cursor: "pointer" }}>Blog</span>
            <span style={{ color: "#334" }}>/</span>
            <span style={{ color: "#445" }}>{post.tags?.[0] || "Insights"}</span>
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 800,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#f0e8d8", lineHeight: 1.2, margin: "0 0 24px 0",
          }}>{post.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A020" }} />
            <span style={{ fontSize: 12, color: "#8a8a9a", fontFamily: "monospace" }}>{post.author}</span>
            <span style={{ color: "#334" }}>·</span>
            <span style={{ fontSize: 12, color: "#556", fontFamily: "monospace" }}>{formatDate(post.date)}</span>
            <span style={{ color: "#334" }}>·</span>
            <span style={{ fontSize: 12, color: "#445", fontFamily: "monospace" }}>{post.readTime}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(post.tags || []).map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontFamily: "monospace", color: "#445",
                background: "rgba(232,160,32,0.04)", border: "1px solid rgba(232,160,32,0.1)",
                padding: "3px 8px", borderRadius: 3, letterSpacing: "0.08em",
              }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "56px 24px 80px",
        display: "grid", gridTemplateColumns: "1fr 280px", gap: 56, alignItems: "start",
      }}>

        {/* Article */}
        <article style={{ maxWidth: 720, animation: "cfFadeUp 0.5s ease both" }}>
          {(post.sections || []).map((s, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 700,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#d8c8a8", lineHeight: 1.3, margin: "0 0 14px 0",
              }}>{s.heading}</h2>
              <p style={{
                fontSize: 15, color: "#8a8a9a", lineHeight: 1.85,
                fontFamily: "'DM Sans', sans-serif", margin: 0,
              }}>{s.body}</p>
            </div>
          ))}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <div style={{
              borderTop: "1px solid rgba(232,160,32,0.08)",
              paddingTop: 36, marginTop: 8, marginBottom: 36,
            }}>
              <h2 style={{
                fontSize: 20, fontWeight: 700,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#d8c8a8", marginBottom: 24,
              }}>Frequently Asked Questions</h2>
              {post.faq.map((q, i) => (
                <div key={i} style={{
                  marginBottom: 24, paddingBottom: 24,
                  borderBottom: i < post.faq.length - 1 ? "1px solid rgba(232,160,32,0.06)" : "none",
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: "#c8b890",
                    fontFamily: "'DM Sans', sans-serif", marginBottom: 8,
                  }}>{q.question}</div>
                  <div style={{
                    fontSize: 14, color: "#8a8a9a", lineHeight: 1.7,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{q.answer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Inline CTA */}
          <div style={{
            background: "rgba(232,160,32,0.04)",
            border: "1px solid rgba(232,160,32,0.15)",
            borderLeft: "3px solid #E8A020",
            borderRadius: 12, padding: "28px 32px", marginTop: 8,
          }}>
            <div style={{
              fontSize: 18, fontWeight: 800,
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#f0e8d8", marginBottom: 8,
            }}>Tired of manual COI requests?</div>
            <p style={{
              fontSize: 13, color: "#8a8a9a", lineHeight: 1.6,
              fontFamily: "'DM Sans', sans-serif", marginBottom: 20,
            }}>{post.cta}</p>
            <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
              background: "linear-gradient(135deg, #B8860B, #E8A020)",
              border: "none", color: "#060A12", padding: "11px 28px",
              borderRadius: 8, fontSize: 13, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
            }}>See It Live — Free Demo</button>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 84 }}>
          {/* About */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(232,160,32,0.1)",
            borderRadius: 12, padding: 22, marginBottom: 14,
          }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em", color: "#E8A020", marginBottom: 12 }}>ABOUT CertFlo</div>
            <p style={{ fontSize: 12, color: "#556", lineHeight: 1.6, marginBottom: 14 }}>
              AI-powered COI automation for small trucking insurance agencies.
              CSRs email requests — ACORD 25 certs come back in minutes. Flat rate. No contracts.
            </p>
            <span onClick={() => navigate("/")} style={{
              fontSize: 11, fontFamily: "monospace", color: "#E8A020", cursor: "pointer",
            }}>certflo.io →</span>
          </div>

          {/* Pricing */}
          <div style={{
            background: "rgba(232,160,32,0.03)",
            border: "1px solid rgba(232,160,32,0.15)",
            borderRadius: 12, padding: 22, marginBottom: 14,
          }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em", color: "#E8A020", marginBottom: 10 }}>FOUNDING RATE</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#E8A020", marginBottom: 4 }}>
              $299<span style={{ fontSize: 14, color: "#556", fontWeight: 400 }}>/mo</span>
            </div>
            <div style={{ fontSize: 11, color: "#445", lineHeight: 1.5, marginBottom: 18 }}>
              First 5 agencies. Locked forever. No per-cert fees.
            </div>
            <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
              width: "100%", background: "linear-gradient(135deg, #B8860B, #E8A020)",
              border: "none", color: "#060A12", padding: "10px",
              borderRadius: 8, fontSize: 12, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            }}>Book Demo</button>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(232,160,32,0.08)",
              borderRadius: 12, padding: 22,
            }}>
              <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em", color: "#E8A020", marginBottom: 14 }}>RELATED POSTS</div>
              {related.map(rp => (
                <div key={rp.slug} className="related-card" onClick={() => { navigate(`/blog/${rp.slug}`); window.scrollTo(0, 0); }} style={{
                  padding: "10px 0", borderBottom: "1px solid rgba(232,160,32,0.06)",
                  cursor: "pointer", marginBottom: 2,
                }}>
                  <div style={{ fontSize: 12, color: "#8a8a9a", lineHeight: 1.4, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
                    {rp.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#334", fontFamily: "monospace" }}>{rp.readTime}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <footer style={{
        padding: "32px 24px", borderTop: "1px solid rgba(232,160,32,0.06)",
        background: "#040810", textAlign: "center",
        fontSize: 11, color: "#334", fontFamily: "monospace", letterSpacing: "0.06em",
      }}>
        © {new Date().getFullYear()} CertFlo Administrative Services · Not an insurance agent or broker
      </footer>
    </div>
  );
}
