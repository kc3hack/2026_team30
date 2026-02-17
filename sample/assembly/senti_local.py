import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()  # .env を読み込む

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

headers = {
    "authorization": ASSEMBLYAI_API_KEY
}

# 🎤 ローカル音声ファイル
file_path = "test_tone.wav"  # ← ここを自分の音声に変更

# ===============================
# ① 音声をアップロード
# ===============================
with open(file_path, "rb") as f:
    upload_response = requests.post(
        "https://api.assemblyai.com/v2/upload",
        headers=headers,
        data=f
    )

upload_url = upload_response.json()["upload_url"]
print("アップロード成功:", upload_url)

# ===============================
# ② 文字起こし + 感情分析
# ===============================
data = {
    "audio_url": upload_url,
    "language_code": "ja",
    "speaker_labels": True,
    "speech_models": ["universal-2"],
    "punctuate": True,          # 句読点
    "format_text": True         # 自動整形
}

transcript_response = requests.post(
    "https://api.assemblyai.com/v2/transcript",
    json=data,
    headers=headers
)
print("ステータス:", transcript_response.status_code)
print("レスポンス:", transcript_response.json())

transcript_id = transcript_response.json()["id"]
polling_url = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"

# ===============================
# ③ ポーリング
# ===============================
while True:
    polling_response = requests.get(polling_url, headers=headers)
    result = polling_response.json()

    if result["status"] == "completed":

        print("\n🗣 話者ごとの発話:")

        for utterance in result["utterances"]:
            print(
                f"Speaker {utterance['speaker']} : {utterance['text']}"
            )

        break

    elif result["status"] == "error":
        raise Exception(result["error"])

    time.sleep(3)

# 🔥 utterancesを取得
utterances = result["utterances"]

for u in utterances:
    start = u["start"] / 1000
    end = u["end"] / 1000
    speaker = u["speaker"]
    text = u["text"]

    print(f"[{start:.2f}s - {end:.2f}s] Speaker {speaker}:")
    print(text)
    print()
