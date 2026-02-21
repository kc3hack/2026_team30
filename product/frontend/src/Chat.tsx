import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { KeyboardEvent } from "react";
import "./Chat.css";
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
  const location = useLocation();

  const receiverId = location.state?.receiverId;
  const myUserId = localStorage.getItem("userId");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState("16");

  useEffect(() => {
    const loadMessages = async () => {
      if (!receiverId) return;

      const apiMessages = await fetchMessages(receiverId);
      if (!apiMessages) return;

      const uiMessages =
        convertApiMessagesToUIMessages(apiMessages);

      setMessages(uiMessages);
    };

    loadMessages();
  }, [receiverId]);

  //======================
  //履歴再取得
  //======================
  const reloadMessages = async () => {
    if(!receiverId) return;

    const apiMessages = await fetchMessages(receiverId);
    if(!apiMessages) return;

    const uiMessages =
      convertApiMessagesToUIMessages(apiMessages);

    setMessages(uiMessages);
  }

  const sendMessage = async () => {
    if (!input.trim() || !receiverId || !myUserId) return;

    const response = await sendTextMessage(
      myUserId,
      receiverId,
      input,
      color,
      Number(size)
    );

    if (!response) return;

    const uiMessages =
      convertApiMessagesToUIMessages([response]);

    setMessages((prev) => [...prev, ...uiMessages]);
    setInput("");

    //履歴再取得で自分の送ったメッセージを反映
    await reloadMessages();
  };

  const handleAudioRecorded = async (
    audioUrl:string,
    time:string,
    result:any
  ) => {
    console.log("Audio sent",result);

    //履歴再取得
    await reloadMessages();
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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

        <ChatRecorder onRecorded={handleAudioRecorded}/>
      </div>

      <button onClick={() => navigate("/Home")}>←戻る</button>
    </div>
  );
}

export default Chat;