import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

// 議事録・文字起こし画面
function Minutes() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  return (
    <div className="chat-container">
      <h1>議事録・文字起こし</h1>

      <textarea
        style={{
          width: "90%",
          height: "60vh",
          margin: "20px",
          fontSize: "16px",
        }}
        placeholder="会議内容を文字起こし..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={() => navigate("/Home")}>←ホーム戻る</button>
    </div>
  );
}

export default Minutes;
