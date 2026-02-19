import torch
import librosa
import numpy as np
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification

model_name = "superb/wav2vec2-base-superb-er"

feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)


def analyze_emotion(file_path):

    # 音声読み込み
    speech, sr = librosa.load(file_path, sr=16000)

    # ===== 音量計算 =====
    rms = np.sqrt(np.mean(speech**2))  # RMS
    db = 20 * np.log10(rms + 1e-6)     # dB変換（log対策）

    # ===== 特徴量抽出 =====
    inputs = feature_extractor(
        speech,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    )

    # ===== 推論 =====
    with torch.no_grad():
        logits = model(**inputs).logits

    # ===== 各ラベルの確率取得 =====
    probs = torch.softmax(logits, dim=-1).squeeze().tolist()

    emotion_scores = {
        model.config.id2label[i]: float(probs[i])
        for i in range(len(probs))
    }

    # 最大感情
    predicted_emotion = max(emotion_scores, key=emotion_scores.get)

    # 音量からフォントサイズを計算
    font_size = db_to_fontsize(db)

    result = {
        "predicted_emotion": predicted_emotion,
        "emotion_scores": emotion_scores,
        "volume_rms": float(rms),
        "volume_db": float(db),
        "font_size": float(font_size)
    }

    return result

def db_to_fontsize(db):
    MIN_DB = -60
    MAX_DB = -10
    MIN_FONT = 14
    MAX_FONT = 48

    normalized = (db - MIN_DB) / (MAX_DB - MIN_DB)
    normalized = max(0, min(1, normalized))

    font_size = MIN_FONT + normalized * (MAX_FONT - MIN_FONT)
    return round(font_size, 1)

print(analyze_emotion("../backend/uploads/test_tone.wav"))