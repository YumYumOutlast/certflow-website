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
    window.scrollTo(0, 0);
    document.title = "Blog | CertFlow — COI Automation Insights for Trucking Agencies";
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#060A12", color: "#c8c0b0",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes cfFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .post-card:hover { border-color: rgba(232,160,32,0.3) !important; transform: translateY(-2px); }
        .post-card { transition: all 0.2s ease; }
        .back-link:hover { color: #E8A020 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6,10,18,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(232,160,32,0.1)",
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", display: "flex",
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
            }}>CERTFLOW</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <button className="back-link" onClick={() => navigate("/")} style={{
              background: "none", border: "none", color: "#8a8a9a",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", transition: "color 0.2s",
            }}>← Back to Site</button>
            <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
              padding: "8px 20px", borderRadius: 8,
              background: "linear-gradient(135deg, #B8860B, #E8A020)",
              border: "none", color: "#060A12", fontSize: 12, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
            }}>GET A DEMO</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        paddingTop: 140, paddingBottom: 64, paddingLeft: 24, paddingRight: 24,
        borderBottom: "1px solid rgba(232,160,32,0.08)",
        background: "radial-gradient(ellipse at 30% 50%, rgba(232,160,32,0.05) 0%, transparent 60%), #060A12",
        animation: "cfFadeUp 0.5s ease both",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontFamily: "monospace", color: "#E8A020", letterSpacing: 4, marginBottom: 16 }}>
            CERTFLOW INSIGHTS
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#f0e8d8", lineHeight: 1.15, margin: "0 0 20px 0",
          }}>
            The COI Intelligence Library
          </h1>
          <p style={{
            fontSize: 17, color: "#8a8a9a", lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif", maxWidth: 560, margin: 0,
          }}>
            Deep guides on certificate of insurance automation, trucking endorsements,
            carrier quirks, and how small agencies are eliminating manual COI work entirely.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 24px 100px" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#445", fontSize: 14, letterSpacing: 2, fontFamily: "monospace" }}>
            POSTS COMING SOON
          </div>
        ) : (
          <>
            {/* Featured */}
            <div
              className="post-card"
              onClick={() => navigate(`/blog/${posts[0].slug}`)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(232,160,32,0.15)",
                borderLeft: "3px solid #E8A020",
                borderRadius: 16, padding: "40px 44px",
                marginBottom: 32, cursor: "pointer",
                animation: "cfFadeUp 0.5s ease both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <span style={{
                  fontSize: 9, fontFamily: "monospace", letterSpacing: "0.25em",
                  color: "#E8A020", background: "rgba(232,160,32,0.08)",
                  border: "1px solid rgba(232,160,32,0.2)",
                  padding: "3px 10px", borderRadius: 4,
                }}>LATEST</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#445" }}>{formatDate(posts[0].date)}</span>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#334" }}>{posts[0].readTime}</span>
              </div>
              <h2 style={{
                fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 800,
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#f0e8d8", lineHeight: 1.25, margin: "0 0 14px 0",
              }}>{posts[0].title}</h2>
              <p style={{
                fontSize: 14, color: "#8a8a9a", lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif", margin: "0 0 20px 0", maxWidth: 620,
              }}>{posts[0].metaDescription}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {(posts[0].tags || []).slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontFamily: "monospace", color: "#445",
                    background: "rgba(232,160,32,0.04)", border: "1px solid rgba(232,160,32,0.1)",
                    padding: "2px 8px", borderRadius: 3, letterSpacing: "0.08em",
                  }}>#{tag}</span>
                ))}
              </div>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: "#E8A020", letterSpacing: "0.08em" }}>
                Read article →
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
                      border: "1px solid rgba(232,160,32,0.08)",
                      borderRadius: 14, padding: "28px 28px 44px",
                      cursor: "pointer", position: "relative",
                      animation: "cfFadeUp 0.5s ease both",
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#445" }}>{formatDate(post.date)}</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#334" }}>{post.readTime}</span>
                    </div>
                    <h3 style={{
                      fontSize: 17, fontWeight: 700,
                      fontFamily: "'Playfair Display', Georgia, serif",
                      color: "#d0c8b8", lineHeight: 1.3, margin: "0 0 12px 0",
                    }}>{post.title}</h3>
                    <p style={{
                      fontSize: 12, color: "#556", lineHeight: 1.6,
                      fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px 0",
                    }}>{post.metaDescription}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {(post.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} style={{
                          fontSize: 9, fontFamily: "monospace", color: "#334",
                          background: "rgba(232,160,32,0.03)", border: "1px solid rgba(232,160,32,0.08)",
                          padding: "2px 6px", borderRadius: 3,
                        }}>#{tag}</span>
                      ))}
                    </div>
                    <span style={{
                      position: "absolute", bottom: 24, right: 28,
                      fontSize: 16, color: "#E8A020",
                    }}>→</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{
        borderTop: "1px solid rgba(232,160,32,0.08)",
        padding: "64px 24px",
        background: "radial-gradient(ellipse at 50% 100%, rgba(232,160,32,0.04) 0%, transparent 60%)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800,
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#f0e8d8", margin: "0 0 12px 0",
        }}>Still processing COIs manually?</h2>
        <p style={{ fontSize: 15, color: "#8a8a9a", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
          See CertFlow handle a real request in under 5 minutes.
        </p>
        <button onClick={() => window.open("https://calendly.com/dylan-certflo/30min", "_blank")} style={{
          padding: "14px 36px", borderRadius: 10,
          background: "linear-gradient(135deg, #B8860B, #E8A020)",
          border: "none", color: "#060A12", fontSize: 14, fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif", cursor: "pointer", letterSpacing: 1,
        }}>Book a Free Demo</button>
      </div>

      <footer style={{
        padding: "32px 24px", borderTop: "1px solid rgba(232,160,32,0.06)",
        background: "#040810", textAlign: "center",
        fontSize: 11, color: "#334", fontFamily: "monospace", letterSpacing: "0.06em",
      }}>
        © {new Date().getFullYear()} CertFlow Administrative Services · Not an insurance agent or broker
      </footer>
    </div>
  );
}
