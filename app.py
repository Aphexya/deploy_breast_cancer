from flask import Flask, request, render_template
import joblib
import numpy as np

app = Flask(__name__)

# Load model dan scaler
model = joblib.load("best_model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Ambil semua input dari form dan ubah ke float
        features = [float(x) for x in request.form.values()]
        features_array = np.array(features).reshape(1, -1)

        # Normalisasi
        features_scaled = scaler.transform(features_array)

        # Prediksi
        prediction = model.predict(features_scaled)[0]
        label = "Malignant (Ganas)" if prediction == 1 else "Benign (Jinak)"
        return render_template("index.html", prediction=label)

    except:
        return render_template("index.html", prediction="❌ Input tidak valid!")

if __name__ == "__main__":
    app.run(debug=True)
