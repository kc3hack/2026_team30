import { useNavigate } from "react-router-dom";
import "./Home.css";

type Friend = {
  id: number;
  name: string;
  avatar: string;
};

// ホーム画面: 友達一覧を表示
function Friend() {
  const navigate = useNavigate();

  // 仮の友達データ（あとでAPI化できる予定）
  const friends: Friend[] = [
    {
      id: 1,
      name: "たなか",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "さとう",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "すずき",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  return (
    <div className="friend-page">

      {/* 左サイドバー */}
      <div className="sidebar">
        <h2>EmotionChat</h2>

        <button className="active">👥 友達</button>
        <button onClick={()=>navigate("/minutes")}>📒 議事録</button>
      </div>

      {/* メイン */}
      <div className="friend-main">
        <h1>友達一覧</h1>

        <div className="friend-list">
          {friends.map((f) => (
            <div key={f.id} className="friend-card">
              <img src={f.avatar} />
              <div className="info">
                <div className="name">{f.name}</div>
              </div>

              <button
                className="chat-btn"
                onClick={() => navigate("/chat")}
              >
                チャット
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Friend;
