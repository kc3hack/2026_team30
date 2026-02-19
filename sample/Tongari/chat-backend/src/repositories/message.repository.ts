//DB操作
import e from "express";
import { MessageEntity } from "../models/message.model";

//仮のDB(メモリ)操作、後にPostgreSQLと接続
const fakeDB: MessageEntity[] = [];

export async function saveMessage(
  message: MessageEntity
): Promise<void> {
  fakeDB.push(message);
}

//ユーザー間のメッセージを取得
export async function findMessageBetweenUsers(
  userId1: string,
  userId2: string
): Promise<MessageEntity[]> {
  //DBからユーザー間のメッセージを取得し、作成日時でソートして返す
  return fakeDB
  .filter(
    (message) =>
    (message.senderId === userId1 && message.receiverId === userId2) ||
    (message.senderId === userId2 && message.receiverId === userId1)
  )
  .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}