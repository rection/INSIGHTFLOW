export interface Source {
  title: string;
  url: string;
  snippet: string;
  published_date: string | null;
}

export interface GenerateRequest {
  topic: string;
  direction: "tech" | "lifestyle" | "finance" | "custom";
}

export interface GenerateResponse {
  sources: Source[];
  news_article: string;
  social_post: string;
}
