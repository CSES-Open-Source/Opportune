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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add
        </button>
      </div>

      <div className="block text-sm font-medium text-gray-500 mb-1">
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
