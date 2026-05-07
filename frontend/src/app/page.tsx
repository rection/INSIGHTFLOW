"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SearchComponent from "@/components/SearchComponent";
import ResultView from "@/components/ResultView";
import type { GenerateResponse } from "@/lib/types";

const NeuralBackground = dynamic(
  () => import("@/components/NeuralBackground"),
  { ssr: false }
);

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleResult = (r: GenerateResponse) => {
    setResult(r);
    setHasSearched(true);
  };

  return (
    <>
      <NeuralBackground />

      {/* Vignette overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,12,0.5) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <header
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            background: "rgba(8,8,18,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              maxWidth: "72rem",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(0,240,255,0.6)",
                }}
              >
                IF//
              </span>
              <span
                style={{
                  width: "1px",
                  height: "1rem",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 300,
                  letterSpacing: "0.06em",
                  color: "rgba(240,240,240,0.35)",
                }}
              >
                INSIGHTFLOW
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(240,240,240,0.18)",
              }}
            >
              SYS:ONLINE
            </span>
          </div>
        </header>

        {/* Main */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 1.5rem",
          }}
        >
          {/* Hero */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
              paddingTop: hasSearched ? "2.5rem" : "16vh",
              paddingBottom: hasSearched ? "1.5rem" : "3rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(0,240,255,0.45)",
                marginBottom: "1.5rem",
              }}
            >
              AI INTELLIGENCE ENGINE
            </p>

            <h1
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                color: "#e8e8e8",
                letterSpacing: "-0.02em",
                maxWidth: "52rem",
              }}
            >
              资讯
              <span
                style={{
                  background: "linear-gradient(135deg, #00f0ff, #00ff88)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 400,
                }}
              >
                洞察
              </span>
              ，一触即达
            </h1>

            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.85rem",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "rgba(240,240,240,0.35)",
                maxWidth: "26rem",
              }}
            >
              输入主题，AI 自动检索最新资讯，
              <br />
              编排为专业新闻稿与社交内容
            </p>

            {/* Animated underline */}
            <div
              style={{
                marginTop: "1.75rem",
                width: "2rem",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)",
              }}
            />
          </section>

          {/* Search */}
          <div
            style={{
              width: "100%",
              maxWidth: "42rem",
              marginBottom: hasSearched ? 0 : "2rem",
            }}
          >
            <SearchComponent
              onResult={handleResult}
              onLoadingChange={setLoading}
              onError={setError}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                width: "100%",
                maxWidth: "42rem",
                marginTop: "1.25rem",
                padding: "0.875rem 1.25rem",
                background: "rgba(200,30,30,0.06)",
                border: "1px solid rgba(200,30,30,0.15)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "#ff6b6b",
                letterSpacing: "0.02em",
              }}
            >
              ERROR: {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                width: "100%",
                maxWidth: "64rem",
                marginTop: "2.5rem",
                animation: "resultReveal 0.6s ease both",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "1.5rem",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "5rem",
                        background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.025)",
                        animation: "briefFadeIn 0.6s ease both",
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    height: "22rem",
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.025)",
                    animation: "briefFadeIn 0.8s ease both",
                  }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && result && (
            <div
              style={{
                width: "100%",
                maxWidth: "64rem",
                marginTop: "2.5rem",
                marginBottom: "4rem",
                animation: "resultReveal 0.7s ease both",
              }}
            >
              <ResultView
                sources={result.sources}
                newsArticle={result.news_article}
                socialPost={result.social_post}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.025)",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            color: "rgba(240,240,240,0.15)",
          }}
        >
          <span>INSIGHTFLOW v0.1.0</span>
          <span>·</span>
          <span>TAVILY + DEEPSEEK</span>
          <span>·</span>
          <span>LATENCY: ~4.2s</span>
        </footer>
      </div>
    </>
  );
}
