//=====================================================================
//チャットの送った時間を見やすいように整形(バックエンドがするなら消していい)
//=====================================================================

import type { ChatMessageResponseAPI, Message } from "./types";

// API レスポンス (YYYY-MM-DD HH:MM:SS.ffffff形式) を UI 用に変換
export function convertApiMessagesToUIMessages(
  apiMessages: ChatMessageResponseAPI[]
): Message[] {
  return apiMessages.map((apiMsg) => ({
    text: apiMsg.text,
    time: formatTime(apiMsg.createAt),
    color: apiMsg.textColor,
    size: apiMsg.textSize,
    sender: "other",
  }));
}

// 時間フォーマット: "2026-02-20 12:55:00.308919" → "12:55"
export function formatTime(timeString: string): string {
  try {
    // "YYYY-MM-DD HH:MM:SS.ffffff" 形式から HH:MM を抽出
    const timePart = timeString.split(" ")[1]; // "12:55:00.308919"
    const [hours, minutes] = timePart.split(":");
    return `${hours}:${minutes}`;
  } catch {
    return timeString; // パース失敗時はそのまま返す
  }
}