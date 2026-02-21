import { Injectable } from '@nestjs/common';
import { DatabaseService } from "./database/database.service";

export type Message = {
  text?: string;
  audio?: string;
  time: string;
  color?: string;
  size?: string;
  sender: "me" | "other";
};

//=======================
//データベースから履歴取得
//=======================
@Injectable()
export class ChatService {
    constructor(private readonly db:DatabaseService){}

    async getRoomHistory(senderId: string, receiverId: string) {
        const result = await this.db.query(
            `
            SELECT chat_history.chat_text AS text, chat_history.created_at AS time,
            chat_history.font_color AS color, chat_history.font_size AS size,
            CASE WHEN chat_rooms.senderid = $1 THEN 'me' ELSE 'other' END AS sender
            FROM chat_history
            JOIN chat_rooms ON chat_history.room_id = chat_rooms.room_id
            WHERE (senderid = $1 AND receiverid = $2) OR (senderid = $2 AND receiverid = $1)
            ORDER BY chat_history.created_at ASC
            `,
            [senderId, receiverId]
        );

        return result.rows;
    }
}