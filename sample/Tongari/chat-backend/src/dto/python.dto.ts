//Python通信用DTO
export interface PythonMessageDTO {
    //テキスト内容
    text:string;

    //一番値の大きい感情の種類
    maxEmotion:string;

    //感情の値
    neu:number;
    hap:number;
    ang:number;
    sad:number;

    //声の大きさ
    rms:number;
    db:number;

    //声の大きさから割り出されるフォントサイズ
    fontSize:number;
}