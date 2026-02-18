from fastapi import FastAPI, UploadFile, File
import shutil
import os
from app.transcription import transcribe_audio
from app.sentimental import analyze_emotion

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # ファイル保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ① 文字起こし
    transcript_result = transcribe_audio(file_path)

    # ② 感情分析
    emotion_result = analyze_emotion(file_path)

    return {
        "transcription": transcript_result,
        "emotion": emotion_result
    }
