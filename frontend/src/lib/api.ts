import axios from "axios";
import type { GenerateRequest, GenerateResponse } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 60000,
});

export async function generateContent(
  req: GenerateRequest
): Promise<GenerateResponse> {
  const { data } = await api.post<GenerateResponse>(
    "/api/generate-content",
    req
  );
  return data;
}
