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

  useEffect(() => {
    if (post) document.title = `${post.title} | CertFlo`;
  }, [slug]);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 64 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, color: "#8A8A9A" }}>404</div>
        <div style={{ color: "#8A8A9A", marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>Post not found.</div>
        <button onClick={() => navigate("/blog")} style={{
          background: "linear-gradient(135deg, #00D4AA, #6C63FF)",
          border: "none", color: "#fff", padding: "10px 24px",
          borderRadius: 8, cursor: "pointer", fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
        }}>&larr; Back to Blog</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64 }}>
      <style>{`
        @keyframes cfFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .related-card:hover { border-color: rgba(0,212,170,0.25) !important; }
        .related-card { transition: border-color 0.2s; }
        @media (max-width: 900px) {
          .blog-layout { grid-template-columns: 1fr !important; }
          .blog-sidebar { position: static !important; }
        }
      `}</style>

      {/* Reading progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, zIndex: 200,
        height: 2, background: "linear-gradient(90deg, #00D4AA, #6C63FF)",
        width: `${progress}%`, transition: "width 0.15s linear",
      }} />

      {/* Header */}
      <div style={{
        paddingTop: 56, paddingBottom: 48, paddingLeft: 24, paddingRight: 24,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "radial-gradient(ellipse at 20% 50%, rgba(0,212,170,0.04) 0%, transparent 50%), #111118",
        animation: "cfFadeUp 0.4s ease both",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 11, fontFamily: "monospace" }}>
            <span onClick={() => navigate("/blog")} style={{ color: "#00D4AA", cursor: "pointer" }}>Blog</span>
            <span style={{ color: "#444455" }}>/</span>
            <span style={{ color: "#555566" }}>{post.tags?.[0] || "Insights"}</span>
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: "#E8E6F0", lineHeight: 1.2, margin: "0 0 24px 0",
          }}>{post.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4AA" }} />
            <span style={{ fontSize: 12, color: "#8A8A9A", fontFamily: "monospace" }}>{post.author}</span>
            <span style={{ color: "#444455" }}>&middot;</span>
            <span style={{ fontSize: 12, color: "#555566", fontFamily: "monospace" }}>{formatDate(post.date)}</span>
            <span style={{ color: "#444455" }}>&middot;</span>
            <span style={{ fontSize: 12, color: "#555566", fontFamily: "monospace" }}>{post.readTime}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(post.tags || []).map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontFamily: "monospace", color: "#555566",
                background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.1)",
                padding: "3px 8px", borderRadius: 3, letterSpacing: "0.08em",
              }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="blog-layout" style={{
        maxWidth: 1200, margin: "0 auto", padding: "56px 24px 80px",
        display: "grid", gridTemplateColumns: "1fr 280px", gap: 56, alignItems: "start",
      }}>
        {/* Article */}
        <article style={{ maxWidth: 720, animation: "cfFadeUp 0.5s ease both" }}>
          {(post.sections || []).map((s, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{
                fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                color: "#E8E6F0", lineHeight: 1.3, margin: "0 0 14px 0",
              }}>{s.heading}</h2>
              <p style={{
                fontSize: 15, color: "#8A8A9A", lineHeight: 1.85,
                fontFamily: "'Inter', sans-serif", margin: 0,
              }}>{s.body}</p>
            </div>
          ))}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 36, marginTop: 8, marginBottom: 36,
            }}>
              <h2 style={{
                fontSize: 20, fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                color: "#E8E6F0", marginBottom: 24,
              }}>Frequently Asked Questions</h2>
              {post.faq.map((q, i) => (
                <div key={i} style={{
                  marginBottom: 24, paddingBottom: 24,
                  borderBottom: i < post.faq.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: "#E8E6F0",
                    fontFamily: "'Inter', sans-serif", marginBottom: 8,
                  }}>{q.question}</div>
                  <div style={{
                    fontSize: 14, color: "#8A8A9A", lineHeight: 1.7,
                    fontFamily: "'Inter', sans-serif",
                  }}>{q.answer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Beehiiv email capture placeholder */}
          <div style={{
            background: "rgba(0,212,170,0.04)",
            border: "1px solid rgba(0,212,170,0.15)",
            borderLeft: "3px solid #00D4AA",
            borderRadius: 12, padding: "28px 32px", marginTop: 8,
          }}>
            <div style={{
              fontSize: 18, fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              color: "#E8E6F0", marginBottom: 8,
            }}>Get the free FlowState guide</div>
            <p style={{
              fontSize: 13, color: "#8A8A9A", lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif", marginBottom: 20,
            }}>
              Join thousands learning how to use AI automation to future-proof their careers.
            </p>
            {/* Beehiiv embed will go here */}
            <div id="beehiiv-embed" style={{
              display: "flex", gap: 10, flexWrap: "wrap",
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: "1 1 200px", padding: "11px 14px", borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#E8E6F0", fontSize: 14, fontFamily: "'Inter', sans-serif",
                  outline: "none",
                }}
              />
              <button style={{
                background: "linear-gradient(135deg, #00D4AA, #6C63FF)",
                border: "none", color: "#fff", padding: "11px 24px",
                borderRadius: 8, fontSize: 13, fontWeight: 700,
                fontFamily: "'Inter', sans-serif", cursor: "pointer",
              }}>Subscribe</button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="blog-sidebar" style={{ position: "sticky", top: 84 }}>
          {/* About */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: 22, marginBottom: 14,
          }}>
            <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em", color: "#00D4AA", marginBottom: 12 }}>ABOUT</div>
            <p style={{ fontSize: 12, color: "#8A8A9A", lineHeight: 1.6, marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
              CertFlo builds AI automation tools and education. FlowState is our flagship product line helping people stay ahead of the AI shift.
            </p>
            <span onClick={() => window.open("https://getfluxe.gumroad.com/l/FlowState", "_blank")} style={{
              fontSize: 11, fontFamily: "monospace", color: "#00D4AA", cursor: "pointer",
            }}>Get FlowState Free &rarr;</span>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: 22,
            }}>
              <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em", color: "#00D4AA", marginBottom: 14 }}>RELATED POSTS</div>
              {related.map(rp => (
                <div key={rp.slug} className="related-card" onClick={() => { navigate(`/blog/${rp.slug}`); window.scrollTo(0, 0); }} style={{
                  padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer", marginBottom: 2,
                }}>
                  <div style={{ fontSize: 12, color: "#8A8A9A", lineHeight: 1.4, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>
                    {rp.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#444455", fontFamily: "monospace" }}>{rp.readTime}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
