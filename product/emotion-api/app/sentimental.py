import torch
import librosa
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification

model_name = "superb/wav2vec2-base-superb-er"

feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)


def analyze_emotion(file_path):

    speech, sr = librosa.load(file_path, sr=16000)

    inputs = feature_extractor(
        speech,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        logits = model(**inputs).logits

    predicted_id = torch.argmax(logits, dim=-1).item()
    label = model.config.id2label[predicted_id]

    return label
