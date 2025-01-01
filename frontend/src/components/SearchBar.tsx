import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaSistrix } from "react-icons/fa6";

interface SelectionOption {
  label: string;
  options: string[];
}

interface SearchBarProps<T> {
  selections: SelectionOption[];
  placeholder?: string;
  onSubmitForm?: (formData: T) => void;
  width?: string;
}

interface CheckboxGroupProps extends React.ComponentProps<"div"> {
  options: string[];
  selectedValues: string[];
  onUpdate: (values: string[]) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Subcomponent of the SearchBar component used to display a group of checkboxes for a selection option.
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onUpdate,
  className,
  ...props
}) => {
  const handleCheckboxChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onUpdate(newValues);
  };

  return (
    <div
      className={`absolute top-12 flex flex-col gap-2 min-w-[150px] bg-white shadow-md rounded-md z-10 ${className}`}
      {...props}
    >
      <div className="flex flex-col gap-1 border border-gray-300 p-2 rounded-md">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="form-checkbox"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

/**
 * A generic search bar component that allows users to input a query and select multiple options from dropdowns.
 *
 * @template T - The type of the form data object that will be passed to the `onSubmitForm` callback function. The object should contain a `query` field of type string and additional fields for each selection option.
 *
 * An example `FormData` interface if your form data contains the selection options titled `"Location"`, `"Department"`, and `"Type"`:
 *
 * @example
 *
 * ```ts
 * interface FormData extends Record<string, string | string[]> {
 *     query: string;
 *     location: string[];
 *     department: string[];
 *     type: string[];
 * }
 * ```
 *
 * @param {SearchBarProps<T>} props - The props for the SearchBar component.
 * @param {Array<{ label: string; options: string[] }>} props.selections - An array of selection objects, each containing a label and an array of options. The options will be displayed in a dropdown as checkboxes when the corresponding label is clicked.
 * @param {string} [props.placeholder="Search"] - The placeholder text for the search input field. Defaults to "Search".
 * @param {(formData: T) => void} [props.onSubmitForm] - A callback function to handle form submission. The function will be called with the current state of the form data as an argument when the form is submitted.
 * @param {string} [props.width="100%"] - The width of the search bar component. Defaults to "100%".
 *
 * @returns {React.JSX.Element} The rendered search bar component.
 */
const SearchBar = <T extends Record<string, unknown>>({
  selections,
  placeholder = "Search",
  onSubmitForm,
  width = "100%",
}: SearchBarProps<T>): React.JSX.Element => {
  // String search query input
  const [query, setQuery] = useState("");

  // Object to store selected values for each selection option
  const [selectionValues, setSelectionValues] = useState<
    Record<string, string[]>
  >(
    selections.reduce((acc, selection) => {
      acc[selection.label] = [];
      return acc;
    }, {} as Record<string, string[]>),
  );

  // Current expanded selection option
  const [expanded, setExpanded] = useState<string>("");

  // Reference to the selections container, used for auto-closing dropdowns
  const selectionsRef = useRef<HTMLDivElement>(null);

  // Function to handle clicks outside the search bar container to close dropdowns
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

  // Event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelectionChange = (label: string, values: string[]) => {
    setSelectionValues({ ...selectionValues, [label]: values });
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = { query, ...selectionValues } as unknown as T;
    if (onSubmitForm) {
      onSubmitForm(formData);
    }
  };

  const toggleSelection = (label: string) => {
    setExpanded((prev) => (prev === label ? "" : label));
  };

  return (
    <form
      className="flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-white"
      style={{ width }}
      onSubmit={handleFormSubmit}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-gray-300 rounded-md flex-1">
          <FaSistrix className="ml-2 text-gray-700" size={20} />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="flex-1 p-2 text-base border-none outline-none"
            name="query"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap gap-4 self-start" ref={selectionsRef}>
        {selections.map((selection) => (
          <div
            key={selection.label}
            className="relative flex flex-col gap-2 items-start"
          >
            <button
              type="button"
              onClick={() => toggleSelection(selection.label)}
              className="px-3 py-1 text-md text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex flex-row justify-center items-center gap-2"
            >
              <span>{selection.label}</span>
              <FaAngleDown />
            </button>
            {expanded === selection.label && (
              <CheckboxGroup
                options={selection.options}
                selectedValues={selectionValues[selection.label]}
                onUpdate={(values) =>
                  handleSelectionChange(selection.label, values)
                }
              />
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default SearchBar;
