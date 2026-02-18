//DB用型(Entity)

export interface MessageEntity {
    id: string;

    senderId: string;
    receiverId: string;

    text: string;

    maxEmotion: string | null;

    //音声解析結果
    neu: number | null;
    hap: number | null;
    ang: number | null;
    sad: number | null;

    rms: number | null;
    db: number | null;

    //テキスト表示用スタイル(常時保存)
    fontSize: number;
    color: string;

    createdAt: Date;
}