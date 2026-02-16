from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 遅延ロード
emotion_model = None

def get_model():
    global emotion_model
    if emotion_model is None:
        from speechbrain.pretrained import EncoderClassifier
        emotion_model = EncoderClassifier.from_hparams(
            source="speechbrain/emotion-recognition-wav2vec2-IEMOCAP",
            savedir="tmp_emotion_model"
        )
    return emotion_model

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/classify/")
async def classify(file: UploadFile):
    if not file.filename:
        raise HTTPException(status_code=400, detail="no file")

    # 一時保存してモデルに渡す
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        model = get_model()
        out_prob, score, index, text_lab = model.classify_file(tmp_path)
        label = text_lab[0]
        confidence = float(score[0])
        return {"label": label, "confidence": confidence}

    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
