"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";
import { generateContent } from "@/lib/api";

const DIRECTIONS = [
  { value: "tech", label: "科技" },
  { value: "lifestyle", label: "生活" },
  { value: "finance", label: "财经" },
  { value: "custom", label: "综合" },
] as const;

interface SearchComponentProps {
  onResult: (result: GenerateResponse) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function SearchComponent({
  onResult,
  onLoadingChange,
  onError,
}: SearchComponentProps) {
  const [topic, setTopic] = useState("");
  const [direction, setDirection] =
    useState<GenerateRequest["direction"]>("tech");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    onLoadingChange(true);
    onError("");

    try {
      const result = await generateContent({ topic: topic.trim(), direction });
      onResult(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "生成失败，请稍后重试";
      onError(message);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Terminal-style search container */}
      <div
        style={{
          position: "relative",
          background: "rgba(8,8,18,0.6)",
          backdropFilter: "blur(24px)",
          border: `1px solid ${focused ? "rgba(0,240,255,0.18)" : "rgba(255,255,255,0.05)"}`,
          transition: "border-color 0.5s ease, box-shadow 0.5s ease",
          boxShadow: focused
            ? "0 0 40px rgba(0,240,255,0.04), inset 0 1px 0 rgba(255,255,255,0.02)"
            : "inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {/* Top input row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
          }}
        >
          {/* Blinking cursor indicator */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: focused ? "rgba(0,240,255,0.7)" : "rgba(0,240,255,0.3)",
              transition: "color 0.3s ease",
              animation: "cursorPulse 1.2s ease-in-out infinite",
              flexShrink: 0,
            }}
          >
            &gt;
          </span>

          <input
            type="text"
            placeholder="输入主题进行深度检索..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "rgba(240,240,240,0.9)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              background:
                loading || !topic.trim()
                  ? "rgba(255,255,255,0.02)"
                  : "linear-gradient(135deg, rgba(0,240,255,0.12), rgba(0,255,136,0.08))",
              border: `1px solid ${
                loading || !topic.trim()
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,240,255,0.2)"
              }`,
              color:
                loading || !topic.trim()
                  ? "rgba(240,240,240,0.15)"
                  : "rgba(0,240,255,0.9)",
              cursor: loading || !topic.trim() ? "not-allowed" : "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
              flexShrink: 0,
            }}
          >
            {loading ? (
              <Loader2
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : null}
            {loading ? "分析中" : "检索"}
          </button>
        </div>

        {/* Separator */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.08), transparent)",
          }}
        />

        {/* Bottom direction selector row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.5rem 1rem",
            gap: "0.25rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(240,240,240,0.18)",
              marginRight: "0.5rem",
              flexShrink: 0,
            }}
          >
            分类
          </span>
          {DIRECTIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDirection(d.value as GenerateRequest["direction"])}
              style={{
                padding: "0.25rem 0.625rem",
                background:
                  direction === d.value
                    ? "rgba(0,240,255,0.08)"
                    : "transparent",
                border: `1px solid ${
                  direction === d.value
                    ? "rgba(0,240,255,0.2)"
                    : "rgba(255,255,255,0.03)"
                }`,
                color:
                  direction === d.value
                    ? "rgba(0,240,255,0.85)"
                    : "rgba(240,240,240,0.25)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                transition: "all 0.25s ease",
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick suggestions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "rgba(240,240,240,0.18)",
          }}
        >
          TRENDING
        </span>
        {["GPT-5 发布", "量子计算突破", "新能源汽车周报"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTopic(s)}
            style={{
              padding: "0.2rem 0.625rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.04)",
              color: "rgba(240,240,240,0.25)",
              cursor: "pointer",
              fontSize: "0.68rem",
              fontWeight: 300,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0,240,255,0.15)";
              e.currentTarget.style.color = "rgba(0,240,255,0.65)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "rgba(240,240,240,0.25)";
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
