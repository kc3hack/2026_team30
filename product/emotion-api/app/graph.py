import json
import matplotlib.pyplot as plt

# JSONデータ
data = [
  {
    "start": 0.108,
    "end": 25.796,
    "emotion_scores": {
      "neu": 0.21178871393203735,
      "hap": 0.5746666789054871,
      "ang": 0.2112058848142624,
      "sad": 0.002338726306334138
    }
  },
  {
    "start": 27.605,
    "end": 48.056,
    "emotion_scores": {
      "neu": 0.040954358875751495,
      "hap": 0.6067790985107422,
      "ang": 0.3511217534542084,
      "sad": 0.0011448326986283064
    }
  }
]

# 中央時間を計算
times = [(item["start"] + item["end"]) / 2 for item in data]

neu = [item["emotion_scores"]["neu"] for item in data]
hap = [item["emotion_scores"]["hap"] for item in data]
ang = [item["emotion_scores"]["ang"] for item in data]
sad = [item["emotion_scores"]["sad"] for item in data]

plt.figure()
plt.plot(times, neu, marker='o', label='Neutral')
plt.plot(times, hap, marker='o', label='Happy')
plt.plot(times, ang, marker='o', label='Angry')
plt.plot(times, sad, marker='o', label='Sad')

plt.xlabel("Time (seconds)")
plt.ylabel("Emotion Score")
plt.title("Emotion Score Over Time")
plt.legend()
plt.show()

data = [
  {"id": 1, "volume_db": -24.121788024902344},
  {"id": 2, "volume_db": -22.77745819091797}
]

ids = [item["id"] for item in data]
volume_db = [item["volume_db"] for item in data]

plt.figure()
plt.plot(ids, volume_db, marker='o')
plt.xlabel("Segment ID")
plt.ylabel("Volume (dB)")
plt.title("Volume Change per Segment")
plt.show()