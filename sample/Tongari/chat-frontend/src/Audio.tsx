import React, { useState } from "react";

interface Emotion {
  joy: number;
  anger: number;
  sadness: number;
  surprise: number;
}

interface Segment {
  text: string;
  emotion: Emotion;
  style: {
    color: string;
    fontSize: string;
  };
}

interface AnalyzeResponse {
  message: Segment[];
}

const EmotionAudio: React.FC = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "http://localhost:3001/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data: AnalyzeResponse = await response.json();

      // 安全確認
      if (Array.isArray(data.message)) {
        setSegments(data.message);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      setError("解析に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>音声入力してね</h2>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
      />

      {loading && <p>解析中...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
        {segments.map((seg, index) => (
          <span
            key={index}
            style={{
              color: seg.style.color,
              fontSize: seg.style.fontSize,
              marginRight: "6px",
            }}
          >
            {seg.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmotionAudio;