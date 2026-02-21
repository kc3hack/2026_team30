import type { KeyboardEvent } from "react";

type ChatTextInputProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
};

// 文字入力
function ChatTextInput({
  value,
  onChange,
  onKeyDown,
  onSend,
}: ChatTextInputProps) {
  return (
    <>
      {/* テキスト */}
      <input
        type="text"
        placeholder="メッセージ入力"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <button onClick={onSend}>送信</button>
    </>
  );
}

export default ChatTextInput;
