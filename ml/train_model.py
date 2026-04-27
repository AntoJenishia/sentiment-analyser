import json
import os
import pickle
import re
from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC

SENTIMENT140_PATH = os.path.join(os.path.dirname(__file__), "data", "sentiment140.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "vectorizer.pkl")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "metrics.json")
LABEL_ORDER = ["negative", "neutral", "positive"]
NEUTRAL_SEED_TEXTS = [
    "I received the package today.",
    "The update was released this morning.",
    "I am using the app on my phone.",
    "The event starts at 7 PM.",
    "I read the post and shared it.",
    "The meeting has been moved to Friday.",
    "This is a general status update.",
    "I tested the feature on Windows.",
    "The order number is in the email.",
    "I watched the video and took notes.",
]


def normalize_text(text: str) -> str:
    emoji_map = {
        ":)": " smile ",
        ":-)": " smile ",
        ":(": " sad ",
        ":-(": " sad ",
        "<3": " love ",
        "😂": " laugh ",
        "😍": " love ",
        "😭": " cry ",
        "😡": " angry ",
        "😢": " sad ",
    }
    slang_map = {
        "idk": "i do not know",
        "imo": "in my opinion",
        "imho": "in my humble opinion",
        "omg": "oh my god",
        "wtf": "what the heck",
        "gr8": "great",
        "luv": "love",
        "u": "you",
        "ur": "your",
    }

    cleaned = text.lower()
    for token, replacement in emoji_map.items():
        cleaned = cleaned.replace(token, replacement)
    cleaned = re.sub(r"http\S+|www\.\S+", " ", cleaned)
    cleaned = re.sub(r"@\w+", " ", cleaned)
    cleaned = re.sub(r"#(\w+)", r"\1", cleaned)
    cleaned = re.sub(r"[^\w\s!?]", " ", cleaned)
    tokens = cleaned.split()
    normalized_tokens = [slang_map.get(token, token) for token in tokens]
    return re.sub(r"\s+", " ", " ".join(normalized_tokens)).strip()


def map_sentiment140_label(label: int) -> str:
    if label == 0:
        return "negative"
    if label == 2:
        return "neutral"
    if label == 4:
        return "positive"
    return "neutral"


def load_dataset(min_samples: int = 20000) -> pd.DataFrame:
    if not os.path.exists(SENTIMENT140_PATH):
        raise FileNotFoundError(
            f"Expected Kaggle-style dataset at {SENTIMENT140_PATH}. "
            "Download Sentiment140 CSV and place it at this location."
        )

    frame = pd.read_csv(
        SENTIMENT140_PATH,
        encoding="latin-1",
        header=None,
        names=["target", "ids", "date", "flag", "user", "text"],
    )
    frame = frame[["target", "text"]].copy()
    frame["sentiment"] = frame["target"].map(map_sentiment140_label)
    frame["clean_text"] = frame["text"].astype(str).map(normalize_text)
    frame = frame[frame["clean_text"].str.len() > 2].reset_index(drop=True)

    # Sentiment140 usually has only negative (0) and positive (4).
    # For 3-class training, synthesize a neutral slice when it is missing.
    class_counts = frame["sentiment"].value_counts().to_dict()
    neutral_count = class_counts.get("neutral", 0)
    if neutral_count < 100:
        target_neutral = max(2000, int(0.1 * max(len(frame), min_samples)))
        synthetic_neutral = pd.DataFrame(
            {
                "target": [2] * target_neutral,
                "text": [NEUTRAL_SEED_TEXTS[i % len(NEUTRAL_SEED_TEXTS)] for i in range(target_neutral)],
                "sentiment": ["neutral"] * target_neutral,
                "clean_text": [normalize_text(NEUTRAL_SEED_TEXTS[i % len(NEUTRAL_SEED_TEXTS)]) for i in range(target_neutral)],
            }
        )
        frame = pd.concat([frame, synthetic_neutral], ignore_index=True)

    if len(frame) < min_samples:
        sampled = frame.sample(n=min_samples, replace=True, random_state=42)
        frame = sampled.reset_index(drop=True)
    else:
        frame = frame.sample(n=min_samples, random_state=42).reset_index(drop=True)

    return frame


def balance_by_class(frame: pd.DataFrame) -> pd.DataFrame:
    grouped = frame.groupby("sentiment")
    max_count = grouped.size().max()
    balanced = []
    for sentiment, group in grouped:
        balanced.append(group.sample(n=max_count, replace=True, random_state=42))
    return pd.concat(balanced).sample(frac=1.0, random_state=42).reset_index(drop=True)


@dataclass
class CandidateResult:
    name: str
    model: object
    macro_f1: float
    report: Dict[str, Dict[str, float]]


def train_and_compare_models(
    x_train_vec, x_test_vec, y_train: List[str], y_test: List[str]
) -> CandidateResult:
    candidates = {
        "logistic_regression": LogisticRegression(max_iter=500, class_weight="balanced"),
        "svm": CalibratedClassifierCV(LinearSVC(max_iter=10000, dual=False), cv=2),
        "naive_bayes": MultinomialNB(),
    }
    results: List[CandidateResult] = []

    for name, model in candidates.items():
        try:
            model.fit(x_train_vec, y_train)
            predictions = model.predict(x_test_vec)
            macro_f1 = f1_score(y_test, predictions, average="macro")
            report = classification_report(y_test, predictions, output_dict=True)
            results.append(CandidateResult(name=name, model=model, macro_f1=macro_f1, report=report))
        except Exception as exc:
            print(f"Skipping candidate {name}: {exc}")

    if not results:
        raise RuntimeError("All candidate models failed to train.")
    return max(results, key=lambda item: item.macro_f1)


def top_keywords_per_label(model, vectorizer, top_k: int = 25) -> Dict[str, List[str]]:
    if not hasattr(model, "coef_"):
        return {}
    feature_names = np.array(vectorizer.get_feature_names_out())
    classes = list(getattr(model, "classes_", []))
    weights = model.coef_

    keyword_map: Dict[str, List[str]] = {}
    for class_index, class_name in enumerate(classes):
        top_indices = np.argsort(weights[class_index])[-top_k:]
        keyword_map[class_name] = feature_names[top_indices].tolist()[::-1]
    return keyword_map


def main() -> None:
    dataset = balance_by_class(load_dataset(min_samples=20000))
    X_train, X_test, y_train, y_test = train_test_split(
        dataset["clean_text"].tolist(),
        dataset["sentiment"].tolist(),
        test_size=0.2,
        random_state=42,
        stratify=dataset["sentiment"].tolist(),
    )

    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        stop_words="english",
        sublinear_tf=True,
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    best = train_and_compare_models(X_train_vec, X_test_vec, y_train, y_test)
    keyword_map = top_keywords_per_label(best.model, vectorizer)

    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(best.model, model_file)
    with open(VECTORIZER_PATH, "wb") as vectorizer_file:
        pickle.dump(vectorizer, vectorizer_file)

    all_scores = {}
    for name in ["logistic_regression", "svm", "naive_bayes"]:
        all_scores[name] = None
    all_scores[best.name] = best.macro_f1

    metrics = {
        "label_order": LABEL_ORDER,
        "training_rows": int(len(dataset)),
        "best_model": best.name,
        "best_macro_f1": round(float(best.macro_f1), 4),
        "best_report": best.report,
        "top_keywords_by_label": keyword_map,
    }
    with open(METRICS_PATH, "w", encoding="utf-8") as metrics_file:
        json.dump(metrics, metrics_file, indent=2)

    print(f"Training complete. Best model: {best.name} (macro F1={best.macro_f1:.4f})")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Vectorizer saved to: {VECTORIZER_PATH}")
    print(f"Metrics saved to: {METRICS_PATH}")


if __name__ == "__main__":
    main()