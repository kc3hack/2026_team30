CREATE TABLE IF NOT EXISTS users (
  userid TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (userid, password, avatar)
VALUES
  ('user1', 'user1pass', 'https://i.pravatar.cc/150?img=1'),
  ('user2', 'user2pass', 'https://i.pravatar.cc/150?img=2'),
  ('user3', 'user3pass', 'https://i.pravatar.cc/150?img=3')
ON CONFLICT (userid) DO NOTHING;

-- =====================
-- chat_rooms テーブル
-- =====================
CREATE TABLE IF NOT EXISTS chat_rooms (
    room_id SERIAL PRIMARY KEY,
    senderid TEXT NOT NULL,
    receiverid TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_sender_receiver UNIQUE(senderid, receiverid)
);

-- 初期データ投入
INSERT INTO chat_rooms (senderid, receiverid)
VALUES
    ('user1', 'user2'),
    ('user1', 'user3'),
    ('user2', 'user3'),
    ('user2', 'user1'),
    ('user3', 'user1'),
    ('user3', 'user2')
ON CONFLICT (senderid, receiverid) DO NOTHING;

CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL,
  chat_id INTEGER,
  seg_id INTEGER,
  start_time TEXT,
  end_time TEXT,
  chat_text TEXT NOT NULL,
  predicted_emotion TEXT,
  neu FLOAT,
  hap FLOAT,
  ang FLOAT,
  sad FLOAT,
  volume_rms FLOAT,
  volume_db FLOAT,
  font_size FLOAT NOT NULL,
  font_color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);