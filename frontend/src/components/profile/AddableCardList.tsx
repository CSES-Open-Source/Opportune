import { DeletableCard } from "./DeletableCard";

interface AddableCardProps {
  label: string;
  values: string[];
  placeholder?: string;
  maxItems?: number;
  onChange: (next: string[]) => void;
}

export function AddableCardList({
  label,
  values,
  placeholder = "New item",
  maxItems,
  onChange,
}: AddableCardProps) {

  const addItem = () => {
    if (maxItems && values.length >= maxItems) return;
    onChange([...values, ""]);
  };

  const updateItem = (index: number, value: string) => {
    onChange(values.map((v, i) => (i === index ? value : v)));
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={addItem}
          disabled={maxItems ? values.length >= maxItems : false}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
            boxShadow: '0 2px 8px rgba(91,142,244,0.25)',
          }}
        >
          <span className="text-lg leading-none">+</span>
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-2">
        {values.map((value, index) => (
          <DeletableCard
            key={index}
            value={value}
            placeholder={placeholder}
            onChange={(v) => updateItem(index, v)}
            onRemove={() => removeItem(index)}
          />
        ))}
      </div>
    </div>
  );
}