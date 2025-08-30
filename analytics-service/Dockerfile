# --- 1. Builder Stage ---
FROM python:3.12 AS builder

WORKDIR /app

# Copy only the requirements file and install dependencies to leverage Docker's cache
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir=/usr/src/app/wheels -r requirements.txt

# --- 2. Production Stage ---
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy wheels from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/* \
    && rm -rf /wheels

# Copy the rest of the application code
COPY . .

# Create a dedicated non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Expose the application port
EXPOSE 8000

# Define the command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]

# test