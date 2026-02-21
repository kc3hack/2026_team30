import matplotlib.pyplot as plt
from collections import defaultdict
from io import BytesIO

def create_emotion_graph_bytes(json_data):
    """
    json_data: 感情分析結果のJSON（list形式）
    return: PNG画像のバイトデータ
    """

    if not json_data:
        raise ValueError("JSONデータが空です")

    # speakerごとに分類
    grouped = defaultdict(list)
    for item in json_data:
        grouped[item["speaker"]].append(item)

    speakers = list(grouped.keys())
    num_speakers = len(speakers)

    fig, axes = plt.subplots(num_speakers, 1, figsize=(8, 4 * num_speakers))

    if num_speakers == 1:
        axes = [axes]

    for ax, speaker in zip(axes, speakers):
        items = grouped[speaker]

        times = [(i["start"] + i["end"]) / 2 for i in items]

        neu = [i["emotion_scores"]["neu"] for i in items]
        hap = [i["emotion_scores"]["hap"] for i in items]
        ang = [i["emotion_scores"]["ang"] for i in items]
        sad = [i["emotion_scores"]["sad"] for i in items]

        ax.plot(times, neu, marker='o', label='Neutral')
        ax.plot(times, hap, marker='o', label='Happy')
        ax.plot(times, ang, marker='o', label='Angry')
        ax.plot(times, sad, marker='o', label='Sad')

        ax.set_title(f"Speaker {speaker}")
        ax.set_xlabel("Time (seconds)")
        ax.set_ylabel("Emotion Score")
        ax.legend()

    plt.tight_layout()

    # メモリ上に保存
    buffer = BytesIO()
    fig.savefig(buffer, format="png")
    plt.close(fig)

    buffer.seek(0)
    return buffer.getvalue()