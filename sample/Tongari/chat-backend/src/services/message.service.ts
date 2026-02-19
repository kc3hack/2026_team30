//ビジネスロジック
import { MessageEntity } from "../models/message.model";
import type {PythonMessageDTO} from "../dto/python.dto";
import { saveMessage } from "../repositories/message.repository";
import { callPython } from "../utils/pythonClient";
import { v4 as uuid } from "uuid";
import { findMessageBetweenUsers } from "../repositories/message.repository";
import { text } from "node:stream/consumers";

//音声ファイルからメッセージを作成する関数
export async function createFromAudio(
  senderId: string,
  receiverId: string,
  filePath: string
) {
  //Pythonに音声ファイルを渡してテキストと感情分析の結果を受け取る
  const pythonData: PythonMessageDTO = await callPython(filePath);

  //テキスト処理(感情に応じた色を設定)
  const colorMap: Record<string, string> = {
    hap: "#FFD700",
    ang: "#FF4500",
    sad: "#4A90E2",
    neu: "#333333"
  };

  //MessageEntityを作成して保存
  const message: MessageEntity = {
    id: uuid(),

    senderId,
    receiverId,

    text: pythonData.text,

    maxEmotion: pythonData.maxEmotion,

    neu: pythonData.neu,
    hap: pythonData.hap,
    ang: pythonData.ang,
    sad: pythonData.sad,

    rms: pythonData.rms,
    db: pythonData.db,

    fontSize: pythonData.fontSize,
    color: colorMap[pythonData.maxEmotion] || "#000",

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