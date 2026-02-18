//ビジネスロジック

//テキスト処理
//音声ならPython呼び出し
//repository呼び出し


import { MessageEntity } from "../models/message.model";
import type {PythonMessageDTO} from "../dto/python.dto";
import { saveMessage } from "../repositories/message.repository";
import { callPython } from "../utils/pythonClient";
import { v4 as uuid } from "uuid";

export async function createFromAudio(
  senderId: string,
  receiverId: string,
  filePath: string
) {
  const pythonData: PythonMessageDTO = await callPython(filePath);

  const colorMap: Record<string, string> = {
    hap: "#FFD700",
    ang: "#FF4500",
    sad: "#4A90E2",
    neu: "#333333"
  };

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

  await saveMessage(message);

  return message;
}