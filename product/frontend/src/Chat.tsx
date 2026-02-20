import { useState, useRef } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

type Message = {
  text?: string;
  audio?: string;
  time: string;
  color?: string;
  size?: string;
};

function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // 文字設定
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("16");

  // 録音関連
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // ===============================
  // テキスト送信
  // ===============================
  const sendMessage = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    const newMessage: Message = {
      text: input,
      time,
      color,
      size,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // ===============================
  // 録音開始
  // ===============================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        const blob = new Blob(chunks.current, { type: "audio/webm" });

        const now = new Date();
        const time =
          now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0");

        // ===== ローカル再生用 =====
        const url = URL.createObjectURL(blob);

        setMessages((prev) => [
          ...prev,
          { audio: url, time }
        ]);

        // ===== バックエンドへ送信 =====
        const formData = new FormData();
        formData.append("file", blob, "recording.webm");

        try {
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

          // 🔥 必要ならここで感情結果を画面に追加できる
          // setMessages(prev => [...prev, { text: JSON.stringify(result), time }])

        } catch (err) {
          console.error("Upload error:", err);
        }

        setRecording(false);
      };
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  // ===============================
  // 録音停止
  // ===============================
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="chat-container">
      <h1>チャットアプリ</h1>

      {/* ===== チャット表示 ===== */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message my">

            {/* テキスト */}
            {msg.text && (
              <div
                className="text"
                style={{
                  color: msg.color,
                  fontSize: msg.size + "px",
                }}
              >
                {msg.text}
              </div>
            )}

            {/* 音声 */}
            {msg.audio && (
              <audio controls src={msg.audio} style={{ width: "200px" }} />
            )}

            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* ===== 入力エリア ===== */}
      <div className="input-area">

        {/* 文字サイズ */}
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="12">小</option>
          <option value="16">中</option>
          <option value="24">大</option>
          <option value="32">特大</option>
        </select>

        {/* 色選択 */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* テキスト入力 */}
        <input
          type="text"
          placeholder="メッセージ入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage}>送信</button>

        {!recording ? (
          <button onClick={startRecording}>🎤</button>
        ) : (
          <button onClick={stopRecording}>■</button>
        )}
      </div>

      <button onClick={() => navigate("/")}>←戻る</button>
    </div>
  );
}

export default Chat;