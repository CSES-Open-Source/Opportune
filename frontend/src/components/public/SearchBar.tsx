import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaSistrix } from "react-icons/fa6";
import camelize from "../../utils/camelize";

interface SelectionOption {
  label: string;
  options: string[];
  single?: boolean; // Whether the selection option is single select
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
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Subcomponent of the SearchBar component used to display a group of checkboxes for a selection option.
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
    <div className="absolute top-8 flex flex-col gap-2 min-w-[150px] bg-background shadow-md rounded-md z-10">
      <div className="flex flex-col gap-1 border border-gray-300 p-2 rounded-md">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type={single ? "radio" : "checkbox"}
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
 *     "location": string[];
 *     "department": string[];
 *     "type": string[];
 * }
 * ```
 *
 * @param {SearchBarProps<T>} props - The props for the SearchBar component.
 * @param {Array<{ label: string; options: string[]; single: boolean }>} props.selections - An array of selection objects, each containing a label, an array of options, and whether or not it should be single select. The options will be displayed in a dropdown as checkboxes when the corresponding label is clicked.
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
      className="flex flex-col gap-2 rounded-lg"
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
            className="flex-1 p-3 text-base border-none outline-none"
            name="query"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base font-medium"
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
              className="px-5 py-0.5 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex flex-row justify-center items-center gap-2"
            >
              <span>{selection.label}</span>
              <FaAngleDown />
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
        ))}
      </div>
    </form>
  );
};

export default SearchBar;
