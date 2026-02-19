//===============
//ビジネスロジック
//===============

import { MessageEntity } from "../models/message.model";
import type {PythonResponseDTO} from "../dto/python.dto";
import { saveMessage } from "../repositories/message.repository";
import { callPython } from "../utils/pythonClient";
import { findMessageBetweenUsers } from "../repositories/message.repository";

//音声ファイルからメッセージを作成する関数
export async function createFromAudio(
  senderId: string,
  receiverId: string,
  filePath: string
) {
  //Pythonに音声ファイルを渡してテキストと感情分析の結果を受け取る
  const pythonData: PythonResponseDTO = await callPython(filePath);

  //テキスト処理(感情に応じた色を設定)
  const colorMap: Record<string, string> = {
    hap: "#FFD700",
    ang: "#FF4500",
    sad: "#4A90E2",
    neu: "#333333"
  };

  //MessageEntityを作成して保存
  const message: MessageEntity = {
    id:pythonData.id,

    senderId,
    receiverId,

    text: pythonData.text,

    start:pythonData.start,
    end:pythonData.end,

    maxEmotion: pythonData.predicted_emotion,
    
    neu: pythonData.emotion_scores.neu,
    hap: pythonData.emotion_scores.hap,
    ang: pythonData.emotion_scores.ang,
    sad: pythonData.emotion_scores.sad,

    
    rms: pythonData.volume_rms,
    db: pythonData.volume_db,

    fontSize: pythonData.font_size,
    color: colorMap[pythonData.predicted_emotion] || "#000",

    createdAt: new Date()
  };
  //DBに保存
  await saveMessage(message);
  //保存したメッセージを返す
  return message;
}
  
//DBからユーザー間のメッセージを取得する関数
export async function getChatHistory(
  userId1: string,
  userId2: string
) {
  const messages = await findMessageBetweenUsers(userId1, userId2);
  
  //React向けにDTOに変換
  return messages.map((messages) => ({
    id: messages.id,
    senderId: messages.senderId,
    receiverId: messages.receiverId,
    text: messages.text,
    color: messages.color,
    fontSize: messages.fontSize,
    createdAt: messages.createdAt
  }));
}