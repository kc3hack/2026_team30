import { Injectable } from '@nestjs/common';
import { DatabaseService } from "./database/database.service";

@Injectable()
export class ChatService {
    constructor(private readonly db:DatabaseService){}

    //=======================
    //データベースから履歴取得
    //=======================
    async getRoomHistory(roomId:number){
        const result = await this.db.query(
            `
            SELECT chat_text, font_size, font_color, created_at
            FROM chat_history
            WHERE room_id = $1
            ORDER BY created_at ASC
            `,
            [roomId]
        );

        return result.rows;
    }

    //=================================
    //テキストが送られてきたときの保存処理
    //=================================
    async saveTextMessage(data:any){
        const {
            senderId,
            recieverId,
            text,
            fontSize,
            fontColor
        } = data;

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