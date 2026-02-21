import { useEffect, useState } from "react";
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
import { sendTextMessage } from "./chat/ChatSendTextMessage";



function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ===== 文字設定 =====
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState("16");

  const myUserId = "1";
  const recieverId = "2";

  //=======================
  //初回ロード時に履歴取得
  //=======================
  useEffect(() => {
    const loadMessages = async () => {
      const apiMessages = await fetchMessages();
      if(!apiMessages) return;

      const uiMessages = convertApiMessagesToUIMessages(
      apiMessages
    );
    
      setMessages(uiMessages);
    };

    loadMessages();
  },[]);

  // =============================
  // テキスト送信
  // =============================
  const sendMessage = async () => {
    if (input.trim() === "") return;

    const response = await sendTextMessage(
      myUserId,
      recieverId,
      input,
      color,
      Number(size)
    );

    if(!response)return;

    const uiMessages = convertApiMessagesToUIMessages([response]);

    setMessages((prev) => [...prev, ...uiMessages]);
    setInput("");
  };



  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRecordedAudio = async (
    audioUrl:string,
    time:string
  ) => {
    //audio送信のAPI処理
  }

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