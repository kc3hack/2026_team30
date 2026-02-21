from fastapi import FastAPI, UploadFile, File
import shutil
import os
from app.transcription import transcribe_audio
from app.transcription import transcribe_audio_docs
from app.sentimental import analyze_audio_by_json
from app.sentimental import analyze_audio_by_json_docs

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
    emotion_result = analyze_audio_by_json(file_path, transcript_result)

    return emotion_result

@app.post("/docsAnalyze/")
async def docs_analyze(file: UploadFile = File(...)):

    file_path = f"{UPLOAD_DIR}/{file.filename}"

    # ファイル保存
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ① 文字起こし
    transcript_result = transcribe_audio_docs(file_path)

    emotion_result = analyze_audio_by_json_docs(file_path, transcript_result)

    return emotion_result
