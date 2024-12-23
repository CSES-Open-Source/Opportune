import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

interface SelectionOption {
  label: string;
  options: string[];
}

interface SearchBarProps<T> {
  selections: SelectionOption[];
  onSubmitForm?: (formData: T) => void;
  setResult?: (result: unknown) => void;
  width?: string;
}

interface CheckboxGroupProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

// Subcomponent of the SearchBar component used to display a group of checkboxes for a selection option.
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const handleCheckboxChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className="absolute top-12 flex flex-col gap-2 min-w-[150px] bg-white shadow-md rounded-md z-10">
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
 * @template T - The type of the form data to be submitted.
 *
 * @param {SearchBarProps<T>} props - The props for the SearchBar component.
 * @param {Array<{ label: string; options: string[] }>} props.selections - An array of selection objects, each containing a label and an array of options. The options will be displayed as checkboxes when the corresponding label is clicked.
 * @param {(formData: T) => void} [props.onSubmitForm] - A callback function to handle form submission. The function will be called with the current state of the form data as an argument when the form is submitted.
 * @param {string} [props.width="100%"] - The width of the search bar component. Defaults to "100%".
 *
 * @returns {React.JSX.Element} The rendered search bar component.
 */
const SearchBar = <T extends Record<string, unknown>>({
  selections,
  onSubmitForm,
  width = "100%",
}: SearchBarProps<T>) => {
  const [query, setQuery] = useState(""); // String search query input

  const [selectionValues, setSelectionValues] = useState<
    Record<string, string[]>
  >(
    selections.reduce((acc, selection) => {
      acc[selection.label] = [];
      return acc;
    }, {} as Record<string, string[]>),
  ); // Object to store selected values for each selection option

  const [expanded, setExpanded] = useState<string>(""); // Current expanded selection option

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
        <input
          type="text"
          placeholder="Search by job title, ID, or keyword"
          value={query}
          onChange={handleInputChange}
          className="flex-1 p-2 text-base border border-gray-300 rounded-md"
          name="query"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {selections.map((selection) => (
          <div
            key={selection.label}
            className="relative flex flex-col gap-2 items-start"
          >
            <button
              type="button"
              onClick={() => toggleSelection(selection.label)}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex flex-row justify-center items-center gap-2"
            >
              <span>{selection.label}</span>
              <FaAngleDown />
            </button>
            {expanded === selection.label && (
              <CheckboxGroup
                options={selection.options}
                selectedValues={selectionValues[selection.label]}
                onChange={(values) =>
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
