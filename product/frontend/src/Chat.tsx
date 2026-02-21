import { useState } from "react";
import type { KeyboardEvent } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatMessages from "./chat/ChatMessages";
import ChatStyleControls from "./chat/ChatStyleControls";
import ChatTextInput from "./chat/ChatTextInput";
import ChatRecorder from "./chat/ChatRecorder";
import type { Message } from "./chat/types";

function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ===== 文字設定 =====
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState("16");

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
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // 録音完了時のメッセージ追加
  const handleRecordedAudio = (audioUrl: string, time: string) => {
    const newMessage: Message = {
      audio: audioUrl,
      time: time,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="chat-container">
      <h1>チャット</h1>

      {/* =============================
          チャット表示
      ============================= */}
      <ChatMessages messages={messages} />

      {/* =============================
          入力エリア
      ============================= */}
      <div className="input-area">
        <ChatStyleControls
          color={color}
          size={size}
          onColorChange={setColor}
          onSizeChange={setSize}
        />

        <ChatTextInput
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
        />

        <ChatRecorder onRecorded={handleRecordedAudio} />
      </div>

      <button onClick={() => navigate("/Home")}>←戻る</button>
    </div>
  );
}

export default Chat;