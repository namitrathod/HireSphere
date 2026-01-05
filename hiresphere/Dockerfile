FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install system dependencies (needed for PDF parsing/Postgres)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Default command (will be overridden by docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]