"use client";

import { Copy, Check, FileText, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ContentTabsProps {
  newsArticle: string;
  socialPost: string;
}

export default function ContentTabs({
  newsArticle,
  socialPost,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"news" | "social">("news");

  return (
    <div>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 0,
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <TabButton
          active={activeTab === "news"}
          onClick={() => setActiveTab("news")}
          icon={<FileText style={{ width: "0.8rem", height: "0.8rem" }} />}
          label="专业新闻稿"
          accentColor="rgba(0,240,255,"
        />
        <TabButton
          active={activeTab === "social"}
          onClick={() => setActiveTab("social")}
          icon={<MessageCircle style={{ width: "0.8rem", height: "0.8rem" }} />}
          label="社交贴片"
          accentColor="rgba(0,255,136,"
        />
      </div>

      {/* Tab content */}
      <div style={{ marginTop: "1rem" }}>
        {activeTab === "news" ? (
          <CopyableContent content={newsArticle} key="news" />
        ) : (
          <CopyableContent content={socialPost} key="social" />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  accentColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.625rem 1rem",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${active ? accentColor + "0.5)" : "transparent"}`,
        color: active ? accentColor + "0.85)" : "rgba(240,240,240,0.2)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.06em",
        transition: "all 0.3s ease",
        marginBottom: "-1px",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function CopyableContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.035)",
        padding: "1.75rem",
        animation: "briefFadeIn 0.4s ease both",
      }}
    >
      {/* Copy button */}
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.375rem 0.75rem",
          background: copied ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${copied ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.06)"}`,
          color: copied ? "rgba(0,255,136,0.8)" : "rgba(240,240,240,0.35)",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.08em",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        {copied ? (
          <Check style={{ width: "0.7rem", height: "0.7rem" }} />
        ) : (
          <Copy style={{ width: "0.7rem", height: "0.7rem" }} />
        )}
        {copied ? "已复制" : "复制"}
      </button>

      {/* Content */}
      <div
        style={{
          fontSize: "0.82rem",
          fontWeight: 300,
          lineHeight: 1.85,
          color: "rgba(240,240,240,0.78)",
          whiteSpace: "pre-wrap",
          paddingRight: "4rem",
        }}
      >
        {content}
      </div>
    </div>
  );
}
