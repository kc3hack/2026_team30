# app.py
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import json
import random
import numpy as np
import librosa

app = FastAPI()

# CORS設定（ブラウザからアクセスできるように）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# 音声読み込み
# -----------------------------
def load_audio(file):
    y, sr = librosa.load(file.file, sr=16000)
    return y, sr

# -----------------------------
# ダミー音声→テキスト変換
# -----------------------------
def speech_to_text(y, sr):
    return [
        {"timestamp": "00:00:01", "text": "おはようございます！"},
        {"timestamp": "00:00:03", "text": "昨日のミーティングですが、少し問題がありました。"},
        {"timestamp": "00:00:06", "text": "ですが、解決策も考えています。"}
    ]

# -----------------------------
# ダミー感情解析
# -----------------------------
def analyze_emotion(text):
    return {
        "joy": round(random.uniform(0, 1), 2),
        "anger": round(random.uniform(0, 1), 2),
        "sadness": round(random.uniform(0, 1), 2),
        "surprise": round(random.uniform(0, 1), 2)
    }

# -----------------------------
# 声量・ピッチ・速度解析
# -----------------------------
def analyze_audio_features(y, sr):
    volume = float(np.abs(y).mean())
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch = float(np.mean(pitches[pitches > 0])) if np.any(pitches > 0) else 0.0
    tempo = 1.0
    return round(volume, 2), round(pitch, 1), round(tempo, 2)

# -----------------------------
# 音声解析API
# -----------------------------
@app.post("/analyze/")
async def analyze_audio(file: UploadFile):
    y, sr = load_audio(file)
    segments = speech_to_text(y, sr)

    transcription = []
    for seg in segments:
        volume, pitch, tempo = analyze_audio_features(y, sr)
        emotion = analyze_emotion(seg["text"])
        transcription.append({
            "timestamp": seg["timestamp"],
            "text": seg["text"],
            "emotion": emotion,
            "volume": volume,
            "pitch": pitch,
            "tempo": tempo
        })

    return {
        "speaker_id": "user_01",
        "audio_file": file.filename,
        "transcription": transcription
    }
