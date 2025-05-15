import { Toast } from "primereact/toast";
import { Editor } from "primereact/editor";
import Modal from "./Modal";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { Company } from "../types/Company";
import { createTip } from "../api/tips";
import { CreateTipRequest } from "../types/Tip";

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
              detail: "Failed to create tip: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to create tip: " + (error as Error).message,
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
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[70vh] rounded-xl flex flex-col px-10 py-8"
        useOverlay
      >
        <h1 className="text-2xl font-bold mb-6">Add Tip</h1>

        {/* Rich Text Editor for tip content */}
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
              value={text}
              onTextChange={(e) => setText(e.htmlValue || "")}
              style={{ height: "250px" }}
              placeholder="Share your tip here..."
              headerTemplate={editorHeader}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Add interview tips, preparation advice, or company-specific
            information
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 w-20 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 w-24 text-white rounded-md ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
            onClick={onSave}
            disabled={!isValid}
          >
            Save
          </button>
        </div>
      </Modal>
      <Toast ref={toast} />
    </div>
  );
};

export default NewTipModal;
