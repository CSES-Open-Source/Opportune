import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { Company } from "../../types/Company";
import { createTip } from "../../api/tips";
import { CreateTipRequest } from "../../types/Tip";
import { parseErrorResponse } from "../../utils/errorHandler";
import { LuLightbulb, LuSave } from "react-icons/lu";

interface NewTipModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onNewTip: () => void;
}

const NewTipModal = ({
  company,
  isOpen,
  onClose,
  onNewTip,
}: NewTipModalProps) => {
  const { user } = useAuth();

  const toast = useRef<Toast>(null);
  const [text, setText] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Check if text has meaningful content (not just HTML tags or whitespace)
    // This regex removes HTML tags and checks if there's actual content
    const textContent = text.replace(/<[^>]*>/g, "").trim();
    setIsValid(textContent.length > 0);
  }, [text]);

  const onSave = () => {
    if (user) {
      const newTip: CreateTipRequest = {
        company,
        user: user._id,
        text,
      };

      createTip(newTip)
        .then((response) => {
          if (response.success) {
            onNewTip();
            resetStates();
            onClose();

            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Tip was added successfully",
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to add tip: " + parseErrorResponse(response.error),
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
    }
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const resetStates = () => {
    setText("");
    setIsValid(false);
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
          min-height: 250px !important;
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
          {/* Icon badge header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl flex items-center justify-center" 
              style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
              <LuLightbulb className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e8eaed]">Add Tip</h1>
          </div>

          {/* Rich Text Editor for tip content */}
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
                value={text}
                onTextChange={(e) => setText(e.htmlValue || "")}
                style={{ height: "250px" }}
                placeholder="Share your tip here..."
                headerTemplate={editorHeader}
              />
            </div>
            <p className="text-[#6b7280] text-xs mt-2">
              Add interview tips, preparation advice, or company-specific information
            </p>
            {!isValid && text !== "" && (
              <p className="text-red-400 text-xs mt-1">Tip content is required</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-6 py-2.5 rounded-xl font-semibold text-[#9ca3af] bg-[#141920] border border-[#2d3748] hover:border-[#6b7280] transition-all"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all ${
                isValid
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] hover:shadow-lg hover:shadow-[#7c3aed]/30"
                  : "bg-[#2d3748] text-[#6b7280] cursor-not-allowed"
              }`}
              onClick={onSave}
              disabled={!isValid}
            >
              <LuSave className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </Modal>
      <Toast ref={toast} />
    </div>
  );
};

export default NewTipModal;