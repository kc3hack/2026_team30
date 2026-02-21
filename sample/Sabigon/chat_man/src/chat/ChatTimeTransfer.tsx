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
// ISO形式対応版
export function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);

    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString;
  }
}