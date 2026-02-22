import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function Minutes() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>("");

  // 🔥 WAVアップロード処理
  const handleUpload = async () => {
    if (!file) {
      alert("WAVファイルを選択してください");
      return;
    }

    const formData = new FormData();
formData.append("file", file);

const response = await fetch("http://localhost:3001/docs/graph", {
  method: "POST",
  body: formData,
});

if (!response.ok) {
  alert("アップロード失敗");
  return;
}

const data = await response.json();

// 🔹 Data URI に変換して表示
const imageUrl = `data:image/png;base64,${data.imageBase64}`;
setImage(imageUrl);
setText(data.text); // 文字起こし
  };

  return (
    <div className="chat-container">
      <h1>議事録・文字起こし</h1>

      {/* 🔥 WAVファイル選択 */}
      <input
        type="file"
        accept=".wav"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button onClick={handleUpload}>解析する</button>

      {/* 🔥 画像表示（レスポンシブ対応） */}
      {image && (
          <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            margin: "20px auto",
          }}
        >
          <img
            src={image}
            alt="Emotion Graph"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

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