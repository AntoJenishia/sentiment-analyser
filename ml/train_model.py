import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score

# Training data drawn from positive and negative comment examples
positive_texts = [
    "I love this product, it's amazing!",
    "This made my day, I'm very impressed.",
    "Excellent service and fast delivery.",
    "Fantastic experience, will buy again.",
    "Superb quality and highly recommended.",
    "Thrilled with the results, the product is outstanding.",
    "The team was helpful and the app exceeded expectations.",
    "This is one of the best purchases I've made.",
    "Really satisfied with the quality and support.",
    "I'm so happy with this service.",
    "Positive outcome and excellent performance.",
    "Best decision ever, amazing quality.",
    "I couldn't be happier with my experience.",
    "The product is outstanding and I recommend it.",
    "Beautiful design and flawless execution.",
    "This exceeded my expectations in every way.",
    "I was impressed by how smooth and fast it is.",
    "The quality is exceptional and the support is great.",
    "Very pleased with my purchase and the overall experience.",
    "Highly recommend this product to everyone.",
    "I feel confident using this every day.",
    "The results were clear and exactly what I needed.",
    "This service is excellent and worth every penny.",
    "Strongly recommend this to anyone looking for quality.",
    "This product works perfectly and the interface is lovely.",
    "The outcome was fast, accurate, and delightful.",
    "I'm genuinely impressed by the reliability.",
    "The experience has been smooth and enjoyable.",
    "This feels premium and works beautifully.",
    "I noticed improvement immediately after using it.",
]

negative_texts = [
    "This is terrible, I hate it.",
    "Worst purchase ever, do not buy.",
    "Poor quality, extremely disappointed.",
    "Awful experience, complete waste of money.",
    "Horrible support and broken features.",
    "I regret buying this product.",
    "The service was frustrating and slow.",
    "Not worth the price, very unhappy.",
    "This failed to meet basic expectations.",
    "Terrible user experience and poor quality.",
    "I wouldn't recommend this to anyone.",
    "The product is disappointing and buggy.",
    "It made my workflow worse, not better.",
    "Bad performance and slow response.",
    "The quality feels cheap and unreliable.",
    "This was a frustrating and confusing experience.",
    "The interface is clunky and hard to use.",
    "Support was no help and the issue persisted.",
    "I'm unhappy with the slow performance.",
    "It keeps crashing and losing my work.",
    "There are too many bugs and missing features.",
    "I feel disappointed by the misleading claims.",
    "The product did not deliver what was promised.",
    "I had a negative experience and won't return.",
    "This feels rushed and unfinished.",
    "The results were inaccurate and frustrating.",
    "I would avoid this product in the future.",
    "The pricing isn't justified by the value.",
    "I lost time trying to make this work.",
    "The support team was unresponsive and unhelpful.",
]

texts = positive_texts + negative_texts
labels = [1] * len(positive_texts) + [0] * len(negative_texts)

X_train, X_test, y_train, y_test = train_test_split(
    texts,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels,
)

vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

base_model = LinearSVC(random_state=42, max_iter=10000, dual=False)
model = CalibratedClassifierCV(base_model, cv=3)
model.fit(X_train_vec, y_train)

# Evaluate
y_pred = model.predict(X_test_vec)
y_proba = model.predict_proba(X_test_vec)[:, 1]
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"Sample positive probabilities: {y_proba[:5]}")

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("Model and vectorizer saved.")