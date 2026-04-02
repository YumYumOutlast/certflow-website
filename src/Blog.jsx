import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "./posts/index.jsx";

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

export default function Blog() {
  const posts = getAllPosts();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Blog | CertFlo — AI Workflow Insights";
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      <style>{`
        @keyframes cfFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .post-card:hover { border-color: rgba(0,212,170,0.3) !important; transform: translateY(-2px); }
        .post-card { transition: all 0.2s ease; }
      `}</style>

      {/* Hero */}
      <div style={{
        paddingTop: 76, paddingBottom: 64, paddingLeft: 24, paddingRight: 24,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "radial-gradient(ellipse at 30% 50%, rgba(0,212,170,0.05) 0%, transparent 60%), #111118",
        animation: "cfFadeUp 0.5s ease both",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#00D4AA", letterSpacing: 4, marginBottom: 16 }}>
            INSIGHTS
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            color: "#E8E6F0", lineHeight: 1.15, margin: "0 0 20px 0",
          }}>
            The Blog
          </h1>
          <p style={{
            fontSize: 17, color: "#8A8A9A", lineHeight: 1.7,
            fontFamily: "'Inter', sans-serif", maxWidth: 560, margin: 0,
          }}>
            AI workflow insights, productivity strategies, and deep dives into the tools that make you faster.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px 100px" }}>
        {posts.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>&#x1F4DD;</div>
            <div style={{
              color: "#555566", fontSize: 14, letterSpacing: 2, fontFamily: "monospace",
              marginBottom: 12,
            }}>
              POSTS COMING SOON
            </div>
            <p style={{
              fontSize: 15, color: "#8A8A9A", fontFamily: "'Inter', sans-serif",
              maxWidth: 400, margin: "0 auto", lineHeight: 1.6,
            }}>
              We're working on deep-dive articles about AI workflows, productivity, and working smarter.
            </p>
          </div>
        ) : (
          <>
            {/* Featured */}
            <div
              className="post-card"
              onClick={() => navigate(`/blog/${posts[0].slug}`)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,212,170,0.15)",
                borderLeft: "3px solid #00D4AA",
                borderRadius: 16, padding: "40px 44px",
                marginBottom: 32, cursor: "pointer",
                animation: "cfFadeUp 0.5s ease both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{
                  fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em",
                  color: "#00D4AA", background: "rgba(0,212,170,0.08)",
                  border: "1px solid rgba(0,212,170,0.2)",
                  padding: "3px 10px", borderRadius: 4,
                }}>LATEST</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#555566" }}>{formatDate(posts[0].date)}</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#444455" }}>{posts[0].readTime}</span>
              </div>
              <h2 style={{
                fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 800,
                fontFamily: "'Inter', sans-serif",
                color: "#E8E6F0", lineHeight: 1.25, margin: "0 0 14px 0",
              }}>{posts[0].title}</h2>
              <p style={{
                fontSize: 14, color: "#8A8A9A", lineHeight: 1.7,
                fontFamily: "'Inter', sans-serif", margin: "0 0 20px 0", maxWidth: 620,
              }}>{posts[0].metaDescription}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {(posts[0].tags || []).slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontFamily: "monospace", color: "#555566",
                    background: "rgba(0,212,170,0.04)", border: "1px solid rgba(0,212,170,0.1)",
                    padding: "2px 8px", borderRadius: 3, letterSpacing: "0.08em",
                  }}>#{tag}</span>
                ))}
              </div>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "#00D4AA", letterSpacing: "0.08em" }}>
                Read article &rarr;
              </span>
            </div>

            {/* Grid */}
            {posts.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {posts.slice(1).map((post, i) => (
                  <div
                    key={post.slug}
                    className="post-card"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    style={{
                      background: "rgba(255,255,255,0.015)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14, padding: "28px 28px 44px",
                      cursor: "pointer", position: "relative",
                      animation: "cfFadeUp 0.5s ease both",
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#555566" }}>{formatDate(post.date)}</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#444455" }}>{post.readTime}</span>
                    </div>
                    <h3 style={{
                      fontSize: 17, fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      color: "#E8E6F0", lineHeight: 1.3, margin: "0 0 12px 0",
                    }}>{post.title}</h3>
                    <p style={{
                      fontSize: 12, color: "#8A8A9A", lineHeight: 1.6,
                      fontFamily: "'Inter', sans-serif", margin: "0 0 16px 0",
                    }}>{post.metaDescription}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(post.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} style={{
                          fontSize: 9, fontFamily: "monospace", color: "#444455",
                          background: "rgba(0,212,170,0.03)", border: "1px solid rgba(0,212,170,0.08)",
                          padding: "2px 6px", borderRadius: 3,
                        }}>#{tag}</span>
                      ))}
                    </div>
                    <span style={{
                      position: "absolute", bottom: 24, right: 28,
                      fontSize: 16, color: "#00D4AA",
                    }}>&rarr;</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
