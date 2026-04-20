# SentimentAI - Social Media Sentiment Analysis

A premium SaaS website for analyzing sentiment in social media comments using SVM machine learning.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (Python)
- **ML**: Scikit-learn (TF-IDF + SVM)

## Features

- Real-time sentiment analysis
- Animated, responsive UI with dark theme
- Interactive dashboard with analytics
- Model insights and pipeline visualization
- Glassmorphism design with smooth animations

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### ML Model

The ML model is pre-trained and saved in the `ml/` directory. To retrain:

1. Navigate to the ml directory:
   ```bash
   cd ml
   ```

2. Run the training script:
   ```bash
   python train_model.py
   ```

## Project Structure

```
mini-project-ml/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# Reusable components
│   │   └── ...
├── backend/           # FastAPI application
│   ├── main.py        # API endpoints
│   └── requirements.txt
├── ml/                # Machine learning model
│   ├── train_model.py # Training script
│   ├── model.pkl      # Trained SVM model
│   └── vectorizer.pkl # TF-IDF vectorizer
└── docs/              # Documentation
```

## API Endpoints

- `POST /predict`: Analyze sentiment of text
  - Input: `{"text": "Your comment here"}`
  - Output: `{"sentiment": "positive", "confidence": 0.95}`

## Usage

1. Start the backend server
2. Start the frontend server
3. Open `http://localhost:3000` in your browser
4. Navigate to the Analyzer page
5. Enter a social media comment and click "Analyze"

## Design Philosophy

- Dark theme with subtle gradients and glow effects
- Glassmorphism UI elements
- Smooth Framer Motion animations
- Asymmetric layouts for visual interest
- Premium SaaS aesthetic

## Contributing

This is a demonstration project showcasing modern web development and ML integration.