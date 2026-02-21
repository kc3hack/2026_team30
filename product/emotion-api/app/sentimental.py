import torch
import librosa
import numpy as np
import json
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification


# =============================
# モデル読み込み（起動時1回）
# =============================
model_name = "superb/wav2vec2-base-superb-er"

feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)

model.eval()


# =============================
# dB → フォントサイズ変換
# =============================
def db_to_fontsize(db):
    MIN_DB = -60
    MAX_DB = -10
    MIN_FONT = 14
    MAX_FONT = 48

    normalized = (db - MIN_DB) / (MAX_DB - MIN_DB)
    normalized = max(0, min(1, normalized))

    font_size = MIN_FONT + normalized * (MAX_FONT - MIN_FONT)
    return round(font_size, 1)


# =============================
# 1区間の感情分析（numpy配列入力）
# =============================
def analyze_chunk(chunk, sr, seg_id, start, end, text=""):

    if len(chunk) == 0:
        return {
            "id": seg_id,
            "start": start,
            "end": end,
            "error": "Empty audio segment"
        }

    # ===== 音量計算 =====
    rms = np.sqrt(np.mean(chunk ** 2))
    db = 20 * np.log10(rms + 1e-6)

    # ===== 特徴量抽出 =====
    inputs = feature_extractor(
        chunk,
        sampling_rate=sr,
        return_tensors="pt",
        padding=True
    )

    # ===== 推論 =====
    with torch.no_grad():
        logits = model(**inputs).logits

    probs = torch.softmax(logits, dim=-1).squeeze().tolist()

    emotion_scores = {
        model.config.id2label[i]: float(probs[i])
        for i in range(len(probs))
    }

    predicted_emotion = max(emotion_scores, key=emotion_scores.get)

    if predicted_emotion == "hap":
        color = "#FFD700"  # 金色
    elif predicted_emotion == "ang":
        color = "#FF4500"  # オレンジレッド
    elif predicted_emotion == "sad":
        color = "#4A90E2"  # ブルー
    else:
        color = "#333333"  # ダークグレー

    font_size = db_to_fontsize(db)

    return {
        "id": seg_id,
        "start": start,
        "end": end,
        "text": text,
        "predicted_emotion": predicted_emotion,
        "emotion_scores": emotion_scores,
        "volume_rms": float(rms),
        "volume_db": float(db),
        "font_size": float(font_size),
        "color": color
    }


# =============================
# メイン処理
# JSONに従って分割 → 感情分析
# =============================
def analyze_audio_by_json(audio_path, segments):

    # 音声は一度だけロード（超重要）
    speech, sr = librosa.load(audio_path, sr=16000)

    results = []

    audio_length = len(speech) / sr

    for segment in segments:
        seg_id = segment["id"]
        start = float(segment["start"])
        end = float(segment["end"])
        text = segment.get("text", "")

        # 安全処理
        if start < 0:
            start = 0
        if end > audio_length:
            end = audio_length
        if start >= end:
            continue

        # 秒 → サンプル
        start_sample = int(start * sr)
        end_sample = int(end * sr)

        chunk = speech[start_sample:end_sample]

        result = analyze_chunk(
            chunk,
            sr,
            seg_id,
            start,
            end,
            text
        )

        results.append(result)

    return results

def analyze_audio_by_json_docs(audio_path, segments):

    # 音声は一度だけロード（超重要）
    speech, sr = librosa.load(audio_path, sr=16000)

    results = []

    audio_length = len(speech) / sr

    for segment in segments:
        seg_id = segment["id"]
        speaker = segment["speaker"]
        start = float(segment["start"])
        end = float(segment["end"])
        text = segment.get("text", "")

        # 安全処理
        if start < 0:
            start = 0
        if end > audio_length:
            end = audio_length
        if start >= end:
            continue

        # 秒 → サンプル
        start_sample = int(start * sr)
        end_sample = int(end * sr)

        chunk = speech[start_sample:end_sample]

        result = analyze_chunk_docs(
            chunk,
            sr,
            seg_id,
            speaker,
            start,
            end,
            text
        )

        results.append(result)

    return results

def analyze_chunk_docs(chunk, sr, seg_id, speaker, start, end, text=""):

    if len(chunk) == 0:
        return {
            "id": seg_id,
            "speaker": speaker,
            "start": start,
            "end": end,
            "error": "Empty audio segment"
        }

    # ===== 音量計算 =====
    rms = np.sqrt(np.mean(chunk ** 2))
    db = 20 * np.log10(rms + 1e-6)

    # ===== 特徴量抽出 =====
    inputs = feature_extractor(
        chunk,
        sampling_rate=sr,
        return_tensors="pt",
        padding=True
    )

    # ===== 推論 =====
    with torch.no_grad():
        logits = model(**inputs).logits

    probs = torch.softmax(logits, dim=-1).squeeze().tolist()

    emotion_scores = {
        model.config.id2label[i]: float(probs[i])
        for i in range(len(probs))
    }

    predicted_emotion = max(emotion_scores, key=emotion_scores.get)

    if predicted_emotion == "hap":
        color = "#FFD700"  # 金色
    elif predicted_emotion == "ang":
        color = "#FF4500"  # オレンジレッド
    elif predicted_emotion == "sad":
        color = "#4A90E2"  # ブルー
    else:
        color = "#333333"  # ダークグレー

    font_size = db_to_fontsize(db)

    return {
        "id": seg_id,
        "speaker": speaker,
        "start": start,
        "end": end,
        "text": text,
        "predicted_emotion": predicted_emotion,
        "emotion_scores": emotion_scores,
        "volume_rms": float(rms),
        "volume_db": float(db),
        "font_size": float(font_size),
        "color": color
    }