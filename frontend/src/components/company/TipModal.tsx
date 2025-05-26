import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Tip } from "../../types/Tip";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import { deleteTip, updateTip } from "../../api/tips";
import Dialog from "../public/Dialog";

interface TipModalProps {
  tip: Tip;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTip: () => void;
  setTip:
    | Dispatch<SetStateAction<Tip>>
    | Dispatch<SetStateAction<Tip | undefined>>;
}

const TipModal = ({
  tip,
  isOpen,
  onClose,
  onUpdateTip,
  setTip,
}: TipModalProps) => {
  const { user } = useAuth();

  const toast = useRef<Toast>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Check if text has meaningful content (not just HTML tags or whitespace)
    const textContent = newText.replace(/<[^>]*>/g, "").trim();
    setIsValid(textContent.length > 0);
  }, [newText]);

  const resetStates = () => {
    setNewText("");
    setIsValid(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const handleEdit = () => {
    setNewText(tip.text);
    setIsValid(true);
    setIsEditing(true);
  };

  const onDelete = () => {
    deleteTip(tip._id)
      .then((response) => {
        if (response.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Tip was successfully deleted",
          });

          onUpdateTip();
          resetStates();
          onClose();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete tip: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete tip: " + (error as Error).message,
        });
      });
  };

  const handleDelete = () => {
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    resetStates();
  };

  const handleSave = () => {
    const updatedTip = {
      text: newText,
    };

    updateTip(tip._id, updatedTip)
      .then((response) => {
        if (response.success) {
          onUpdateTip();
          setTip(response.data);
          resetStates();

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Tip was updated successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update tip: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update tip: " + (error as Error).message,
        });
      });
  };

  // Editor header configuration
  const editorHeader = (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
      <button
        className="ql-list"
        value="ordered"
        aria-label="Ordered List"
      ></button>
      <button
        className="ql-list"
        value="bullet"
        aria-label="Bullet List"
      ></button>
      <button className="ql-link" aria-label="Insert Link"></button>
      <button className="ql-code-block" aria-label="Code Block"></button>
    </span>
  );

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[70vh] rounded-xl flex flex-col px-10 py-8"
        useOverlay
      >
        {isEditing ? (
          // Edit mode
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Edit Tip</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Content
              </label>
              <div
                className={`border-2 rounded-md ${
                  !isValid ? "border-red-600" : "border-gray-300"
                }`}
              >
                <Editor
                  value={newText}
                  onTextChange={(e) => setNewText(e.htmlValue || "")}
                  style={{ height: "250px" }}
                  headerTemplate={editorHeader}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-2 text-white rounded-md ${
                  isValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
                disabled={!isValid}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Company Tip</h2>
            </div>

            <div className="mb-6 border rounded-md p-4 bg-gray-50">
              <Editor
                readOnly={true}
                showHeader={false}
                value={tip.text}
                style={{ height: "200px" }}
                theme="bubble"
              />
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-gray-500 text-sm mb-2">Added by:</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={tip.user.profilePicture}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{tip.user.name}</p>
                  <p className="text-gray-500 text-sm">{tip.user.email}</p>
                </div>
              </div>
            </div>

            {user?._id === tip.user._id && (
              <div className="flex mt-4 justify-end gap-4">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
      <Dialog
        isDialogOpen={isDialogOpen}
        onConfirm={() => {
          onDelete();
          setIsDialogOpen(false);
        }}
        onDialogClose={() => setIsDialogOpen(false)}
        text={"Are you sure you want to delete this tip?"}
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default TipModal;
