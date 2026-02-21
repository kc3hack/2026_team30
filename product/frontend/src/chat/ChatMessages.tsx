import type { Message } from "./types";

type Props = {
  messages: Message[];
};

function ChatMessages({ messages }: Props) {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.sender === "me" ? "message my" : "message other"}
        >
          {msg.text && (
            <div
              style={{
                fontSize: (msg.size || "16") + "px",
              }}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          )}

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