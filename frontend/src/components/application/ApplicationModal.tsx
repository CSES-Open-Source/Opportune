import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  Application,
  ApplicationProcess,
  Status,
  UpdateApplicationRequest,
} from "../../types/Application";
import Modal from "../public/Modal";
import { Timeline } from "primereact/timeline";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { deleteApplication, updateApplication } from "../../api/applications";
import { Toast } from "primereact/toast";
import { statusColors } from "../../constants/statusColors";
import Dialog from "../public/Dialog";
import {
  getEmployeesLabel,
  getIndustryLabel,
} from "../../utils/valuesToLabels";
import {
  LuLayers, LuUsers, LuPencil, LuTrash2, LuSave, LuX, LuLink, LuPlus,
} from "react-icons/lu";
import { parseErrorResponse } from "../../utils/errorHandler";


const defaultLogo = "/assets/defaultLogo.png";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  setApplication: Dispatch<SetStateAction<Application>>;
  onSaveApplication: () => void;
}

const statusOptions = Object.entries(Status).map(([key, value]) => ({
  label: key,
  value: value as Status,
}));

const ApplicationModal = ({
  isOpen,
  onClose,
  application,
  setApplication,
  onSaveApplication,
}: ApplicationModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationProcess>({
    status: Status.Applied,
    date: new Date(),
    note: "",
  });
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(null);
  const [updatedApplication, setUpdatedApplication] =
    useState<UpdateApplicationRequest>({ process: [] });
  const [isValidLink, setIsValidLink] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [onDialogConfirm, setOnDialogConfirm] = useState<() => void>(() => {});

  const toast = useRef<Toast>(null);

  const resetStates = () => {
    setIsEditing(false);
    setIsAddingStatus(false);
    setEditingStatusIndex(null);
    setUpdatedApplication({ process: [] });
    setDialogText("");
    setOnDialogConfirm(() => {});
  };

  const onSave = (id: string, updatedApplication: UpdateApplicationRequest) => {
    updateApplication(id, updatedApplication)
      .then((response) => {
        if (response.success) {
          resetStates();
          setApplication(response.data);
          onSaveApplication();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Application updated successfully",
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

  const onDelete = (applicationId: string) => {
    deleteApplication(applicationId)
      .then((response) => {
        if (response.success) {
          resetStates();
          onSaveApplication();
          onClose();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Application deleted successfully",
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

  const handleDeleteApplication = () => {
    setIsDialogOpen(true);
    setDialogText("Are you sure you want to delete this application?");
    setOnDialogConfirm(() => () => onDelete(application._id));
  };

  const handleEditApplication = () => {
    setUpdatedApplication({
      position: application.position,
      link: application.link,
      location: application.location,
      process: [...(application.process || [])],
    });
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    onSave(application._id, updatedApplication);
    setIsEditing(false);
  };

  const handleAddStatus = () => {
    if (newStatus.status && newStatus.date) {
      onSave(application._id, {
        process: [
          ...(application.process || []),
          {
            status: newStatus.status,
            date: newStatus.date,
            note: newStatus.note,
          },
        ],
      });
      setNewStatus({
        status: Status.Applied,
        date: new Date(),
        note: "",
      });
      setIsAddingStatus(false);
    }
  };

  const handleUpdateStatus = (index: number) => {
    if (updatedApplication.process && updatedApplication.process[index]) {
      onSave(application._id, updatedApplication);
      setEditingStatusIndex(null);
    }
  };

  const handleDeleteStatus = (index: number) => {
    setUpdatedApplication({
      process: [...(application.process || [])],
    });
    setIsDialogOpen(true);
    setDialogText("Are you sure you want to delete this status?");
    setOnDialogConfirm(
      () => () =>
        onSave(application._id, {
          process: updatedApplication.process?.splice(index, 1),
        }),
    );
  };

  const onLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setUpdatedApplication((prev) => ({
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

  const customizedMarker = (item: ApplicationProcess) => {
    const getStatusColor = (status: Status) => {
      return statusColors[status];
    };

    return (
      <span
        className={`flex w-3 h-3 rounded-full ${getStatusColor(item.status)}`}
      ></span>
    );
  };

  const timelineContent = (item: ApplicationProcess, index: number) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString();
    const statusLabel =
      statusOptions.find((opt) => opt.value === item.status)?.label ||
      item.status;

    return (
      <div className="flex flex-col mb-2 group">
        {editingStatusIndex === index ? (
          <div
            className="flex flex-col gap-3 mb-4 p-4 rounded-lg border"
            style={{
              background: "rgba(91,142,244,0.08)",
              borderColor: "rgba(91,142,244,0.25)",
            }}
          >
            <Dropdown
              value={updatedApplication.process?.[index].status}
              options={statusOptions}
              onChange={(e) => {
                setUpdatedApplication((prev) => {
                  const updatedProcess = [...(prev.process || [])];
                  updatedProcess[index] = {
                    ...updatedProcess[index],
                    status: e.value,
                  };
                  return { ...prev, process: updatedProcess };
                });
              }}
              placeholder="Select Status"
              className="w-full"
            />
            <Calendar
              value={new Date(updatedApplication.process?.[index].date || "")}
              onChange={(e) => {
                if (e.value) {
                  setUpdatedApplication((prev) => {
                    const updatedProcess = [...(prev.process || [])];
                    updatedProcess[index] = {
                      ...updatedProcess[index],
                      date: e.value as Date,
                    };
                    return { ...prev, process: updatedProcess };
                  });
                }
              }}
              className="w-full"
              inputClassName="p-2"
            />
            <input
              value={updatedApplication.process?.[index].note || ""}
              onChange={(e) => {
                setUpdatedApplication((prev) => {
                  const updatedProcess = [...(prev.process || [])];
                  updatedProcess[index] = {
                    ...updatedProcess[index],
                    note: e.target.value,
                  };
                  return { ...prev, process: updatedProcess };
                });
              }}
              placeholder="Add notes"
              className="w-full p-2 rounded-md text-[#e8eaed] outline-none"
              style={{
                background: "#141920",
                border: "1px solid #2d3748",
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                style={{ background: "#141920", border: "1px solid #2d3748" }}
                onClick={() => resetStates()}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                }}
                onClick={() => handleUpdateStatus(index)}
              >
                <LuSave className="w-4 h-4 inline mr-1" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#e8eaed]">{statusLabel}</span>
                <p className="text-sm text-[#6b7280]">{formattedDate}</p>
              </div>
              {!isEditing && !isAddingStatus && (
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => {
                      setUpdatedApplication({
                        process: [...(application.process || [])],
                      });
                      setEditingStatusIndex(index);
                    }}
                    className="p-1.5 rounded-lg text-[#5b8ef4] hover:bg-[#141920] transition-all"
                  >
                    <LuPencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStatus(index)}
                    className="p-1.5 rounded-lg text-[#f87171] hover:bg-[#141920] transition-all"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              )}
            </div>
            {item.note && <p className="text-sm mt-1 text-[#9ca3af]">{item.note}</p>}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsEditing(false);
          setIsAddingStatus(false);
          setEditingStatusIndex(null);
          setUpdatedApplication({ process: [] });
          onClose();
        }}
        className="w-full max-w-2xl h-[80%] rounded-2xl flex flex-col p-0 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          border: "1px solid #2d3748",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #5b8ef4, #7c3aed)" }} />

        <div className="p-6 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#e8eaed]">Application Details</h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setIsAddingStatus(false);
                setEditingStatusIndex(null);
                setUpdatedApplication({ process: [] });
                onClose();
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Company info */}
          <div className="flex gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center border flex-shrink-0"
              style={{
                background: "#141920",
                borderColor: "rgba(91,142,244,0.3)",
              }}
            >
              <img
                src={application.company.logo || defaultLogo}
                alt={application.company.name}
                className="w-10 h-10 object-contain rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#e8eaed] mb-1">
                {application.company.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b7280]">
                {application.company.industry && (
                  <div className="flex items-center gap-1.5">
                    <LuLayers className="w-3.5 h-3.5" />
                    <span>{getIndustryLabel(application.company.industry)}</span>
                  </div>
                )}
                {application.company.employees && (
                  <div className="flex items-center gap-1.5">
                    <LuUsers className="w-3.5 h-3.5" />
                    <span>{getEmployeesLabel(application.company.employees)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                Position
              </label>
              {isEditing ? (
                <input
                  value={updatedApplication.position}
                  onChange={(e) =>
                    setUpdatedApplication((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
                />
              ) : (
                <p className="text-[#e8eaed]">{application.position}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                Location
              </label>
              {isEditing ? (
                <input
                  value={updatedApplication.location || ""}
                  onChange={(e) =>
                    setUpdatedApplication((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
                />
              ) : (
                <p className="text-[#e8eaed]">{application.location || "Not specified"}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                Job Link
              </label>
              {isEditing ? (
                <input
                  value={updatedApplication.link || ""}
                  onChange={onLinkChange}
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                  style={{
                    background: "#141920",
                    border: isValidLink ? "1px solid #2d3748" : "1px solid #f87171",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = isValidLink ? "#5b8ef4" : "#f87171"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = isValidLink ? "#2d3748" : "#f87171"}
                />
              ) : (
                <div>
                  {application.link ? (
                    <a
                      href={application.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#5b8ef4] hover:text-[#7c3aed] transition-colors"
                    >
                      <LuLink className="w-4 h-4" />
                      View Job Posting
                    </a>
                  ) : (
                    <p className="text-[#6b7280]">Not specified</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#e8eaed]">Application Timeline</h3>
              {!isEditing && editingStatusIndex === null && (
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                  }}
                  disabled={isAddingStatus}
                  onClick={() => setIsAddingStatus(true)}
                >
                  <LuPlus className="w-4 h-4" />
                  Add Status
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto pr-2">
              {isAddingStatus && (
                <div
                  className="p-4 rounded-lg mb-4 border"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    borderColor: "rgba(16,185,129,0.25)",
                  }}
                >
                  <h4 className="font-semibold text-[#e8eaed] mb-3">Add New Status</h4>
                  <div className="flex flex-col gap-3 mb-3">
                    <Dropdown
                      value={newStatus.status}
                      options={statusOptions}
                      onChange={(e) =>
                        setNewStatus({ ...newStatus, status: e.value })
                      }
                      placeholder="Select Status"
                      className="w-full"
                    />
                    <Calendar
                      value={new Date(newStatus.date)}
                      onChange={(e) =>
                        setNewStatus({ ...newStatus, date: e.value as Date })
                      }
                      placeholder="Select Date"
                      className="w-full"
                      inputClassName="p-2"
                    />
                    <input
                      value={newStatus.note}
                      onChange={(e) =>
                        setNewStatus({ ...newStatus, note: e.target.value })
                      }
                      placeholder="Add notes (optional)"
                      className="w-full p-2 rounded-lg text-[#e8eaed] outline-none"
                      style={{
                        background: "#141920",
                        border: "1px solid #2d3748",
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                      style={{ background: "#141920", border: "1px solid #2d3748" }}
                      onClick={() => resetStates()}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #10b981, #34d399)",
                        boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                      }}
                      onClick={handleAddStatus}
                      disabled={!newStatus.status || !newStatus.date}
                    >
                      <LuPlus className="w-4 h-4 inline mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              )}

              {application.process && application.process.length > 0 ? (
                <Timeline
                  value={application.process}
                  content={timelineContent}
                  marker={customizedMarker}
                  className="custom-timeline"
                />
              ) : (
                <p className="text-[#6b7280] italic text-center py-8">
                  No status updates yet. Add your first status update.
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
                onClick={handleDeleteApplication}
                disabled={isAddingStatus || editingStatusIndex !== null}
              >
                <LuTrash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                  boxShadow: "0 4px 14px rgba(91,142,244,0.25)",
                }}
                onClick={handleEditApplication}
                disabled={isAddingStatus || editingStatusIndex !== null}
              >
                <LuPencil className="w-4 h-4" />
                Edit Application
              </button>
            </div>
          )}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
              <button
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                style={{ background: "#141920", border: "1px solid #2d3748" }}
                onClick={() => resetStates()}
              >
                Cancel
              </button>
              <button
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
                }}
                onClick={handleSaveChanges}
                disabled={!isValidLink}
              >
                <LuSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
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

export default ApplicationModal;