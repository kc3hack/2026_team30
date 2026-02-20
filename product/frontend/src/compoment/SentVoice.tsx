import axios from "axios";

// Chat.tsxで録音した音声をサーバへ送るコンポーネント

// サーバーURL
const SERVER_URL = "http://127.0.0.1:3001";

// 録音した音声データをサーバへ送る関数
export const sendAudioToServer = async (): Promise<string | null> => {
    // 録音した音声データをlocalStorageから受け取る
    const audioData = localStorage.getItem("audioData");

    if (!audioData) {
        console.error("録音した音声データが見つかりません");
        return null;
    }

    try {
        // Base64データをBlobに変換
        const base64Data = audioData.split(',')[1] || audioData;
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });

        // FormDataを使ってWAVファイルとして送信
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        // サーバへのPOSTリクエストを送る
        const response = await axios.post(SERVER_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("response:", response.data);
        
        // JSONレスポンスからテキストを取得して返す
        if (response.data && response.data.text) {
            return response.data.text;
        } else if (typeof response.data === 'string') {
            return response.data;
        } else {
            return JSON.stringify(response.data);
        }
    } catch (error) {
        console.error("failed:", error);
        return null;
    }
};

// デフォルトエクスポート(コンポーネントとして使用する場合)
export default { sendAudioToServer };
