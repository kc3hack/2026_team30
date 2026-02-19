FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 先にsetuptoolsを固定
RUN pip install --upgrade pip \
    && pip install "setuptools<70" wheel

COPY requirements.txt .

# 👇 ここが超重要
RUN pip install --no-cache-dir --no-build-isolation -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
