CREATE TABLE IF NOT EXISTS users (
  userid TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  room_id SERIAL PRIMARY KEY,
  senderid TEXT NOT NULL,
  receiverid TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  room_id INTEGER NOT NULL,
  chat_id INTEGER NOT NULL,
  seg_id INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  chat_text TEXT NOT NULL,
  predicted_emotion TEXT NOT NULL,
  neu FLOAT NOT NULL,
  hap FLOAT NOT NULL,
  ang FLOAT NOT NULL,
  sad FLOAT NOT NULL,
  volume_rms FLOAT NOT NULL,
  volume_db FLOAT NOT NULL,
  font_size FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);