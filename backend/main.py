from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pickle
import os

app = FastAPI(title="Sentiment Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer
model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'model.pkl')
vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'vectorizer.pkl')

with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(vectorizer_path, 'rb') as f:
    vectorizer = pickle.load(f)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    sentiment: str
    confidence: float

@app.post("/predict", response_model=PredictResponse)
@app.post("/api/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    try:
        text_vec = vectorizer.transform([request.text])
        pred = model.predict(text_vec)[0]
        if hasattr(model, "predict_proba"):
            confidence = float(model.predict_proba(text_vec)[0][pred])
        else:
            confidence_value = model.decision_function(text_vec)[0]
            confidence = float(1 / (1 + abs(confidence_value)))
        sentiment = "positive" if pred == 1 else "negative"
        return PredictResponse(sentiment=sentiment, confidence=confidence)
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Prediction error",
                "error": str(exc),
            },
        )

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Sentiment Analysis API"}

@app.get("/")
async def root():
    return {"message": "Sentiment Analysis API"}