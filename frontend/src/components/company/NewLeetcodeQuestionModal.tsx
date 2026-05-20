import { Toast } from "primereact/toast";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { useEffect, useRef, useState } from "react";
import { Company } from "../../types/Company";
import {
  CreateLeetcodeQuestionRequest,
  Difficulty,
} from "../../types/LeetcodeQuestion";
import { createLeetcodeQuestion } from "../../api/leetcodeQuestions";
import { getDifficultyLabel } from "../../utils/valuesToLabels";
import { parseErrorResponse } from "../../utils/errorHandler";
import { LuCode, LuSave } from "react-icons/lu";

interface NewLeetcodeQuestionModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onNewLeetcodeQuestion: () => void;
}

const NewLeetcodeQuestionModal = ({
  company,
  isOpen,
  onClose,
  onNewLeetcodeQuestion,
}: NewLeetcodeQuestionModalProps) => {
  const { user } = useAuth();

  const toast = useRef<Toast>(null);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );
  const [url, setUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(false);

  useEffect(() => {
    setIsValid(
      title !== "" && url !== "" && isUrlValid && difficulty !== undefined,
    );
  }, [title, url, difficulty, isUrlValid]);

  const onSave = () => {
    if (user) {
      const newLeetcodeQuestion: CreateLeetcodeQuestionRequest = {
        company,
        user: user._id,
        title,
        difficulty: difficulty || Difficulty.Easy,
        url,
        date,
      };

      createLeetcodeQuestion(newLeetcodeQuestion)
        .then((response) => {
          if (response.success) {
            onNewLeetcodeQuestion();
            resetStates();
            onClose();

            toast.current?.show({
              severity: "success",
              summary: "Success",
              detail: "Leetcode question was added successfully",
            });
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to add leetcode question: " + parseErrorResponse(response.error),
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to add leetcode question: " + parseErrorResponse(error),
          });
        });
    }
  };

  const onLinkChange = (link: string) => {
    try {
      new URL(link);
      setIsUrlValid(true);
    } catch {
      setIsUrlValid(false);
    }
    setUrl(link);
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const resetStates = () => {
    setTitle("");
    setUrl("");
    setDate(undefined);
    setDifficulty(undefined);
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
        {/* Green gradient top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }} />

        <div className="px-10 py-8">
          {/* Icon badge header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl flex items-center justify-center" 
              style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }}>
              <LuCode className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#e8eaed]">Add LeetCode Question</h1>
          </div>

          {/* Title field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add question title"
              className={`w-full px-3 py-2.5 bg-[#141920] border-2 rounded-xl text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                title === "" && isValid === false
                  ? "border-red-500 focus:border-red-400"
                  : "border-[#2d3748] focus:border-[#10b981]"
              } focus:outline-none`}
            />
            {title === "" && isValid === false && (
              <p className="text-red-400 text-xs mt-1">Title is required</p>
            )}
          </div>

          {/* Difficulty selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Difficulty <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {Object.values(Difficulty).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    difficulty === level
                      ? level === Difficulty.Easy
                        ? "bg-[#10b981] text-white shadow-lg"
                        : level === Difficulty.Medium
                        ? "bg-[#f59e0b] text-white shadow-lg"
                        : "bg-[#f87171] text-white shadow-lg"
                      : "bg-[#141920] text-[#9ca3af] border border-[#2d3748] hover:border-[#10b981]"
                  }`}
                  onClick={() => setDifficulty(level)}
                >
                  {getDifficultyLabel(level)}
                </button>
              ))}
            </div>
          </div>

          {/* URL field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">
              Link <span className="text-red-400">*</span>
            </label>
            <input
              value={url}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="Add link to question here"
              className={`w-full px-3 py-2.5 bg-[#141920] border-2 rounded-xl text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                url !== "" && !isUrlValid
                  ? "border-red-500 focus:border-red-400"
                  : "border-[#2d3748] focus:border-[#10b981]"
              } focus:outline-none`}
            />
            {url !== "" && !isUrlValid && (
              <p className="text-red-400 text-xs mt-1">Please enter a valid URL</p>
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
              className="w-full px-3 py-2.5 bg-[#141920] border-2 border-[#2d3748] rounded-xl text-[#e8eaed] focus:border-[#10b981] focus:outline-none transition-all"
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
                  ? "bg-gradient-to-r from-[#10b981] to-[#34d399] hover:shadow-lg hover:shadow-[#10b981]/30"
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

export default NewLeetcodeQuestionModal;