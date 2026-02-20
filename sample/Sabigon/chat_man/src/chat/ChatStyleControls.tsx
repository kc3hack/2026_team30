type ChatStyleControlsProps = {
  color: string;
  size: string;
  onColorChange: (value: string) => void;
  onSizeChange: (value: string) => void;
};

// 色とサイズの変更
function ChatStyleControls({
  color,
  size,
  onColorChange,
  onSizeChange,
}: ChatStyleControlsProps) {
  return (
    <>
      {/* サイズ */}
      <select value={size} onChange={(e) => onSizeChange(e.target.value)}>
        <option value="12">小</option>
        <option value="16">中</option>
        <option value="24">大</option>
        <option value="32">特大</option>
      </select>

      {/* 色 */}
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
      />
    </>
  );
}

export default ChatStyleControls;
