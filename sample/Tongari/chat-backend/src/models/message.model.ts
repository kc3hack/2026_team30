//DB用型(Entity)

export interface MessageEntity {
    id: number; //DB連番

    senderId: string;
    receiverId: string;

    text: string;

    //=========
    //分析用
    //=========

    //時間範囲
    start:number;
    end:number;

    maxEmotion: string | null;

    //音声解析結果
    neu: number | null;
    hap: number | null;
    ang: number | null;
    sad: number | null;

    rms: number | null;
    db: number | null;


    //=========
    //表示用
    //=========

    //テキスト表示用スタイル(常時保存)
    fontSize: number;
    color: string;

    createdAt: Date;
}