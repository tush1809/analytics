# --- 1. Base image ---
FROM python:3.12-slim

# --- 2. Set environment variables ---
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# --- 3. Set work directory ---
WORKDIR /app

# --- 4. Install system dependencies ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# --- 5. Copy requirements and install ---
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# --- 6. Copy project files ---
COPY . .

# --- 7. Expose port ---
EXPOSE 5001

# --- 8. Start the app with Gunicorn ---
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--workers", "3", "app:app"]

