import React, { useEffect, useRef, useState } from "react";
import { LuSearch, LuChevronDown } from "react-icons/lu";
import camelize from "../../utils/camelize";

interface SelectionOption {
  label: string;
  options: string[];
  single?: boolean;
}

interface SearchBarProps<T> {
  selections: SelectionOption[];
  placeholder?: string;
  onSubmitForm?: (formData: T) => void;
  width?: string;
}

interface CheckboxGroupProps {
  options: string[];
  selectedValues: string[];
  single?: boolean;
  onUpdate: (values: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  single = false,
  selectedValues,
  onUpdate,
}) => {
  const handleCheckboxChange = (value: string) => {
    let newValues;
    if (single) {
      newValues = [value];
    } else {
      newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
    }
    onUpdate(newValues);
  };

  return (
    <div
      className="absolute top-10 flex flex-col gap-2 min-w-[150px] rounded-lg shadow-2xl z-20 border overflow-hidden animate-fadeIn"
      style={{
        background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
        borderColor: "#2d3748",
      }}
    >
      <div className="flex flex-col p-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#e8eaed] cursor-pointer hover:bg-[#141920] transition-colors"
          >
            <input
              type={single ? "radio" : "checkbox"}
              checked={selectedValues.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="form-checkbox w-4 h-4 rounded border-[#2d3748] text-[#5b8ef4] focus:ring-[#5b8ef4] focus:ring-offset-0 bg-[#141920]"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
    
  );
};

const SearchBar = <T extends Record<string, unknown>>({
  selections,
  placeholder = "Search",
  onSubmitForm,
  width = "100%",
}: SearchBarProps<T>): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const [selectionValues, setSelectionValues] = useState<Record<string, string[]>>(
    selections.reduce((acc, selection) => {
      acc[selection.label] = [];
      return acc;
    }, {} as Record<string, string[]>),
  );
  const [expanded, setExpanded] = useState<string>("");
  const selectionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectionsRef.current &&
      !selectionsRef.current.contains(event.target as Node)
    ) {
      setExpanded("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelectionChange = (label: string, values: string[]) => {
    setSelectionValues({ ...selectionValues, [label]: values });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const camelizedSelectionValues = Object.keys(selectionValues).reduce(
      (acc, key) => {
        acc[camelize(key)] = selectionValues[key];
        return acc;
      },
      {} as Record<string, string[]>,
    );

    const formData = { query, ...camelizedSelectionValues } as unknown as T;
    if (onSubmitForm) {
      onSubmitForm(formData);
    }
  };

  const toggleSelection = (label: string) => {
    setExpanded((prev) => (prev === label ? "" : label));
  };

  return (
    <form
      className="flex flex-col gap-3"
      style={{ width }}
      onSubmit={handleFormSubmit}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center flex-1 rounded-xl px-4 py-2.5 border transition-all"
          style={{
            background: "#141920",
            borderColor: "#2d3748",
          }}
        >
          <LuSearch className="text-[#6b7280] w-4 h-4 mr-3" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-[#e8eaed] placeholder-[#4b5563] outline-none text-sm"
            name="query"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
            boxShadow: "0 4px 14px rgba(91,142,244,0.25)",
          }}
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-2" ref={selectionsRef}>
        {selections.map((selection) => {
          const hasSelections = selectionValues[selection.label].length > 0;
          return (
            <div
              key={selection.label}
              className="relative"
            >
              <button
                type="button"
                onClick={() => toggleSelection(selection.label)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{
                  background: hasSelections ? "rgba(91,142,244,0.12)" : "#1a1f2e",
                  border: hasSelections ? "1px solid rgba(91,142,244,0.35)" : "1px solid #2d3748",
                  color: hasSelections ? "#5b8ef4" : "#9ca3af",
                }}
              >
                <span>{selection.label}</span>
                {hasSelections && (
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)" }}
                  >
                    {selectionValues[selection.label].length}
                  </span>
                )}
                <LuChevronDown
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: expanded === selection.label ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {expanded === selection.label && (
                <CheckboxGroup
                  options={selection.options}
                  selectedValues={selectionValues[selection.label]}
                  single={selection.single}
                  onUpdate={(values) =>
                    handleSelectionChange(selection.label, values)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </form>
  );
};

export default SearchBar;