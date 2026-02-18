//DB操作
import { MessageEntity } from "../models/message.model";

//仮のDB操作、後にPostgreSQLと接続
const fakeDB: MessageEntity[] = [];

export async function saveMessage(
  message: MessageEntity
): Promise<void> {
  fakeDB.push(message);
}

export async function getMessages(): Promise<MessageEntity[]> {
  return fakeDB;
}