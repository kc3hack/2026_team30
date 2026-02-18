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


response_json = transcript_response.json()
print("文字起こし開始レスポンス:", response_json)

if "id" not in response_json:
    print("エラー:", response_json)
    exit()

transcript_id = response_json["id"]

while True:
    polling = requests.get(
        f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
        headers=headers
    )

    result = polling.json()
    status = result["status"]

    print("ステータス:", status)

    if status == "completed":
        break
    elif status == "error":
        print("エラー:", result)
        exit()

    time.sleep(3)

print("\n========== 文字起こし結果 ==========\n")

# =========================
# ④ 話者単位出力
# =========================
utterances = result["utterances"]

for u in utterances:
    start = u["start"] / 1000
    end = u["end"] / 1000
    speaker = u["speaker"]
    text = u["text"]

    print(f"[{start:.2f}s - {end:.2f}s] Speaker {speaker}")
    print(text)
    print()

# =========================
# ⑤ 単語単位出力
# =========================
print("\n========== 単語単位 ==========\n")

words = result["words"]

for w in words:
    start = w["start"] / 1000
    end = w["end"] / 1000
    print(f"[{start:.2f}s - {end:.2f}s] {w['text']}")

# =========================
# ⑥ 無音でセグメント分割（0.7秒以上）
# =========================
print("\n========== 無音分割セグメント ==========\n")

segments = []
current = []
prev_end = None

for w in words:
    if prev_end and (w["start"] - prev_end) > 700:
        segments.append(current)
        current = []

    current.append(w)
    prev_end = w["end"]

if current:
    segments.append(current)

for seg in segments:
    start = seg[0]["start"] / 1000
    end = seg[-1]["end"] / 1000
    text = "".join([w["text"] for w in seg])

    print(f"[{start:.2f}s - {end:.2f}s]")
    print(text)
    print()

print("完了 🚀")