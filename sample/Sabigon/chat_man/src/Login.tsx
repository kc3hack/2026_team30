import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// ログイン画面: ユーザーIDとルーム名を入力してlocalStorageに保存
function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  // ログインボタンクリック時の処理
  const handleLogin = () => {
    if (!name || !room) {
      alert("名前とルーム名を入力して");
      return;
    }

    // 後でサーバーに送る用
    localStorage.setItem("userName", name);
    localStorage.setItem("roomName", room);

    navigate("/Home"); // Homeへ
  };

  return (
    <div className="login">
      <div className="login-card">
        <h1>Emotion Chat</h1>
        <p className="sub">ログインして開始</p>

        <input
          type="text"
          placeholder="ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="パスワード"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={handleLogin}>ログインする</button>
      </div>
    </div>
  );
}

export default Login;