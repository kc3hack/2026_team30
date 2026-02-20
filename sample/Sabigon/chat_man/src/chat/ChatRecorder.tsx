import { useRef, useState } from "react";

type ChatRecorderProps = {
  onRecorded: (audioUrl: string, time: string) => void;
};

// 音声録音
function ChatRecorder({ onRecorded }: ChatRecorderProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const getTime = () => {
    const now = new Date();
    return (
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0")
    );
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunks.current = [];

    mediaRecorder.start();
    setRecording(true);

    mediaRecorder.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const time = getTime();

      onRecorded(url, time);
      setRecording(false);
    };
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
