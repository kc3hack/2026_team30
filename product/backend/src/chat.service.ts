import { Injectable } from '@nestjs/common';
import { DatabaseService } from "./database/database.service";

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

    //=================================
    //テキストが送られてきたときの保存処理
    //=================================
    async saveTextMessage(senderId: string, recieverId: string, text: string, fontColor: string, fontSize: number) {

        //room_id取得
        const roomResult = await this.db.query(
            `
            SELECT room_id FROM chat_rooms
            WHERE senderid = $1 AND receiverid = $2
            `,
            [senderId, recieverId]
        );

        if(roomResult.rows.length === 0){
            throw new Error('Room not found:ルームが見つかりません');
        }
        const roomId = roomResult.rows[0].room_id;

        //データベースに追加
        await this.db.query(
            `
            INSERT INTO chat_history(
            room_id,
            chat_text,
            font_size,
            font_color
            )
            VALUES($1,$2,$3,$4)
            `,
            [roomId,text,fontSize,fontColor]
        );

        return { success:true };
    }
}