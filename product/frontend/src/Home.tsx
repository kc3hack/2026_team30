import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

type Friend = {
  userid: string;
  avatar: string;
};

function Friend() {
  const navigate = useNavigate();
  const userid = localStorage.getItem("userId");

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const getFriends = async (): Promise<Friend[]> => {
    if (!userid) throw new Error("ログインしてください");

    const response = await fetch("http://localhost:3001/users/friends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userid }),
    });

    if (!response.ok) throw new Error("友達取得失敗");

    return await response.json();
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
        <button onClick={()=>navigate("/minutes")}>📒 議事録</button>
      </div>
      <div className="friend-main">
        <h1>友達一覧</h1>

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <div className="friend-list">
            {friends.map((f) => (
              <div key={f.userid} className="friend-card">
                <img src={f.avatar} alt={f.userid} />
                <div className="name">{f.userid}</div>

                <button
                  className="chat-btn"
                  onClick={() =>
                    navigate("/Chat", {
                      state: { receiverId: f.userid },
                    })
                  }
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