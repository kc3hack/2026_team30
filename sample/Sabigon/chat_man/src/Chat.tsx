import { useState } from "react";
import type { KeyboardEvent } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatMessages from "./chat/ChatMessages";
import ChatStyleControls from "./chat/ChatStyleControls";
import ChatTextInput from "./chat/ChatTextInput";
import ChatRecorder from "./chat/ChatRecorder";
import type { Message } from "./chat/types";
import { fetchMessages } from "./chat/ChatMessageResponse";
import { convertApiMessagesToUIMessages } from "./chat/ChatTimeTransfer";

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
  const sendMessage = async () => {
    if (input.trim() === "") return;

    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    const newMessage: Message = {
      text: input,
      time: time,
      color: color,
      size: size,
      sender: "me",
    };

    setMessages((prev) => [...prev, newMessage]);

    const sentText = input;
    const sentColor = color;
    const sentSize = size;
    setInput("");

    // デモ自動返信
    setTimeout(() => {
      const reply: Message = {
        text: sentText + "（自動返信）",
        time: time,
        color: sentColor,
        size: sentSize,
        sender: "other",
      };

      setMessages((prev) => [...prev, reply]);
    }, 800);

    // API から取得したメッセージを変換
    const apiMessages = await fetchMessages(); // API 呼び出し
    if (apiMessages) {
      const uiMessages = convertApiMessagesToUIMessages(apiMessages);
      setMessages(uiMessages);
    }
  };

  // Enter送信
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  // =============================
  // 🔥 録音完了 → 配列result対応
  // =============================
  const handleRecordedAudio = (
    audioUrl: string,
    time: string,
    result: any[]
  ) => {
    console.log("受け取ったresult:", result);

    // 配列をMessage型に変換
    const newMessages: Message[] = result.map((item) => ({
      text: item.text,
      time: time,
      color: item.color,
      size: item.size,
      sender: "me",
    }));

    setMessages((prev) => [...prev, ...newMessages]);
  };

  return (
    <div className="chat-container">
      <h1>チャット</h1>

      <ChatMessages messages={messages} />

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

        {/* 🔥 ここは変更なし */}
        <ChatRecorder onRecorded={handleRecordedAudio} />
      </div>

      <button onClick={() => navigate("/Home")}>←戻る</button>
    </div>
  );
}

export default Chat;