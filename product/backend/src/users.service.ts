import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from './database/database.service';
import FormData from 'form-data';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async analyzeEmotion(file: Express.Multer.File) {

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
      const base = index * 13;

      placeholders.push(
        `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},
          $${base+6},$${base+7},$${base+8},$${base+9},$${base+10},
          $${base+11},$${base+12},$${base+13})`
      );

      values.push(
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
        seg.font_size
      );
    });

    const query = `
      INSERT INTO chat_history (
        chat_id, seg_id, start_time, end_time,
        chat_text, predicted_emotion,
        neu, hap, ang, sad,
        volume_rms, volume_db, font_size
      )
      VALUES ${placeholders.join(',')}
    `;

    await this.db.query(query, values);

    return segments;
  }

  async testInsert() {
  await this.db.query(`
    INSERT INTO users (name, email)
    VALUES ('test_user', 'test@example.com')
  `);

  return { message: 'inserted' };
}
}