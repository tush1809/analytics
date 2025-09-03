# analytics-service/app.py - Gemini-Integrated Version

# --- 1. IMPORTS ---
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import pandas as pd
import pickle
import json
import requests

# --- 2. INITIALIZATION AND CONFIGURATION ---
load_dotenv()
app = Flask(__name__)

# --- Load the scikit-learn model and encoders ---
try:
    with open('model/churn_model.pkl', 'rb') as f:
        model_data = pickle.load(f)
        model = model_data['model']
    with open('model/encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
    print("Analytics model and encoders loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR: Could not load model files. Error: {e}")
    model = None
    encoders = {}

# --- 3. HELPER FUNCTION TO CALL GEMINI API ---
def get_insights_from_gemini(prediction_data):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        return {"error": "GEMINI_API_KEY is not set."}

    prompt_text = f"""
You are an expert business analyst for a SaaS company. Analyze this churn data:
{prediction_data}
Return a JSON object with keys: "overview", "churn_rate_insights", "plan_distribution_insights", "business_recommendations".
Do not output anything else.
"""

    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    }

    payload = {
        "contents": [
            {"parts": [{"text": prompt_text}]}
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result_text = response.json()["candidates"][0]["content"][0]["text"]
        return json.loads(result_text)
    except Exception as e:
        print(f"Gemini API request failed: {e}")
        return {"error": str(e)}

# --- 4. MAIN ANALYSIS ROUTE ---
@app.route('/api/analyze', methods=['POST'])
def analyze_data():
    if not model:
        return jsonify({'message': 'Model is not loaded, cannot perform analysis.'}), 500

    customer_data_json = request.get_json()
    if not customer_data_json:
        return jsonify({'message': 'No customer data provided.'}), 400

    try:
        data = pd.DataFrame(customer_data_json)

        subscription_plan_distribution = data['subscription_plan'].value_counts().to_dict()

        for column, encoder in encoders.items():
            if column in data.columns:
                data[column] = data[column].apply(
                    lambda x: encoder.transform([x])[0] if x in encoder.classes_ else -1
                )
                data = data[data[column] != -1]

        if data.empty:
            return jsonify({'message': 'No valid data to analyze after processing.'}), 400

        predictions = model.predict(data)
        prediction_probabilities = model.predict_proba(data)[:, 1]
        data["Prediction"] = ["Churn" if pred == 1 else "No Churn" for pred in predictions]
        data["Prediction_Probability"] = prediction_probabilities

        churn_rate = (data["Prediction"] == "Churn").sum() / len(data) * 100 if len(data) > 0 else 0

        top_3_at_risk = data[data["Prediction"] == "Churn"].sort_values(
            by="Prediction_Probability", ascending=False
        ).head(3)

        prediction_results = {
            "churn_rate": churn_rate,
            "subscription_plan_distribution": subscription_plan_distribution,
            "top_3_customers_at_risk": top_3_at_risk.to_dict(orient="records")
        }

        insight_results = get_insights_from_gemini(prediction_results)

        final_response = {
            "prediction_results": prediction_results,
            "insight_results": insight_results
        }
        return jsonify(final_response), 200

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return jsonify({'message': f"An error occurred during analysis: {str(e)}"}), 500

# --- 5. ROOT ROUTE AND ENDPOINT LISTING ---
@app.route("/", methods=["GET"])
def home():
    return "Analytics"

@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok"}, 200

