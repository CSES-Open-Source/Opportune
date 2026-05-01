import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Tip } from "../../types/Tip";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import { deleteTip, updateTip } from "../../api/tips";
import Dialog from "../public/Dialog";
import { parseErrorResponse } from "../../utils/errorHandler";
import { LuLightbulb, LuPencil, LuTrash2, LuSave } from "react-icons/lu";

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
            detail: "Failed to delete tip: " + parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete tip: " + parseErrorResponse(error),
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
            detail: "Failed to update tip: " + parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update tip: " + parseErrorResponse(error),
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
      <style>{`
        .p-editor-container {
          background-color: #141920 !important;
          border-radius: 12px !important;
        }
        .p-editor-toolbar {
          background-color: #1a1f2e !important;
          border: none !important;
          border-bottom: 1px solid #2d3748 !important;
          border-radius: 12px 12px 0 0 !important;
        }
        .p-editor-content {
          background-color: #141920 !important;
          border: none !important;
        }
        .p-editor-content .ql-editor {
          color: #e8eaed !important;
          min-height: 200px !important;
        }
        .p-editor-content .ql-editor.ql-blank::before {
          color: #6b7280 !important;
        }
        .ql-toolbar button {
          color: #9ca3af !important;
        }
        .ql-toolbar button:hover {
          color: #e8eaed !important;
        }
        .ql-toolbar button.ql-active {
          color: #7c3aed !important;
        }
        .ql-stroke {
          stroke: #9ca3af !important;
        }
        .ql-fill {
          fill: #9ca3af !important;
        }
        .ql-toolbar button:hover .ql-stroke {
          stroke: #e8eaed !important;
        }
        .ql-toolbar button:hover .ql-fill {
          fill: #e8eaed !important;
        }
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #7c3aed !important;
        }
        .ql-toolbar button.ql-active .ql-fill {
          fill: #7c3aed !important;
        }
        .ql-editor.ql-blank::before {
          font-style: normal !important;
        }
      `}</style>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[70vh] rounded-2xl flex flex-col overflow-hidden bg-[#1e2433] border border-[#2d3748]"
        useOverlay
      >
        {/* Purple gradient top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />

        <div className="px-10 py-8">
          {isEditing ? (
            // Edit mode
            <div className="flex flex-col">
              {/* Icon badge header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl flex items-center justify-center" 
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
                  <LuLightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#e8eaed]">Edit Tip</h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Tip Content <span className="text-red-400">*</span>
                </label>
                <div
                  className={`rounded-xl border-2 transition-all ${
                    !isValid ? "border-red-500" : "border-[#2d3748]"
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

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-xl font-semibold text-[#9ca3af] bg-[#141920] border border-[#2d3748] hover:border-[#6b7280] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all ${
                    isValid
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-lg hover:shadow-[#7c3aed]/30"
                      : "bg-[#2d3748] text-[#6b7280] cursor-not-allowed"
                  }`}
                  disabled={!isValid}
                >
                  <LuSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-[#e8eaed] mb-6">Company Tip</h2>

              <div className="mb-6 rounded-xl p-4 bg-[#141920] border border-[#2d3748]">
                <Editor
                  readOnly={true}
                  showHeader={false}
                  value={tip.text}
                  style={{ height: "200px" }}
                  theme="bubble"
                />
              </div>

              <div className="pt-6 border-t border-[#2d3748]">
                <p className="text-[#6b7280] text-sm mb-3">Added by:</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#141920] border border-[#2d3748]">
                    <img
                      src={tip.user.profilePicture}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#e8eaed]">{tip.user.name}</p>
                    <p className="text-[#6b7280] text-sm">{tip.user.email}</p>
                  </div>
                </div>
              </div>

              {user?._id === tip.user._id && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#2d3748]">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] hover:shadow-lg hover:shadow-[#5b8ef4]/30 transition-all"
                  >
                    <LuPencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f87171] to-[#ef4444] hover:shadow-lg hover:shadow-[#f87171]/30 transition-all"
                  >
                    <LuTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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