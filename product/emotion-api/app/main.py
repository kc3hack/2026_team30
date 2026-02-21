from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, Response
import shutil
import os
import base64
from app.transcription import transcribe_audio
from app.transcription import transcribe_audio_docs
from app.transcription import transcribe
from app.sentimental import analyze_audio_by_json
from app.sentimental import analyze_audio_by_json_docs
from app.graph import create_emotion_graph_bytes

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
    try:
        # ファイル名と保存先を決める
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # バイナリを保存
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # ログにファイルサイズを表示
        print(f"Received file: {file.filename}, size: {len(contents)} bytes")

        # ① 文字起こし
        transcript_result = transcribe_audio_docs(file_path)

        print(transcript_result)

        # ② 感情分析
        emotion_result = analyze_audio_by_json_docs(file_path, transcript_result)

        transcript_result = transcribe(transcript_result)


        png_bytes = create_emotion_graph_bytes(emotion_result)
        png_base64 = base64.b64encode(png_bytes).decode("utf-8")

        return JSONResponse(content={
            "imageBase64": png_base64,
            "text": transcript_result
        })

    except Exception as exc:
        print("ERROR:", exc)
        return JSONResponse(content={"error": str(exc)}, status_code=500)
