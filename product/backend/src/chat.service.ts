import { Injectable } from '@nestjs/common';
import { DatabaseService } from "./database/database.service";

//=======================
//データベースから履歴取得
//=======================
@Injectable()
export class ChatService {
    constructor(private readonly db:DatabaseService){}

    async getRoomHistory(roomId:number){
        const result = await this.db.query(
            `
            SELECT *
            FROM chat_history
            WHERE room_id = $1
            ORDER BY created_at ASC
            `,
            [roomId]
        );

        return result.rows;
    }
}