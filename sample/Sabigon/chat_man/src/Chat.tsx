import { useState, useRef } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

// ===== メッセージ型 =====
type Message = {
  text?: string;
  audio?: string;
  time: string;
  color?: string;
  size?: string;
  sender: "me" | "other";
};

function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ===== 文字設定 =====
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState("16");

  // ===== 録音 =====
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // =============================
  // ① テキスト送信
  // =============================
  const sendMessage = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    // ===== 自分のメッセージ =====
    const newMessage: Message = {
      text: input,
      time: time,
      color: color,
      size: size,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);

    const sentText = input;   // ←内容保存
    const sentColor = color;  // ←色保存
    const sentSize = size;    // ←サイズ保存
    setInput("");

    // =============================
    // ② 相手の自動返信（デモ）
    // 自分と同じ色・サイズで返す
    // =============================
    setTimeout(() => {
      const reply: Message = {
        text: sentText + "（自動返信）", // 同じ内容
        time: time,
        color: sentColor, // ←色コピー
        size: sentSize,   // ←サイズコピー
        sender: "other",
      };

      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  // Enter送信
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // =============================
  // ③ 録音開始
  // =============================
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

    // =============================
    // ④ 録音停止→メッセージ化
    // =============================
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      const now = new Date();
      const time =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      const newMessage: Message = {
        audio: url,
        time: time,
        sender: "me",
      };

      setMessages((prev) => [...prev, newMessage]);
      setRecording(false);
    };
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="chat-container">
      <h1>チャット</h1>

      {/* =============================
          チャット表示
      ============================= */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "me" ? "message my" : "message other"}
          >
            {/* ===== テキスト表示 ===== */}
            {msg.text && (
              <div
                className="text"
                style={{
                  color: msg.color || "black",
                  fontSize: (msg.size || "16") + "px",
                }}
              >
                {msg.text}
              </div>
            )}

            {/* ===== 音声 ===== */}
            {msg.audio && (
              <audio controls src={msg.audio} style={{ width: "200px" }} />
            )}

            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* =============================
          入力エリア
      ============================= */}
      <div className="input-area">
        {/* サイズ */}
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="12">小</option>
          <option value="16">中</option>
          <option value="24">大</option>
          <option value="32">特大</option>
        </select>

        {/* 色 */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        {/* テキスト */}
        <input
          type="text"
          placeholder="メッセージ入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage}>送信</button>

        {/* 録音 */}
        {!recording ? (
          <button onClick={startRecording}>🎤</button>
        ) : (
          <button onClick={stopRecording}>■</button>
        )}
      </div>

      <button onClick={() => navigate("/Home")}>←戻る</button>
    </div>
  );
}

export default Chat;
