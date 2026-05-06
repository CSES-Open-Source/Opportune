import { useRef, useState } from "react";
import Modal from "../public/Modal";
import CompanyDropdown from "../company/CompanyDropdown";
import { Company } from "../../types/Company";
import { createApplication } from "../../api/applications";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { LuBuilding2, LuBriefcase, LuMapPin, LuLink, LuPlus, LuX } from "react-icons/lu";

interface NewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewApplication: () => void;
}

const NewApplicationModal = ({
  isOpen,
  onClose,
  onNewApplication,
}: NewApplicationModalProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);

  const [company, setCompany] = useState<Company>();
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");

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

  const resetInputs = () => {
    setCompany(undefined);
    setPosition("");
    setLocation("");
    setLink("");
    setIsValidPosition(false);
    setIsValidLink(true);
  };

  const onSave = async () => {
    if (!user || !company || !isValidPosition || !isValidLink) {
      return;
    }

    try {
      await createApplication({
        userId: user._id,
        company: company,
        location: location && location.length > 0 ? location : undefined,
        link: link && link.length > 0 ? link : undefined,
        process: [],
        position,
      });

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Application created successfully",
      });
    } catch (error: unknown) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create application: " + (error as Error).message,
      });
    }

    resetInputs();
    onNewApplication();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-md rounded-2xl flex flex-col p-0 overflow-hidden"
        useOverlay
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          border: "1px solid #2d3748",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #5b8ef4, #7c3aed)" }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: "rgba(91,142,244,0.12)",
                  border: "1px solid rgba(91,142,244,0.25)",
                }}
              >
                <LuPlus className="w-5 h-5 text-[#5b8ef4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed]">New Application</h2>
                <p className="text-xs text-[#6b7280] mt-0.5">Track a new job application</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Company */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBuilding2 className="w-3.5 h-3.5" />
                Company <span className="text-[#f87171]">*</span>
              </label>
              <CompanyDropdown
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                dropdownClassName="w-full py-2.5 text-[#e8eaed] outline-none"
                buttonClassName=""
              />
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
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
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
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
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
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = isValidLink || link.length === 0 ? "#5b8ef4" : "#f87171"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = isValidLink || link.length === 0 ? "#2d3748" : "#f87171"}
              />
              {!isValidLink && link.length > 0 && (
                <p className="text-xs text-[#f87171] mt-1.5">Please enter a valid URL</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
            <button
              onClick={onClose}
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
                  ? "linear-gradient(135deg, #5b8ef4, #7c3aed)"
                  : "#2d3748",
                boxShadow: company && isValidPosition && isValidLink
                  ? "0 4px 14px rgba(91,142,244,0.25)"
                  : "none",
              }}
            >
              <LuPlus className="w-4 h-4" />
              Create Application
            </button>
          </div>
        </div>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default NewApplicationModal;