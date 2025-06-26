from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('model_breast_cancer.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    features = [float(request.form[f'feature{i}']) for i in range(1, 31)]
    prediction = model.predict([features])[0]
    result = "Malignant" if prediction == 1 else "Benign"
    return render_template('index.html', prediction_text=f'Hasil Prediksi: {result}')

if __name__ == '__main__':
    app.run(debug=True)
