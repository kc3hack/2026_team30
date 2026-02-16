import { useState } from "react";
import "./App.css";

type Message = {
  text: string;
  time: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // 送信処理
  const sendMessage = () => {
    if (input.trim() === "") return;

    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    const newMessage: Message = {
      text: input,
      time: time,
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  // Enter送信
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <h1>チャットアプリ</h1>

      {/* チャット表示 */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message my">
            <div className="text">{msg.text}</div>
            <div className="time">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="input-area">
        <input
          type="text"
          placeholder="メッセージ入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}

export default App;