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
        type="text"
        className="w-full px-3 py-2.5 rounded-lg border-2 text-[#e8eaed] placeholder-[#6b7280] focus:outline-none transition-all"
        style={{
          background: '#141920',
          borderColor: '#2d3748',
        }}
        onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#5b8ef4'}
        onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#2d3748'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={onRemove}
        className="text-[#6b7280] hover:text-[#f87171] transition-all hover:scale-110 p-1"
        type="button"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}