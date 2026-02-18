import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>My Chat System</h1>

      <div className="menu">
        <button onClick={() => navigate("/chat")}>
          💬 チャット
        </button>

        <button onClick={() => navigate("/minutes")}>
          📝 議事録作成
        </button>
      </div>
    </div>
  );
}

export default Home;
