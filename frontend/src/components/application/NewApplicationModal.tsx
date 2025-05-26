import { useRef, useState } from "react";
import Modal from "../public/Modal";
import CompanyDropdown from "../company/CompanyDropdown";
import { Company } from "../../types/Company";
import { FaLink, FaUser } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { createApplication } from "../../api/applications";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";

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

    // Save the application
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
        className="w-[60vh] rounded-xl flex flex-col px-8 py-6"
        useOverlay
      >
        <div className="w-full h-full flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold">Create a new application</h1>
          <div className="w-full flex flex-col gap-3">
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
                    className={`${
                      position ? "text-[#0077B5]" : "text-gray-300"
                    }`}
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
                    className={`${
                      location ? "text-[#0077B5]" : "text-gray-300"
                    }`}
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
                    className={`${link ? "text-[#0077B5]" : "text-gray-300"}`}
                  />
                </div>
                <input
                  type="url"
                  id="link"
                  className={`block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none ${
                    isValidLink || link.length === 0
                      ? "focus:border-blue-500"
                      : "border-red-500"
                  }`}
                  placeholder="Add Link"
                  value={link}
                  onChange={(e) => onLinkChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors mt-8 ${
              company && isValidPosition && isValidLink
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300"
            }`}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </Modal>
      <Toast ref={toast} />
    </>
  );
};

export default NewApplicationModal;
