//Pythonに送るDTO
export interface PythonRequestDTO {
    audioId: number;
    audioPath: string;
}

//Pythonから貰うDTO
export interface PythonResponseDTO {
    id: number;

    //文章の区切りの秒数(最初、最後)
    start:number;
    end:number;

    //テキスト内容
    text:string;

    //一番値の大きい感情の種類
    predicted_emotion:string;

    //感情の値
    emotion_scores:{
        neu:number;
        hap:number;
        ang:number;
        sad:number;
    };
    
    //声の大きさ
    volume_rms:number;
    volume_db:number;

    //声の大きさから割り出されるフォントサイズ
    font_size:number;
}