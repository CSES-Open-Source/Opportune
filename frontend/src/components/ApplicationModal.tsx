import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  Application,
  ApplicationProcess,
  Status,
  UpdateApplicationRequest,
} from "../types/Application";
import Modal from "./Modal";
import { Timeline } from "primereact/timeline";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog } from "primereact/confirmdialog";
import { deleteApplication, updateApplication } from "../api/applications";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Toast } from "primereact/toast";
import { statusColors } from "../constants/statusColors";
import Dialog from "./Dialog";
import { getEmployeesLabel, getIndustryLabel } from "../utils/valuesToLabels";
import { LuLayers, LuUsers } from "react-icons/lu";

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
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(
    null,
  );
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
            detail: "Failed to update application: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update application: " + (error as Error).message,
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
            detail: "Failed to delete application: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete application: " + (error as Error).message,
        });
      });
  };

  const handleDeleteApplication = () => {
    // confirmDialog({
    //   message:
    //     "Are you sure you want to delete this application? This action cannot be undone.",
    //   header: "Delete Confirmation",
    //   icon: "pi pi-exclamation-triangle",
    //   acceptClassName: "p-button-danger",
    //   accept: () => onDelete(application._id),
    // });

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
          <div className="flex flex-col gap-3 mb-4 p-4 rounded-lg bg-gray-50">
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
              className="w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-ring"
            />
            <div className="flex justify-end gap-4">
              <button
                className="border rounded-lg p-1 w-20 flex flex-col items-center justify-center transition-all bg-white hover:bg-gray-50"
                onClick={() => resetStates()}
              >
                Cancel
              </button>
              <button
                className="w-20 rounded-lg p-1 flex flex-col items-center justify-center transition-all bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleUpdateStatus(index)}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">{statusLabel}</span>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
              {!isEditing && !isAddingStatus && (
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    className=""
                    onClick={() => {
                      setUpdatedApplication({
                        process: [...(application.process || [])],
                      });
                      setEditingStatusIndex(index);
                    }}
                  >
                    <FiEdit
                      size={20}
                      className="hover:text-blue-600 transition-all"
                    />
                  </button>
                  <button
                    className=""
                    onClick={() => handleDeleteStatus(index)}
                  >
                    <FiTrash
                      size={20}
                      className="hover:text-red-600 transition-all"
                    />
                  </button>
                </div>
              )}
            </div>
            {item.note && <p className="text-sm mt-1">{item.note}</p>}
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
        className="w-full max-w-2xl h-[80%] rounded-xl flex flex-col p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Application Details</h2>
        </div>

        <div className="flex mb-6">
          <img
            src={application.company.logo || defaultLogo}
            alt={application.company.name}
            className="w-16 h-16 mr-4 rounded-md object-contain"
          />

          <div>
            <h3 className="text-xl font-semibold">
              {application.company.name}
            </h3>
            {application.company.industry && (
              <div className="flex flex-row gap-1 items-center">
                <p className="text-gray-600">
                  <LuLayers className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  {getIndustryLabel(application.company.industry)}
                </p>
              </div>
            )}
            {application.company.employees && (
              <div className="flex flex-row gap-1 items-center">
                <LuUsers className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  {getEmployeesLabel(application.company.employees)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
              />
            ) : (
              <p>{application.position}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
              />
            ) : (
              <p>{application.location || "Not specified"}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Link
            </label>
            {isEditing ? (
              <input
                value={updatedApplication.link || ""}
                onChange={onLinkChange}
                className={`w-full p-2 border-2 rounded-md ${
                  isValidLink
                    ? "focus:outline-blue-600"
                    : "outline-red-600 border-red-600"
                }`}
              />
            ) : (
              <p>
                {application.link ? (
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Job Posting
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col mb-6 h-[70%] overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Application Timeline</h3>
            {!isEditing && editingStatusIndex === null && (
              <button
                className={`rounded-lg px-3 py-1 flex flex-col items-center justify-center transition-all bg-green-600 text-white ${
                  isAddingStatus ? "bg-opacity-50" : "hover:bg-green-700"
                }`}
                disabled={isAddingStatus}
                onClick={() => setIsAddingStatus(true)}
              >
                Add Status
              </button>
            )}
          </div>

          <div className="flex-grow overflow-auto">
            {isAddingStatus && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Status</h4>
                <div className="flex flex-grow-0 flex-col gap-3 mb-3">
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
                    className="w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-ring"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    className="border rounded-lg p-1 w-20 flex flex-col items-center justify-center transition-all bg-white hover:bg-gray-50"
                    onClick={() => resetStates()}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-20 rounded-lg p-1 flex flex-col items-center justify-center transition-all bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleAddStatus}
                    disabled={!newStatus.status || !newStatus.date}
                  >
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
              <p className="text-gray-500 italic text-center py-4">
                No status updates yet. Add your first status update.
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex justify-between mt-auto">
            <button
              className={`w-[131px] rounded-lg p-2 flex flex-col items-center justify-center transition-all bg-red-600 ${
                isAddingStatus || editingStatusIndex !== null
                  ? "bg-opacity-50"
                  : "hover:bg-red-700"
              } text-white`}
              onClick={handleDeleteApplication}
              disabled={isAddingStatus || editingStatusIndex !== null}
            >
              Delete
            </button>
            <button
              className={`w-[131px] rounded-lg p-2 flex flex-col items-center justify-center transition-all bg-blue-600 ${
                isAddingStatus || editingStatusIndex !== null
                  ? "bg-opacity-50"
                  : "hover:bg-blue-700"
              } text-white`}
              onClick={handleEditApplication}
              disabled={isAddingStatus || editingStatusIndex !== null}
            >
              Edit Application
            </button>
          </div>
        )}
        {isEditing && (
          <div className="flex justify-end gap-4 mt-auto">
            <button
              className="border w-28 rounded-lg p-2 flex flex-col items-center justify-center transition-all hover:bg-gray-50"
              onClick={() => resetStates()}
            >
              Cancel
            </button>
            <button
              className={`w-[131px] rounded-lg p-2 flex flex-col items-center justify-center transition-all bg-green-600 ${
                isValidLink ? "hover:bg-green-700" : "opacity-50"
              } text-white`}
              onClick={handleSaveChanges}
              disabled={!isValidLink}
            >
              Save Changes
            </button>
          </div>
        )}
        <ConfirmDialog />
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
