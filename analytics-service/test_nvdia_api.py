import requests
import os

# Replace with your NVIDIA or Hugging Face API key
API_KEY = "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"

# Correct endpoint for Llama 3.1 Nemotron
URL = "https://api-inference.huggingface.co/models/nvidia/llama-3.1-nemotron-70b-instruct"

# The prompt you want to test
data = {
    "inputs": "Hello, how are you?"
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(URL, json=data, headers=headers)

if response.status_code == 200:
    print("✅ API Key is valid. Model output:")
    print(response.json())
else:
    print(f"❌ API Key failed with status {response.status_code}: {response.text}")

