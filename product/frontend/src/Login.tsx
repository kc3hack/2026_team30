import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name || !room) {
      alert("名前とルーム名を入力して");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          room: room,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 認証成功なら保存
        localStorage.setItem("userName", name);
        localStorage.setItem("roomName", room);

        navigate("/Home");
      } else {
        alert(data.message || "ログイン失敗");
      }
    } catch (error) {
      console.error("サーバー接続失敗:", error);
      alert("サーバーに接続できません");
    } finally {
      setLoading(false);
    }
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
          type="password"
          placeholder="パスワード"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "ログイン中..." : "ログインする"}
        </button>
      </div>
    </div>
  );
}

export default Login;