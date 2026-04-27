from collections import Counter
from datetime import datetime
import json
import os
import pickle
import re
from typing import Dict, List

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

try:
    from transformers import pipeline
except Exception:
    pipeline = None

app = FastAPI(title="Sentiment Analysis API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "..", "ml", "vectorizer.pkl")
metrics_path = os.path.join(os.path.dirname(__file__), "..", "ml", "metrics.json")

with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

with open(vectorizer_path, "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

metrics = {}
if os.path.exists(metrics_path):
    with open(metrics_path, "r", encoding="utf-8") as metrics_file:
        metrics = json.load(metrics_file)

analysis_history: List[Dict] = []
bert_analyzer = None


class PredictRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    text: str
    model_type: str = Field(default="classical", pattern="^(classical|transformer)$")


class BatchPredictRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    comments: List[str] = Field(min_length=1, max_length=500)
    model_type: str = Field(default="classical", pattern="^(classical|transformer)$")


class PredictionOutput(BaseModel):
    sentiment: str
    confidence: float
    probabilities: Dict[str, float]
    emotions: Dict[str, float]
    influential_keywords: List[str]


class PredictResponse(PredictionOutput):
    text: str


class BatchPredictResponse(BaseModel):
    predictions: List[PredictResponse]
    summary: Dict[str, Dict[str, float]]


def normalize_text(text: str) -> str:
    cleaned = text.lower()
    cleaned = re.sub(r"http\S+|www\.\S+", " ", cleaned)
    cleaned = re.sub(r"@\w+", " ", cleaned)
    cleaned = re.sub(r"#(\w+)", r"\1", cleaned)
    cleaned = re.sub(r"[^\w\s!?]", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def detect_emotions(text: str, sentiment: str = "neutral", confidence: float = 0.5) -> Dict[str, float]:
    tokens = normalize_text(text).split()
    token_set = set(tokens)
    lexicon = {
        "happy": {
            "great", "love", "amazing", "excited", "awesome", "joy", "win", "nice",
            "good", "excellent", "best", "fantastic", "wonderful", "happy",
        },
        "angry": {
            "hate", "awful", "terrible", "annoyed", "furious", "worst", "angry", "sucks",
            "suck", "pathetic", "useless", "trash", "garbage", "disgusting", "stupid",
        },
        "sad": {
            "sad", "disappointed", "cry", "upset", "depressed", "hurt", "alone", "tired",
            "unhappy", "hopeless", "bad", "regret",
        },
        "neutral": {"okay", "fine", "normal", "average", "neutral", "moderate", "maybe", "perhaps"},
    }
    raw = {emotion: float(len(token_set.intersection(words))) for emotion, words in lexicon.items()}

    # If lexicon hits are weak, bias by model sentiment so output does not stay static.
    if sum(raw.values()) < 1:
        if sentiment == "positive":
            raw["happy"] += 1.2 + confidence
            raw["neutral"] += 0.4
        elif sentiment == "negative":
            raw["angry"] += 0.8 + confidence
            raw["sad"] += 0.5 + (confidence / 2)
            raw["neutral"] += 0.2
        else:
            raw["neutral"] += 1.4
            raw["happy"] += 0.2
            raw["sad"] += 0.2

    # Add lightweight stylistic cues.
    exclamations = text.count("!")
    if exclamations >= 2 and sentiment == "negative":
        raw["angry"] += 0.5
    elif exclamations >= 2 and sentiment == "positive":
        raw["happy"] += 0.5

    total = sum(raw.values())
    if total <= 0:
        return {"happy": 0.25, "angry": 0.25, "sad": 0.2, "neutral": 0.3}
    return {emotion: round(value / total, 4) for emotion, value in raw.items()}


def get_top_keywords(text: str, sentiment: str, max_items: int = 7) -> List[str]:
    cleaned_text = normalize_text(text)
    vec = vectorizer.transform([cleaned_text])
    if vec.nnz == 0:
        return []
    feature_names = np.array(vectorizer.get_feature_names_out())
    row = vec.tocoo()
    class_idx = 0
    if hasattr(model, "classes_"):
        classes = list(model.classes_)
        if sentiment in classes:
            class_idx = classes.index(sentiment)

    weighted_terms = []
    for col, value in zip(row.col, row.data):
        score = value
        if hasattr(model, "coef_"):
            score = value * float(model.coef_[class_idx][col])
        weighted_terms.append((feature_names[col], score))

    ranked = sorted(weighted_terms, key=lambda item: item[1], reverse=True)
    keywords = []
    seen = set()
    for token, _ in ranked:
        if len(token) < 3 or token in seen:
            continue
        seen.add(token)
        keywords.append(token)
        if len(keywords) == max_items:
            break
    return keywords


def get_transformer_pipeline():
    global bert_analyzer
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Install transformers to use model_type=transformer")
    if bert_analyzer is None:
        bert_analyzer = pipeline(
            "text-classification",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest",
            top_k=None,
        )
    return bert_analyzer


def classical_predict(text: str) -> PredictionOutput:
    cleaned_text = normalize_text(text)
    text_vec = vectorizer.transform([cleaned_text])
    sentiment = str(model.predict(text_vec)[0])
    if hasattr(model, "predict_proba"):
        classes = list(model.classes_)
        probs = model.predict_proba(text_vec)[0]
        probabilities = {classes[i]: float(probs[i]) for i in range(len(classes))}
    else:
        classes = list(model.classes_)
        scores = np.atleast_1d(model.decision_function(text_vec)[0])
        exp_scores = np.exp(scores - np.max(scores))
        softmax = exp_scores / exp_scores.sum()
        probabilities = {classes[i]: float(softmax[i]) for i in range(len(classes))}

    for label in ["negative", "neutral", "positive"]:
        probabilities.setdefault(label, 0.0)
    return PredictionOutput(
        sentiment=sentiment,
        confidence=round(probabilities[sentiment], 4),
        probabilities={k: round(v, 4) for k, v in probabilities.items()},
        emotions=detect_emotions(text, sentiment, float(probabilities[sentiment])),
        influential_keywords=get_top_keywords(text, sentiment),
    )


def transformer_predict(text: str) -> PredictionOutput:
    predictor = get_transformer_pipeline()
    result = predictor(text)[0]
    probabilities = {"negative": 0.0, "neutral": 0.0, "positive": 0.0}
    for item in result:
        label = item["label"].lower()
        if "neg" in label:
            probabilities["negative"] = float(item["score"])
        elif "neu" in label:
            probabilities["neutral"] = float(item["score"])
        else:
            probabilities["positive"] = float(item["score"])

    sentiment = max(probabilities, key=probabilities.get)
    return PredictionOutput(
        sentiment=sentiment,
        confidence=round(probabilities[sentiment], 4),
        probabilities={k: round(v, 4) for k, v in probabilities.items()},
        emotions=detect_emotions(text, sentiment, float(probabilities[sentiment])),
        influential_keywords=get_top_keywords(text, sentiment),
    )


def predict_comment(text: str, model_type: str) -> PredictResponse:
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    result = transformer_predict(text) if model_type == "transformer" else classical_predict(text)
    analysis_history.insert(
        0,
        {
            "text": text,
            "sentiment": result.sentiment,
            "confidence": result.confidence,
            "created_at": datetime.utcnow().isoformat(),
            "model_type": model_type,
        },
    )
    del analysis_history[200:]
    return PredictResponse(text=text, **result.model_dump())


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    return predict_comment(request.text, request.model_type)


@app.post("/api/predict", response_model=PredictResponse)
async def api_predict(request: PredictRequest):
    return predict_comment(request.text, request.model_type)


@app.post("/batch_predict", response_model=BatchPredictResponse)
async def batch_predict(request: BatchPredictRequest):
    predictions = [predict_comment(text, request.model_type) for text in request.comments]
    sentiments = Counter(item.sentiment for item in predictions)
    total = len(predictions)
    summary = {
        "distribution": {label: round(count / total, 4) for label, count in sentiments.items()},
        "avg_confidence": {"overall": round(float(np.mean([item.confidence for item in predictions])), 4)},
    }
    return BatchPredictResponse(predictions=predictions, summary=summary)


@app.get("/analytics")
async def analytics():
    sentiments = Counter(item["sentiment"] for item in analysis_history)
    emotion_totals = Counter()
    for item in analysis_history:
        emotion = detect_emotions(item["text"])
        emotion_totals.update({k: int(v * 100) for k, v in emotion.items()})
    return {
        "total_requests": len(analysis_history),
        "sentiment_distribution": dict(sentiments),
        "emotion_breakdown": dict(emotion_totals),
        "recent_history": analysis_history[:20],
        "model_info": {
            "best_model": metrics.get("best_model", "svm"),
            "best_macro_f1": metrics.get("best_macro_f1"),
        },
    }


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Sentiment Analysis API", "version": "2.0.0"}


@app.get("/")
async def root():
    return {"message": "Sentiment Analysis API", "docs": "/docs"}