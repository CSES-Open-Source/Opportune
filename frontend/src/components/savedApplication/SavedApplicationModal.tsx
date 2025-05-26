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
import { LuLayers, LuUsers } from "react-icons/lu";

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
            detail: "Failed to update saved application: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Failed to update saved application: " + (error as Error).message,
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
            detail: "Failed to delete saved application: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Failed to delete saved application: " + (error as Error).message,
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
        className="w-full max-w-2xl h-auto max-h-[90vh] rounded-xl flex flex-col p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Saved Application Details</h2>
        </div>

        <div className="flex mb-6">
          <img
            src={savedApplication.company.logo || defaultLogo}
            alt={savedApplication.company.name}
            className="w-16 h-16 mr-4 rounded-md object-contain"
          />

          <div>
            <h3 className="text-xl font-semibold">
              {savedApplication.company.name}
            </h3>
            {savedApplication.company.industry && (
              <div className="flex flex-row gap-1 items-center">
                <LuLayers className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  {getIndustryLabel(savedApplication.company.industry)}
                </p>
              </div>
            )}
            {savedApplication.company.employees && (
              <div className="flex flex-row gap-1 items-center">
                <LuUsers className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">
                  {getEmployeesLabel(savedApplication.company.employees)}
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
                value={updatedSavedApplication.position || ""}
                onChange={(e) =>
                  setUpdatedSavedApplication((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
              />
            ) : (
              <p>{savedApplication.position}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
              />
            ) : (
              <p>{savedApplication.location || "Not specified"}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Link
            </label>
            {isEditing ? (
              <input
                value={updatedSavedApplication.link || ""}
                onChange={onLinkChange}
                className={`w-full p-2 border-2 rounded-md ${
                  isValidLink
                    ? "focus:outline-blue-600"
                    : "outline-red-600 border-red-600"
                }`}
              />
            ) : (
              <p>
                {savedApplication.link ? (
                  <a
                    href={savedApplication.link}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                showIcon
                inputClassName="p-2 border-2 rounded-md focus:outline-blue-600 w-full"
                className="w-full"
              />
            ) : (
              <p>
                {savedApplication.deadline
                  ? new Date(savedApplication.deadline).toLocaleDateString()
                  : "Not specified"}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Materials Needed
          </label>
          {isEditing ? (
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={materialsInput}
                  onChange={(e) => setMaterialsInput(e.target.value)}
                  placeholder="Add a material"
                  className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
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
              <div className="flex flex-wrap gap-2">
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
          ) : (
            <div>
              {savedApplication.materialsNeeded &&
              savedApplication.materialsNeeded.length > 0 ? (
                <ul className="list-disc list-inside">
                  {savedApplication.materialsNeeded.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              ) : (
                <p>Not specified</p>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex justify-between mt-auto">
            <button
              className={`w-[131px] rounded-lg p-2 flex flex-col items-center justify-center transition-all bg-red-600 ${
                isEditing ? "bg-opacity-50" : "hover:bg-red-700"
              } text-white`}
              onClick={handleDeleteSavedApplication}
              disabled={isEditing}
            >
              Delete
            </button>
            <button
              className={`w-[131px] rounded-lg p-2 flex flex-col items-center justify-center transition-all bg-blue-600 ${
                isEditing ? "bg-opacity-50" : "hover:bg-blue-700"
              } text-white`}
              onClick={handleEditApplication}
              disabled={isEditing}
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
