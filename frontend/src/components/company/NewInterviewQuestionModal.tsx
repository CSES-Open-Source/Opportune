import { Toast } from "primereact/toast";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { Company } from "../../types/Company";
import { CreateInterviewQuestionRequest } from "../../types/InterviewQuestion";
import { createInterviewQuestion } from "../../api/interviewQuestions";
import { parseErrorResponse } from "../../utils/errorHandler";
import { LuMessageSquare, LuSave } from "react-icons/lu";

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
              detail: "Failed to add interview question: " + parseErrorResponse(response.error),
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add interview question: " + parseErrorResponse(error),
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
        className="w-[60vh] rounded-2xl flex flex-col overflow-hidden bg-[#1e2433] border border-[#2d3748]"
        useOverlay
      >
        {/* Orange gradient top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />

        <div className="px-10 py-8">
          {/* Icon badge header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl flex items-center justify-center" 
              style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 4px 15px rgba(245,158,11,0.3)" }}>
              <LuMessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e8eaed]">Add Interview Question</h1>
          </div>

          {/* Question field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Question <span className="text-red-400">*</span>
            </label>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Add question"
              rows={4}
              className={`w-full px-3 py-2.5 bg-[#141920] border-2 rounded-xl text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none ${
                question === "" && isValid === false
                  ? "border-red-500 focus:border-red-400"
                  : "border-[#2d3748] focus:border-[#f59e0b]"
              } focus:outline-none`}
            />
            {question === "" && isValid === false && (
              <p className="text-red-400 text-xs mt-1">Question is required</p>
            )}
          </div>

          {/* Date field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
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
              className="w-full px-3 py-2.5 bg-[#141920] border-2 border-[#2d3748] rounded-xl text-[#e8eaed] focus:border-[#f59e0b] focus:outline-none transition-all"
            />
            <p className="text-[#6b7280] text-xs mt-2">
              When did you encounter this question?
            </p>
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
                  ? "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:shadow-lg hover:shadow-[#f59e0b]/30"
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

export default NewInterviewQuestionModal;