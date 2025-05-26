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
              detail: "Failed to create leetcode question: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              "Failed to create leetcode question: " + (error as Error).message,
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
        className="w-[60vh] rounded-xl flex flex-col px-10 py-8"
        useOverlay
      >
        <h1 className="text-2xl font-bold mb-6">Add Leetcode Question</h1>

        {/* Title field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add question title"
            className={`w-full p-2 border-2 rounded-md ${
              title !== ""
                ? "focus:outline-blue-600"
                : "outline-red-600 border-red-600"
            }`}
          />
        </div>

        {/* Difficulty selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <div className="flex gap-4">
            {Object.values(Difficulty).map((level) => (
              <button
                key={level}
                type="button"
                className={`px-4 py-2 w-24 border rounded-md ${
                  difficulty === level
                    ? level === Difficulty.Easy
                      ? "bg-green-500 text-white"
                      : level === Difficulty.Medium
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link
          </label>
          <input
            value={url}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="Add link to question here"
            className={`w-full p-2 border-2 rounded-md ${
              url !== "" && isUrlValid
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

export default NewLeetcodeQuestionModal;
