# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (optional but recommended for some libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Command to run the Flask app
#CMD ["flask", "run"]
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

