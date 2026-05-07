"use client";

import { ExternalLink } from "lucide-react";
import ContentTabs from "@/components/ContentTabs";
import type { Source } from "@/lib/types";

interface ResultViewProps {
  sources: Source[];
  newsArticle: string;
  socialPost: string;
}

export default function ResultView({
  sources,
  newsArticle,
  socialPost,
}: ResultViewProps) {
  const wordCount = newsArticle.length;
  const readMin = Math.max(1, Math.ceil(wordCount / 500));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
      {/* Sidebar */}
      <div>
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(0,240,255,0.45)",
            }}
          >
            参考资料
          </span>
          <span
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(0,240,255,0.08)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "rgba(240,240,240,0.2)",
              letterSpacing: "0.05em",
            }}
          >
            {sources.length} 条
          </span>
        </div>

        {/* Source cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(255,255,255,0.03)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                animation: "sourceCardSlide 0.5s ease both",
                animationDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.borderColor = "rgba(0,240,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)";
              }}
            >
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {/* Index number */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    color: "rgba(0,240,255,0.35)",
                    lineHeight: 1.6,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  {/* Title */}
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      color: "rgba(240,240,240,0.75)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {source.title}
                  </p>

                  {/* Snippet */}
                  <p
                    style={{
                      marginTop: "0.375rem",
                      fontSize: "0.65rem",
                      fontWeight: 300,
                      lineHeight: 1.55,
                      color: "rgba(240,240,240,0.25)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {source.snippet}
                  </p>

                  {/* Date */}
                  {source.published_date && (
                    <p
                      style={{
                        marginTop: "0.375rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.06em",
                        color: "rgba(240,240,240,0.15)",
                      }}
                    >
                      {source.published_date}
                    </p>
                  )}
                </div>

                {/* External link icon */}
                <ExternalLink
                  style={{
                    width: "0.625rem",
                    height: "0.625rem",
                    flexShrink: 0,
                    color: "rgba(240,240,240,0.12)",
                    marginTop: "0.15rem",
                  }}
                />
              </div>
            </a>
          ))}
        </div>

        {/* Stats bar */}
        <div
          style={{
            marginTop: "1rem",
            padding: "0.625rem 0.75rem",
            background: "rgba(0,240,255,0.02)",
            border: "1px solid rgba(0,240,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "rgba(240,240,240,0.25)",
              letterSpacing: "0.06em",
            }}
          >
            <span>字数 ~{wordCount}</span>
            <span>阅读 ~{readMin}min</span>
            <span>来源 ×{sources.length}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          animation: "briefFadeIn 0.6s ease both",
          animationDelay: "0.2s",
        }}
      >
        <ContentTabs newsArticle={newsArticle} socialPost={socialPost} />
      </div>
    </div>
  );
}
