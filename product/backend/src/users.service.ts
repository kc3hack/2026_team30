import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from './database/database.service';
import FormData from 'form-data';
type Friend = {
  id: string;
  name: string;
  avatar: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async analyzeEmotion(file: Express.Multer.File,senderId: string,receiverId: string) {
    const room_values: any[] = [];
    const room_placeholders: string[] = [];

    room_placeholders.push(`($1,$2)`);
    room_values.push(senderId,receiverId)

    const room_query = `SELECT room_id FROM chat_rooms WHERE senderid = $1 AND receiverid = $2`;
    const roomId = await this.db.query(room_query, room_values);

    // ① emotion-apiに送信
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      process.env.PYTHON_API_URL + '/analyze',
      formData,
      { headers: formData.getHeaders() }
    );

    const segments = response.data;
    const chatId = 1; // 仮（後で改善可）

    // ② 🔥 ここにバルクINSERTを書く
    const values: any[] = [];
    const placeholders: string[] = [];

    segments.forEach((seg, index) => {
      const base = index * 15; // 1レコードあたり15カラム分のプレースホルダーを用意

      placeholders.push(
        `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},
          $${base+6},$${base+7},$${base+8},$${base+9},$${base+10},
          $${base+11},$${base+12},$${base+13},$${base+14},$${base+15})`
      );

      values.push(
        roomId.rows[0].room_id,
        chatId,
        seg.id,
        String(seg.start),
        String(seg.end),
        seg.text,
        seg.predicted_emotion,
        seg.emotion_scores.neu,
        seg.emotion_scores.hap,
        seg.emotion_scores.ang,
        seg.emotion_scores.sad,
        seg.volume_rms,
        seg.volume_db,
        seg.font_size,
        seg.color
      );
    });

    const query = `
      INSERT INTO chat_history (
        room_id, chat_id, seg_id, start_time, end_time,
        chat_text, predicted_emotion,
        neu, hap, ang, sad,
        volume_rms, volume_db, font_size, font_color
      )
      VALUES ${placeholders.join(',')}
    `;

    await this.db.query(query, values);

    return segments;
  }

  async getFriends(userid: string) {
    const room_values: any[] = [];
    const room_placeholders: string[] = [];

    room_placeholders.push(`$1`);
    room_values.push(userid)

    const friends_query = `SELECT userid, avatar FROM users WHERE userid <> $1`;
    const friends = await this.db.query(friends_query, room_values);

    return friends.rows as Friend[];
  }
}