import pickle
import os

base = os.path.dirname(__file__)
model_path = os.path.join(base, '..', 'ml', 'model.pkl')
vectorizer_path = os.path.join(base, '..', 'ml', 'vectorizer.pkl')
print('model path', model_path)
print('vectorizer path', vectorizer_path)
with open(model_path, 'rb') as f:
    model = pickle.load(f)
with open(vectorizer_path, 'rb') as f:
    vectorizer = pickle.load(f)
print('loaded', type(model), type(vectorizer))
test_sentences = [
    "I love this product",
    "I couldn't be happier with my decision to buy from this company. Product quality is excellent.",
]
for text in test_sentences:
    vec = vectorizer.transform([text])
    print('\ntext:', text)
    print('vec shape', vec.shape)
    pred = model.predict(vec)[0]
    print('pred', pred)
    if hasattr(model, 'predict_proba'):
        print('proba', model.predict_proba(vec)[0])
    else:
        print('decision', model.decision_function(vec)[0])
