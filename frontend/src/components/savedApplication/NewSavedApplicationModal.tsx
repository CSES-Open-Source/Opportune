import React, { useRef, useState } from "react";
import Modal from "../public/Modal";
import CompanyDropdown from "../company/CompanyDropdown";
import { Company } from "../../types/Company";
import { FaLink, FaUser, FaCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { LuListChecks } from "react-icons/lu";
import { createSavedApplication } from "../../api/savedApplications";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";

interface NewSavedApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSavedApplication: () => void;
}

const NewSavedApplicationModal = ({
  isOpen,
  onClose,
  onNewSavedApplication,
}: NewSavedApplicationModalProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);

  const [company, setCompany] = useState<Company>();
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState<string[]>([]);
  const [materialsInput, setMaterialsInput] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const [isValidPosition, setIsValidPosition] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  const onPositionChange = (pos: string) => {
    setPosition(pos);
    setIsValidPosition(pos.trim().length > 0);
  };

  // onLocationChange remains the same
  const onLocationChange = (loc: string) => {
    setLocation(loc);
  };

  const onLinkChange = (lnk: string) => {
    setLink(lnk);
    if (lnk.length === 0) {
      setIsValidLink(true);
      return;
    }
    try {
      new URL(lnk);
      setIsValidLink(true);
    } catch {
      setIsValidLink(false);
    }
  };

  const handleMaterialsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMaterialsInput(e.target.value);
  };

  const handleAddMaterial = () => {
    if (materialsInput.trim() !== "") {
      setMaterialsNeeded([...materialsNeeded, materialsInput.trim()]);
      setMaterialsInput(""); // Clear input after adding
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterialsNeeded(materialsNeeded.filter((_, i) => i !== index));
  };

  const resetInputs = () => {
    setCompany(undefined);
    setPosition("");
    setLocation("");
    setLink("");
    setMaterialsNeeded([]);
    setMaterialsInput("");
    setDeadline(null);
    // setNotes("");
    setIsValidPosition(false);
    setIsValidLink(true);
  };

  const onSave = async () => {
    if (!user || !company || !isValidPosition || !isValidLink) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Please select a company and enter a valid position.",
      });
      return;
    }

    try {
      await createSavedApplication({
        userId: user._id,
        company: company,
        position,
        location: location && location.length > 0 ? location : undefined,
        link: link && link.length > 0 ? link : undefined,
        materialsNeeded:
          materialsNeeded.length > 0 ? materialsNeeded : undefined,
        deadline: deadline || undefined,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Saved application created successfully",
      });
      resetInputs();
      onNewSavedApplication();
      onClose();
    } catch (error: unknown) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Failed to create saved application: " + (error as Error).message,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetInputs();
          onClose();
        }}
        className="w-[75vh] max-w-lg rounded-xl flex flex-col px-8 py-6"
        useOverlay
      >
        <div className="w-full h-full flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold">Save New Application</h1>{" "}
          {/* Updated title */}
          <div className="w-full flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-2">
            {" "}
            {/* Added scroll for content */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <CompanyDropdown
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                dropdownClassName={`w-full py-0.5 border-2 border-gray-200 rounded-lg ${
                  company ? "border-blue-500" : ""
                }`}
                buttonClassName=""
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="position"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Position
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser
                    size={22}
                    className={`${position ? "text-primary" : "text-gray-300"}`}
                  />
                </div>
                <input
                  type="text"
                  id="position"
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add Position"
                  value={position}
                  onChange={(e) => onPositionChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Location (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLocationDot
                    size={22}
                    className={`${location ? "text-primary" : "text-gray-300"}`}
                  />
                </div>
                <input
                  type="text"
                  id="location"
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add Location"
                  value={location}
                  onChange={(e) => onLocationChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="link"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Link (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLink
                    size={22}
                    className={`${link ? "text-primary" : "text-gray-300"}`}
                  />
                </div>
                <input
                  type="url"
                  id="link"
                  className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none ${
                    isValidLink || link.length === 0
                      ? "focus:border-blue-500 border-gray-200"
                      : "border-red-500"
                  }`}
                  placeholder="Add Link"
                  value={link}
                  onChange={(e) => onLinkChange(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="materials"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Materials Needed (Optional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LuListChecks
                    size={22}
                    className={`${
                      materialsNeeded.length > 0
                        ? "text-primary"
                        : "text-gray-300"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  id="materials"
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add a material (e.g., Resume)"
                  value={materialsInput}
                  onChange={handleMaterialsInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMaterial();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {materialsNeeded.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="deadline"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Deadline (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <FaCalendarAlt
                    size={22}
                    className={`${deadline ? "text-primary" : "text-gray-300"}`}
                  />
                </div>
                <Calendar
                  id="deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.value || null)}
                  showIcon={false}
                  dateFormat="mm/dd/yy"
                  placeholder="MM/DD/YYYY"
                  inputClassName="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  panelClassName="mt-1"
                />
              </div>
            </div>
          </div>
          <button
            className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors mt-4 ${
              // Adjusted margin-top
              company && isValidPosition && isValidLink
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
            onClick={onSave}
            disabled={!company || !isValidPosition || !isValidLink}
          >
            Save Application
          </button>
        </div>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default NewSavedApplicationModal;
