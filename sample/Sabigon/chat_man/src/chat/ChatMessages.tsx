import type { Message } from "./types";

type ChatMessagesProps = {
  messages: Message[];
};

// チャット表示エリア
function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.sender === "me" ? "message my" : "message other"}
        >
          {/* テキスト */}
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

          {/* 音声 */}
          {msg.audio && (
            <audio controls src={msg.audio} style={{ width: "200px" }} />
          )}

          <div className="time">{msg.time}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;
