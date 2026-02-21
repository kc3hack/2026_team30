import { useRef, useState } from "react";

type ChatRecorderProps = {
  onRecorded: (audioUrl: string, time: string, result: any) => void;
};

function ChatRecorder({ onRecorded }: ChatRecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const getTime = () => {
    const now = new Date();
    return (
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0")
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];

      mediaRecorder.start();
      setRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks.current, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          const time = getTime();

          // ===== バックエンド送信 =====
          const formData = new FormData();
          formData.append("file", blob, "recording.webm");

          const response = await fetch(
            "http://localhost:3001/users/analyze",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const result = await response.json();
          console.log("Emotion result:", result);

          // ✅ ここで1回だけ呼ぶ
          onRecorded(url, time, result);

        } catch (err) {
          console.error("Upload error:", err);
        } finally {
          setRecording(false);

          // 🎤 マイク解放
          streamRef.current?.getTracks().forEach((track) => track.stop());
        }
      };
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return !recording ? (
    <button onClick={startRecording}>🎤</button>
  ) : (
    <button onClick={stopRecording}>■</button>
  );
}

export default ChatRecorder;