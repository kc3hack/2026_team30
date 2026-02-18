# app.py

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import librosa
import numpy as np
import whisper
import tempfile
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静的ファイル配信（index.html など）
import os as os_module
app_dir = os_module.path.dirname(os_module.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=app_dir), name="static")

# ルートで index.html を返す
@app.get("/")
async def root():
    index_path = os_module.path.join(app_dir, "index.html")
    return FileResponse(index_path)

# -----------------------------
# モデルロード（起動時に一度だけ）
# -----------------------------

# Whisper（文字起こし）
whisper_model = whisper.load_model("base")

# -----------------------------
# 音声読み込み
# -----------------------------
def load_audio(path):
    y, sr = librosa.load(path, sr=16000)
    return y, sr

# -----------------------------
# 文字起こし
# -----------------------------
def speech_to_text(path):
    result = whisper_model.transcribe(path, language="ja")
    return result["text"]

# -----------------------------
# 音声特徴量解析
# -----------------------------
def analyze_audio_features(y, sr):
    volume = float(np.abs(y).mean())

    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 0]

    if len(pitch_values) > 0:
        pitch = float(np.mean(pitch_values))
    else:
        pitch = 0.0

    return volume, pitch

# -----------------------------
# 感情認識（SpeechBrain サービスへ委譲。未接続時はローカルヒューリスティックにフォールバック）
# -----------------------------
import requests

SPEECHBRAIN_URL = os.environ.get("SPEECHBRAIN_URL", "http://speechbrain:8001/classify/")


def _local_emotion_heuristic(path):
    y, sr = librosa.load(path, sr=16000)
    volume = float(np.abs(y).mean())
    pitches, _ = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 0]
    pitch = float(np.mean(pitch_values)) if len(pitch_values) > 0 else 0.0

    label = "neutral"
    confidence = 0.5
    if pitch > 150 and volume > 0.02:
        label = "happy"
        confidence = 0.8
    elif pitch > 150:
        label = "happy"
        confidence = 0.6
    elif pitch < 100 and volume < 0.01:
        label = "sad"
        confidence = 0.6
    return label, confidence


def analyze_emotion(path):
    """Try SpeechBrain service first; on error use local heuristic."""
    try:
        with open(path, "rb") as fh:
            files = {"file": (os.path.basename(path), fh, "audio/wav")}
            resp = requests.post(SPEECHBRAIN_URL, files=files, timeout=60)
        if resp.status_code == 200:
            j = resp.json()
            print(f"SpeechBrain service response: {j}")
            return j.get("label", "neutral"), float(j.get("confidence", 0.5))
        else:
            print(f"SpeechBrain service error: {resp.status_code} {resp.text}")
            return _local_emotion_heuristic(path)
    except Exception:
        print("SpeechBrain service not available, using local heuristic.")
        return _local_emotion_heuristic(path)

# ヘルパー：ラベル -> デモ表示用スコア（joy/anger/sadness）
def map_emotion_label_to_scores(label: str, confidence: float):
    scores = {"joy": 0.0, "anger": 0.0, "sadness": 0.0}
    if not label:
        return scores
    l = label.lower()
    if l in ("happy", "joy", "joyful", "excited"):
        scores["joy"] = confidence
    elif l in ("angry", "anger", "frustrated"):
        scores["anger"] = confidence
    elif l in ("sad", "sadness", "depressed"):
        scores["sadness"] = confidence
    else:
        # neutral / other -> keep zeros
        pass
    return scores

# -----------------------------
# API
# -----------------------------
@app.post("/analyze/")
async def analyze_audio(file: UploadFile):

    # 一時保存
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        # 音声読み込み
        y, sr = load_audio(tmp_path)

        # 文字起こし
        text = speech_to_text(tmp_path)

        # 声量・ピッチ
        volume, pitch = analyze_audio_features(y, sr)

        # 感情
        emotion_label, confidence = analyze_emotion(tmp_path)

        emotion_scores = map_emotion_label_to_scores(emotion_label, confidence)

        return {
            "speaker_id": "user_01",
            "audio_file": file.filename,
            "transcription": [
                {
                    "timestamp": "00:00:00",
                    "text": text,
                    "emotion_label": emotion_label,
                    "emotion_confidence": confidence,
                    "emotion": emotion_scores,
                    "volume": volume,
                    "pitch": pitch
                }
            ]
        }
    finally:
        # クリーンアップ
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.get("/health")
async def health():
    return {"status": "ok"}
