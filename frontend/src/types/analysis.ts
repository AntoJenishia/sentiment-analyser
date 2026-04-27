export type SentimentLabel = "positive" | "negative" | "neutral";
export type ModelType = "classical" | "transformer";

export interface PredictionResult {
  text: string;
  sentiment: SentimentLabel;
  confidence: number;
  probabilities: Record<SentimentLabel, number>;
  emotions: Record<"happy" | "angry" | "sad" | "neutral", number>;
  influential_keywords: string[];
}

export interface BatchPredictionResponse {
  predictions: PredictionResult[];
  summary: {
    distribution: Record<string, number>;
    avg_confidence: {
      overall: number;
    };
  };
}

export interface AnalyticsResponse {
  total_requests: number;
  sentiment_distribution: Record<string, number>;
  emotion_breakdown: Record<string, number>;
  recent_history: Array<{
    text: string;
    sentiment: SentimentLabel;
    confidence: number;
    created_at: string;
    model_type: ModelType;
  }>;
  model_info: {
    best_model: string;
    best_macro_f1?: number;
  };
}
