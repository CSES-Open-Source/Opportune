import React, { useRef, useState } from "react";
import Modal from "../public/Modal";
import CompanyDropdown from "../company/CompanyDropdown";
import { Company } from "../../types/Company";
import { createSavedApplication } from "../../api/savedApplications";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { parseErrorResponse } from "../../utils/errorHandler";
import {
  LuBuilding2, LuBriefcase, LuMapPin, LuLink, LuListChecks,
  LuCalendar, LuPlus, LuX,
} from "react-icons/lu";

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
      setMaterialsInput("");
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
        detail: parseErrorResponse(error),
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
        className="w-full max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden"
        useOverlay
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          border: "1px solid #2d3748",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #ec4899, #a78bfa)" }} />

        <div className="p-6 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: "rgba(236,72,153,0.12)",
                  border: "1px solid rgba(236,72,153,0.25)",
                }}
              >
                <LuPlus className="w-5 h-5 text-[#ec4899]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed]">Save New Application</h2>
                <p className="text-xs text-[#6b7280] mt-0.5">Draft an application to work on later</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetInputs();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4 overflow-y-auto pr-2">
            {/* Company */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBuilding2 className="w-3.5 h-3.5" />
                Company <span className="text-[#f87171]">*</span>
              </label>
              <div
                className="rounded-lg transition-all"
                style={{
                  background: "#141920",
                  border: company ? "1px solid #ec4899" : "1px solid #2d3748",
                }}
              >
                <CompanyDropdown
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  dropdownClassName="w-full py-2.5 bg-transparent text-[#e8eaed] outline-none"
                  buttonClassName=""
                />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBriefcase className="w-3.5 h-3.5" />
                Position <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => onPositionChange(e.target.value)}
                placeholder="e.g., Software Engineer Intern"
                className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                style={{
                  background: "#141920",
                  border: "1px solid #2d3748",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#ec4899"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuMapPin className="w-3.5 h-3.5" />
                Location <span className="text-[#6b7280]">(Optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="e.g., San Diego, CA"
                className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                style={{
                  background: "#141920",
                  border: "1px solid #2d3748",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#ec4899"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
              />
            </div>

            {/* Link */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuLink className="w-3.5 h-3.5" />
                Job Posting Link <span className="text-[#6b7280]">(Optional)</span>
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => onLinkChange(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                style={{
                  background: "#141920",
                  border: isValidLink || link.length === 0 ? "1px solid #2d3748" : "1px solid #f87171",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = isValidLink || link.length === 0 ? "#ec4899" : "#f87171"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = isValidLink || link.length === 0 ? "#2d3748" : "#f87171"}
              />
              {!isValidLink && link.length > 0 && (
                <p className="text-xs text-[#f87171] mt-1.5">Please enter a valid URL</p>
              )}
            </div>

            {/* Materials Needed */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuListChecks className="w-3.5 h-3.5" />
                Materials Needed <span className="text-[#6b7280]">(Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={materialsInput}
                  onChange={handleMaterialsInputChange}
                  placeholder="e.g., Resume, Cover Letter"
                  className="flex-1 p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#ec4899"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
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
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                    boxShadow: "0 2px 8px rgba(236,72,153,0.25)",
                  }}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {materialsNeeded.map((material, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border"
                    style={{
                      background: "rgba(236,72,153,0.12)",
                      color: "#ec4899",
                      borderColor: "rgba(236,72,153,0.3)",
                    }}
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(index)}
                      className="text-[#f87171] hover:text-[#ef4444] transition-colors"
                    >
                      <LuX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuCalendar className="w-3.5 h-3.5" />
                Deadline <span className="text-[#6b7280]">(Optional)</span>
              </label>
              <Calendar
                value={deadline}
                onChange={(e) => setDeadline(e.value || null)}
                showIcon={false}
                dateFormat="mm/dd/yy"
                placeholder="MM/DD/YYYY"
                inputClassName="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                inputStyle={{
                  background: "#141920",
                  border: "1px solid #2d3748",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
            <button
              onClick={() => {
                resetInputs();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!company || !isValidPosition || !isValidLink}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: company && isValidPosition && isValidLink
                  ? "linear-gradient(135deg, #ec4899, #a78bfa)"
                  : "#2d3748",
                boxShadow: company && isValidPosition && isValidLink
                  ? "0 4px 14px rgba(236,72,153,0.25)"
                  : "none",
              }}
            >
              <LuPlus className="w-4 h-4" />
              Save Application
            </button>
          </div>
        </div>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default NewSavedApplicationModal;