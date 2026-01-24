interface DeletableCardProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function DeletableCard({
  value,
  placeholder,
  onChange,
  onRemove,
}: DeletableCardProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        type = "text"
        className = "w-full p-2 border-2 focus:outline-none focus:border-blue-500 border-gray-300 rounded-md"
        value = {value}
        placeholder = {placeholder}
        onChange = {(e) => onChange(e.target.value)}
      />
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}