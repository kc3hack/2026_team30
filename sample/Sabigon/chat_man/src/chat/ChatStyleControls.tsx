type Props = {
  color: string;
  size: string;
  onColorChange: (val: string) => void;
  onSizeChange: (val: string) => void;
};

function ChatStyleControls({
  color,
  size,
  onColorChange,
  onSizeChange,
}: Props) {

  // 選択範囲に色適用
  const applyColor = (selectedColor: string) => {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, selectedColor);
    onColorChange(selectedColor);
  };

  return (
    <>
      {/* 色 */}
      <input
        type="color"
        value={color}
        onChange={(e) => applyColor(e.target.value)}
        onClick={(e) => {
          (e.currentTarget as HTMLInputElement).value = "";
        }}
      />

      {/* サイズ（メッセージ全体用） */}
      <select
        value={size}
        onChange={(e) => onSizeChange(e.target.value)}
      >
        <option value="12">小</option>
        <option value="16">中</option>
        <option value="24">大</option>
        <option value="32">特大</option>
      </select>
    </>
  );
}

export default ChatStyleControls;