import { AnalyticsResponse, BatchPredictionResponse, ModelType, PredictionResult } from "@/types/analysis";

const BASE_URL = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.detail ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function predictComment(text: string, modelType: ModelType): Promise<PredictionResult> {
  return request<PredictionResult>("/predict", {
    method: "POST",
    body: JSON.stringify({ text, model_type: modelType }),
  });
}

export async function batchPredict(comments: string[], modelType: ModelType): Promise<BatchPredictionResponse> {
  return request<BatchPredictionResponse>("/batch_predict", {
    method: "POST",
    body: JSON.stringify({ comments, model_type: modelType }),
  });
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  return request<AnalyticsResponse>("/analytics");
}
