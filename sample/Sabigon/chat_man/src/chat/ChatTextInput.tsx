import { type KeyboardEvent, useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onSend: () => void;
};

function ChatTextInput({ value, onChange, onKeyDown, onSend }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  // valueが空になったときにdivをクリア
  useEffect(() => {
    if (value === "" && editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }, [value]);

  return (
    <>
      <div
        id="editor"
        ref={editorRef}
        contentEditable
        className="rich-input"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={onKeyDown}
      ></div>

      <button onClick={onSend}>送信</button>
    </>
  );
}

export default ChatTextInput;