import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

function Friend() {
  const navigate = useNavigate();
  const userid = "user1"; // ← 仮のログインユーザー

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const getFriends = async (): Promise<Friend[]> => {
    const response = await fetch("http://localhost:3001/users/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userid }),
    });

    if (!response.ok) {
      throw new Error("友達取得失敗");
    }

    const data: Friend[] = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friend-page">
      <div className="sidebar">
        <h2>EmotionChat</h2>
        <button className="active">👥 友達</button>
        <button onClick={() => navigate("/minutes")}>
          📒 議事録
        </button>
      </div>

      <div className="friend-main">
        <h1>友達一覧</h1>

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <div className="friend-list">
            {friends.map((f) => (
              <div key={f.id} className="friend-card">
                <img src={f.avatar} alt={f.name} />
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
        )}
      </div>
    </div>
  );
}

export default Friend;