import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from './database/database.service';
import FormData from 'form-data';

export type Message = {
  text?: string;
  audio?: string;
  time: string;
  color?: string;
  size?: string;
  sender: "me" | "other";
};

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async analyzeEmotion(
    file: Express.Multer.File,
    senderId: string,
    receiverId: string
  ) {
    // ===============================
    // ① ルーム取得
    // ===============================
    const roomQuery = `
      SELECT room_id 
      FROM chat_rooms 
      WHERE senderid = $1 AND receiverid = $2
    `;

    const roomResult = await this.db.query(roomQuery, [
      senderId,
      receiverId,
    ]);

    if (roomResult.rows.length === 0) {
      throw new Error('Chat room not found');
    }

    const roomId = roomResult.rows[0].room_id;
    const chatId = 1; // 仮

    // ===============================
    // ② Python APIへ送信
    // ===============================
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      process.env.PYTHON_API_URL + '/analyze',
      formData,
      { headers: formData.getHeaders() }
    );

    const segments = response.data;

    // ===============================
    // ③ バルクINSERT
    // ===============================
    const values: any[] = [];
    const placeholders: string[] = [];

    segments.forEach((seg, index) => {
      const base = index * 14;

      placeholders.push(
        `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},
          $${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10},
          $${base + 11},$${base + 12},$${base + 13},$${base + 14})`
      );

      values.push(
        roomId,
        chatId,
        seg.id,
        seg.start,
        seg.end,
        seg.text,
        seg.predicted_emotion,
        seg.emotion_scores.neu,
        seg.emotion_scores.hap,
        seg.emotion_scores.ang,
        seg.emotion_scores.sad,
        seg.volume_rms,
        seg.volume_db,
        seg.font_size
      );
    });

    const insertQuery = `
      INSERT INTO chat_history (
        room_id, chat_id, seg_id, start_time, end_time,
        chat_text, predicted_emotion,
        neu, hap, ang, sad,
        volume_rms, volume_db, font_size
      )
      VALUES ${placeholders.join(',')}
    `;

    await this.db.query(insertQuery, values);

    // ===============================
    // ④ フロント返却用加工
    // ===============================
    const emotionColorMap: Record<string, string> = {
      hap: "#FFD700",
      ang: "#FF4C4C",
      sad: "#4C6FFF",
      neu: "#888888"
    };

    const messages: Message[] = segments.map((seg) => ({
      text: seg.text,
      time: this.formatTime(seg.start),
      color: emotionColorMap[seg.predicted_emotion] || "#000000",
      size: Math.round(seg.font_size).toString(),
      sender: "me"
    }));

    return messages;
  }

  private formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }
}