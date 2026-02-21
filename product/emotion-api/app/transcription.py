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
    print("アップロード成功:", upload_url)

    # 文字起こしリクエスト
    data = {
        "audio_url": upload_url,
        "language_code": "ja",
        "speech_models": ["universal-2"],
        "punctuate": True,          # 句読点
        "format_text": True         # 自動整形
    }

    transcript_response = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        json=data,
        headers=headers
    )

    response_json = transcript_response.json()
    print("文字起こし開始レスポンス:", response_json)

    transcript_id = response_json["id"]

    # ポーリング
    while True:
        polling = requests.get(
            f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
            headers=headers
        )

        result = polling.json()

        if result["status"] == "completed":

            segments = []
            current = []
            prev_end = None
            words = result["words"]

            emotion_logs = []

            for w in words:
                if prev_end and (w["start"] - prev_end) > 700:
                    segments.append(current)
                    current = []

                current.append(w)
                prev_end = w["end"]

            if current:
                segments.append(current)

            response_data = []

            for seg in segments:
                start = seg[0]["start"] / 1000
                end = seg[-1]["end"] / 1000
                text = "".join([w["text"] for w in seg])

                print(f"[{start:.2f}s - {end:.2f}s]")
                print(text)
                print()
                response_data.append({
                    "id": len(response_data) + 1,
                    "start": start,
                    "end": end,
                    "text": text
                })
            return response_data

        elif result["status"] == "error":
            raise Exception(result)
        
        print("処理中... 3秒後に再度確認します。")

        time.sleep(3)

def transcribe_audio_docs(file_path):

    # アップロード
    with open(file_path, "rb") as f:
        upload_response = requests.post(
            "https://api.assemblyai.com/v2/upload",
            headers=headers,
            data=f
        )

    upload_url = upload_response.json()["upload_url"]
    print("アップロード成功:", upload_url)

    # 文字起こしリクエスト
    data = {
        "audio_url": upload_url,
        "language_code": "ja",
        "speech_models": ["universal-2"],
        "punctuate": True,          # 句読点
        "format_text": True,         # 自動整形
        "speaker_labels": True 
    }

    transcript_response = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        json=data,
        headers=headers
    )

    response_json = transcript_response.json()
    print("文字起こし開始レスポンス:", response_json)

    transcript_id = response_json["id"]

    # ポーリング
    while True:
        polling = requests.get(
            f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
            headers=headers
        )

        result = polling.json()

        if result["status"] == "completed":

            segments = []
            current = []
            prev_end = None
            words = result["words"]

            emotion_logs = []

            for w in words:
                if prev_end and (w["start"] - prev_end) > 700:
                    segments.append(current)
                    current = []

                current.append(w)
                prev_end = w["end"]

            if current:
                segments.append(current)

            response_data = []

            for seg in segments:
                start = seg[0]["start"] / 1000
                end = seg[-1]["end"] / 1000
                text = "".join([w["text"] for w in seg])

                print(f"[{start:.2f}s - {end:.2f}s]")
                print(text)
                print()
                response_data.append({
                    "id": len(response_data) + 1,
                    "speaker": seg[0]["speaker"] if "speaker" in seg[0] else "unknown",
                    "start": start,
                    "end": end,
                    "text": text
                })
            return response_data

        elif result["status"] == "error":
            raise Exception(result)
        
        print("処理中... 3秒後に再度確認します。")

        time.sleep(3)