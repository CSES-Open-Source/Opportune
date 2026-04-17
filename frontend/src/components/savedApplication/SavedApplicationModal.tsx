import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  SavedApplication,
  UpdateSavedApplicationRequest,
} from "../../types/SavedApplication";
import Modal from "../public/Modal";
import { Calendar } from "primereact/calendar";
import {
  deleteSavedApplication,
  updateSavedApplication,
} from "../../api/savedApplications";
import { Toast } from "primereact/toast";
import Dialog from "../public/Dialog";
import {
  getEmployeesLabel,
  getIndustryLabel,
} from "../../utils/valuesToLabels";
import {
  LuLayers, LuUsers, LuBriefcase, LuMapPin, LuLink, LuCalendar,
  LuListChecks, LuX, LuPencil, LuTrash2, LuSave, LuBuilding2,
} from "react-icons/lu";
import { parseErrorResponse } from "../../utils/errorHandler";

const defaultLogo = "/assets/defaultLogo.png";

interface SavedApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApplication: SavedApplication;
  setSavedApplication: Dispatch<SetStateAction<SavedApplication>>;
  onSaveApplication: () => void;
}

const SavedApplicationModal = ({
  isOpen,
  onClose,
  savedApplication,
  setSavedApplication,
  onSaveApplication,
}: SavedApplicationModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedSavedApplication, setUpdatedSavedApplication] =
    useState<UpdateSavedApplicationRequest>({});
  const [isValidLink, setIsValidLink] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [onDialogConfirm, setOnDialogConfirm] = useState<() => void>(() => {});
  const [materialsInput, setMaterialsInput] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState<string[]>(
    savedApplication.materialsNeeded || [],
  );

  const toast = useRef<Toast>(null);

  const resetStates = () => {
    setIsEditing(false);
    setUpdatedSavedApplication({});
    setDialogText("");
    setOnDialogConfirm(() => {});
    setMaterialsInput("");
    setMaterialsNeeded(savedApplication.materialsNeeded || []);
  };

  const onSave = (id: string, updatedApp: UpdateSavedApplicationRequest) => {
    updateSavedApplication(id, updatedApp)
      .then((response) => {
        if (response.success) {
          resetStates();
          setSavedApplication(response.data);
          onSaveApplication();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Saved Application updated successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: parseErrorResponse(error),
        });
      });
  };

  const onDelete = (savedApplicationId: string) => {
    deleteSavedApplication(savedApplicationId)
      .then((response) => {
        if (response.success) {
          resetStates();
          onSaveApplication();
          onClose();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Saved Application deleted successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: parseErrorResponse(error),
        });
      });
  };

  const handleDeleteSavedApplication = () => {
    setIsDialogOpen(true);
    setDialogText("Are you sure you want to delete this saved application?");
    setOnDialogConfirm(() => () => onDelete(savedApplication._id));
  };

  const handleEditApplication = () => {
    setUpdatedSavedApplication({
      position: savedApplication.position,
      link: savedApplication.link,
      location: savedApplication.location,
      materialsNeeded: savedApplication.materialsNeeded || [],
      deadline: savedApplication.deadline,
    });
    setMaterialsNeeded(savedApplication.materialsNeeded || []);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onSave(savedApplication._id, {
      ...updatedSavedApplication,
      materialsNeeded: materialsNeeded,
    });
    setIsEditing(false);
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

  const onLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setUpdatedSavedApplication((prev) => ({
      ...prev,
      link: link,
    }));

    if (link.length === 0) {
      setIsValidLink(true);
      return;
    }

    try {
      new URL(link);
      setIsValidLink(true);
    } catch {
      setIsValidLink(false);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          resetStates();
          onClose();
        }}
        className="w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col p-0 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          border: "1px solid #2d3748",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #ec4899, #a78bfa)" }} />

        <div className="p-6 flex flex-col overflow-hidden max-h-[90vh]">
          {/* Header with Company Info */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b" style={{ borderColor: "#2d3748" }}>
            {/* Company logo */}
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 border"
              style={{ background: "#141920", borderColor: "#2d3748" }}
            >
              <img
                src={savedApplication.company.logo || defaultLogo}
                alt={savedApplication.company.name}
                className="w-12 h-12 object-contain rounded"
              />
            </div>

            {/* Company info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#e8eaed] mb-1">
                {savedApplication.company.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {savedApplication.company.industry && (
                  <div className="flex items-center gap-1.5 text-[#9ca3af]">
                    <LuLayers className="w-3.5 h-3.5" />
                    <span>{getIndustryLabel(savedApplication.company.industry)}</span>
                  </div>
                )}
                {savedApplication.company.employees && (
                  <div className="flex items-center gap-1.5 text-[#9ca3af]">
                    <LuUsers className="w-3.5 h-3.5" />
                    <span>{getEmployeesLabel(savedApplication.company.employees)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                resetStates();
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Form fields - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Position & Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuBriefcase className="w-3.5 h-3.5" />
                  Position
                </label>
                {isEditing ? (
                  <input
                    value={updatedSavedApplication.position || ""}
                    onChange={(e) =>
                      setUpdatedSavedApplication((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                    style={{
                      background: "#141920",
                      border: "1px solid #2d3748",
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#ec4899"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
                  />
                ) : (
                  <p className="text-[#e8eaed] text-sm">{savedApplication.position}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuMapPin className="w-3.5 h-3.5" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    value={updatedSavedApplication.location || ""}
                    onChange={(e) =>
                      setUpdatedSavedApplication((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="e.g., San Diego, CA"
                    className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                    style={{
                      background: "#141920",
                      border: "1px solid #2d3748",
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#ec4899"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
                  />
                ) : (
                  <p className="text-[#e8eaed] text-sm">
                    {savedApplication.location || <span className="text-[#6b7280]">Not specified</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Link & Deadline Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuLink className="w-3.5 h-3.5" />
                  Job Link
                </label>
                {isEditing ? (
                  <>
                    <input
                      value={updatedSavedApplication.link || ""}
                      onChange={onLinkChange}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                      style={{
                        background: "#141920",
                        border: isValidLink ? "1px solid #2d3748" : "1px solid #f87171",
                      }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = isValidLink ? "#ec4899" : "#f87171"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = isValidLink ? "#2d3748" : "#f87171"}
                    />
                    {!isValidLink && (
                      <p className="text-xs text-[#f87171] mt-1.5">Please enter a valid URL</p>
                    )}
                  </>
                ) : (
                  <div>
                    {savedApplication.link ? (
                      <a
                        href={savedApplication.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[#ec4899] hover:text-[#f472b6] hover:underline transition-colors inline-flex items-center gap-1"
                      >
                        View Job Posting
                        <LuLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-[#6b7280] text-sm">Not specified</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuCalendar className="w-3.5 h-3.5" />
                  Deadline
                </label>
                {isEditing ? (
                  <Calendar
                    value={
                      updatedSavedApplication.deadline
                        ? new Date(updatedSavedApplication.deadline)
                        : null
                    }
                    onChange={(e) => {
                      setUpdatedSavedApplication((prev) => ({
                        ...prev,
                        deadline: e.value as Date | undefined,
                      }));
                    }}
                    placeholder="MM/DD/YYYY"
                    showIcon={false}
                    dateFormat="mm/dd/yy"
                    inputClassName="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                    inputStyle={{
                      background: "#141920",
                      border: "1px solid #2d3748",
                    }}
                  />
                ) : (
                  <p className="text-[#e8eaed] text-sm">
                    {savedApplication.deadline
                      ? new Date(savedApplication.deadline).toLocaleDateString()
                      : <span className="text-[#6b7280]">Not specified</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Materials Needed */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuListChecks className="w-3.5 h-3.5" />
                Materials Needed
              </label>
              {isEditing ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={materialsInput}
                      onChange={(e) => setMaterialsInput(e.target.value)}
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
                  <div className="flex flex-wrap gap-2">
                    {materialsNeeded.map((material, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border"
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
              ) : (
                <div>
                  {savedApplication.materialsNeeded &&
                  savedApplication.materialsNeeded.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {savedApplication.materialsNeeded.map((material, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border"
                          style={{
                            background: "rgba(236,72,153,0.08)",
                            color: "#e8eaed",
                            borderColor: "rgba(236,72,153,0.2)",
                          }}
                        >
                          {material}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#6b7280] text-sm">Not specified</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
            {!isEditing ? (
              <>
                <button
                  onClick={handleDeleteSavedApplication}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                  style={{
                    background: "rgba(248,113,113,0.15)",
                    border: "1px solid rgba(248,113,113,0.3)",
                    color: "#f87171",
                  }}
                >
                  <LuTrash2 className="w-4 h-4" />
                  Delete
                </button>
                <div className="flex-1" />
                <button
                  onClick={handleEditApplication}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                    boxShadow: "0 4px 14px rgba(236,72,153,0.25)",
                  }}
                >
                  <LuPencil className="w-4 h-4" />
                  Edit Application
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={resetStates}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                  style={{ background: "#141920", border: "1px solid #2d3748" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={!isValidLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isValidLink
                      ? "linear-gradient(135deg, #10b981, #34d399)"
                      : "#2d3748",
                    boxShadow: isValidLink
                      ? "0 4px 14px rgba(16,185,129,0.25)"
                      : "none",
                  }}
                >
                  <LuSave className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
      <Dialog
        isDialogOpen={isDialogOpen}
        onConfirm={() => {
          onDialogConfirm();
          setIsDialogOpen(false);
        }}
        onDialogClose={() => setIsDialogOpen(false)}
        text={dialogText}
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default SavedApplicationModal;