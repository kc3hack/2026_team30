import requests
import time
import os

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

headers = {
    "authorization": ASSEMBLYAI_API_KEY
}


def transcribe_audio(file_path):

    # アップロード
    with open(file_path, "rb") as f:
        upload_response = requests.post(
            "https://api.assemblyai.com/v2/upload",
            headers=headers,
            data=f
        )

    upload_url = upload_response.json()["upload_url"]

    # 文字起こしリクエスト
    data = {
        "audio_url": upload_url,
        "language_code": "ja",
        "speaker_labels": True,
        "punctuate": True,
        "format_text": True
    }

    transcript_response = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        json=data,
        headers=headers
    )

    transcript_id = transcript_response.json()["id"]

    # ポーリング
    while True:
        polling = requests.get(
            f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
            headers=headers
        )

        result = polling.json()

        if result["status"] == "completed":
            return result["utterances"]

        elif result["status"] == "error":
            raise Exception(result)

        time.sleep(3)
