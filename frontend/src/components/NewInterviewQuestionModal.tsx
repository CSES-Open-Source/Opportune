import { Toast } from "primereact/toast";
import Modal from "./Modal";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { Company } from "../types/Company";
import { CreateInterviewQuestionRequest } from "../types/InterviewQuestion";
import { createInterviewQuestion } from "../api/interviewQuestions";

interface NewInterviewQuestionModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onNewInterviewQuestion: () => void;
}

const NewInterviewQuestionModal = ({
  company,
  isOpen,
  onClose,
  onNewInterviewQuestion,
}: NewInterviewQuestionModalProps) => {
  const { user } = useAuth();

  const toast = useRef<Toast>(null);

  const [question, setQuestion] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(question !== "");
  }, [question]);

  const onSave = () => {
    if (user) {
      const newInterviewQuestion: CreateInterviewQuestionRequest = {
        company,
        user: user._id,
        question,
        date,
      };

      createInterviewQuestion(newInterviewQuestion)
        .then((response) => {
          if (response.success) {
            onNewInterviewQuestion();
            resetStates();
            onClose();

            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Interview question was added successfully",
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to create interview question: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              "Failed to create interview question: " +
              (error as Error).message,
          });
        });
    }
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const resetStates = () => {
    setQuestion("");
    setDate(undefined);
    setIsValid(false);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[60vh] rounded-xl flex flex-col px-10 py-8"
        useOverlay
      >
        <h1 className="text-2xl font-bold mb-6">Add Interview Question</h1>

        {/* Question field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Add question"
            className={`w-full p-2 border-2 rounded-md ${
              question !== ""
                ? "focus:outline-blue-600"
                : "outline-red-600 border-red-600"
            }`}
          />
        </div>

        {/* Date field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date (Optional)
          </label>
          <input
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(event) =>
              setDate(
                event.target.value ? new Date(event.target.value) : undefined,
              )
            }
            className="w-full p-2 border-2 rounded-md focus:outline-blue-600"
          />
          <p className="text-gray-500 text-xs mt-1">
            When did you encounter this question?
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

export default NewInterviewQuestionModal;
