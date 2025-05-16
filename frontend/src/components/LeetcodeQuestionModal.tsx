import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Difficulty,
  LeetcodeQuestion,
  UpdateLeetcodeQuestionRequest,
} from "../types/LeetcodeQuestion";
import Modal from "./Modal";
import { useAuth } from "../contexts/useAuth";
import { getDifficultyLabel } from "../utils/valuesToLabels";
import { Toast } from "primereact/toast";
import {
  deleteLeetcodeQuestion,
  updateLeetcodeQuestion,
} from "../api/leetcodeQuestions";
import Dialog from "./Dialog";

interface LeetcodeQuestionModalProps {
  leetcodeQuestion: LeetcodeQuestion;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLeetcodeQuestion: () => void;
  setLeetcodeQuestion:
    | Dispatch<SetStateAction<LeetcodeQuestion>>
    | Dispatch<SetStateAction<LeetcodeQuestion | undefined>>;
}

const LeetcodeQuestionModal = ({
  leetcodeQuestion,
  isOpen,
  onClose,
  onUpdateLeetcodeQuestion,
  setLeetcodeQuestion,
}: LeetcodeQuestionModalProps) => {
  const { user } = useAuth();

  const toast = useRef<Toast>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState<string>();
  const [newUrl, setNewUrl] = useState<string>();
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>();
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [isValid, setIsValid] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsValid(
      newTitle !== "" &&
        newUrl !== "" &&
        isUrlValid &&
        newDifficulty !== undefined,
    );
  }, [newTitle, newUrl, newDifficulty, isUrlValid]);

  const resetStates = () => {
    setNewTitle("");
    setNewUrl("");
    setNewDifficulty(undefined);
    setIsUrlValid(true);
    setIsValid(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const handleEdit = () => {
    setNewTitle(leetcodeQuestion.title);
    setNewUrl(leetcodeQuestion.url);
    setNewDifficulty(leetcodeQuestion.difficulty);
    setIsUrlValid(true);
    setIsValid(true);
    setIsEditing(true);
  };

  const onDelete = () => {
    deleteLeetcodeQuestion(leetcodeQuestion._id)
      .then((response) => {
        if (response.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Leetcode question was successfully deleted",
          });

          onUpdateLeetcodeQuestion();
          resetStates();
          onClose();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete leetcode question: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Failed to update leetcode question: " + (error as Error).message,
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
    const updatedLeetcodeQuestion: UpdateLeetcodeQuestionRequest = {
      title: newTitle,
      url: newUrl,
      difficulty: newDifficulty,
    };
    updateLeetcodeQuestion(leetcodeQuestion._id, updatedLeetcodeQuestion)
      .then((response) => {
        if (response.success) {
          onUpdateLeetcodeQuestion();
          setLeetcodeQuestion(response.data);
          resetStates();

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Leetcode question was updated successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update leetcode question: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Failed to update leetcode question: " + (error as Error).message,
        });
      });
  };

  const onLinkChange = (link: string) => {
    try {
      new URL(link);
      setIsUrlValid(true);
    } catch {
      setIsUrlValid(false);
    }
    setNewUrl(link);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[60vh] rounded-xl flex flex-col px-10 py-8"
        useOverlay
      >
        {isEditing ? (
          // Edit mode
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Edit LeetCode Question</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Add question title"
                className={`w-full p-2 border-2 rounded-md ${
                  newTitle !== ""
                    ? "focus:outline-blue-600"
                    : "outline-red-600 border-red-600"
                }`}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                value={newUrl}
                onChange={(e) => onLinkChange(e.target.value)}
                placeholder="Add link to question here"
                className={`w-full p-2 border-2 rounded-md ${
                  newUrl !== "" && isUrlValid
                    ? "focus:outline-blue-600"
                    : "outline-red-600 border-red-600"
                }`}
              />
            </div>

            <div className="mb-6 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <div className="flex gap-4 w-full items-center justify-center">
                {Object.values(Difficulty).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`px-4 py-2 w-24 border rounded-md ${
                      newDifficulty === level
                        ? level === Difficulty.Easy
                          ? "bg-green-500 text-white"
                          : level === Difficulty.Medium
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setNewDifficulty(level)}
                  >
                    {getDifficultyLabel(level)}
                  </button>
                ))}
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
              <h2 className="text-2xl font-bold">{leetcodeQuestion.title}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Difficulty</p>
                <p
                  className={`inline-block border rounded px-3 ${getDifficultyColor(
                    leetcodeQuestion.difficulty,
                  )}`}
                >
                  {getDifficultyLabel(leetcodeQuestion.difficulty)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Date Added</p>
                <p>
                  {leetcodeQuestion.date?.toLocaleDateString() ||
                    "Not Specified"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Link</p>
                <a
                  href={leetcodeQuestion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate block"
                >
                  {leetcodeQuestion.url}
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-gray-500 text-sm mb-2">Added by:</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={leetcodeQuestion.user.profilePicture}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{leetcodeQuestion.user.name}</p>
                  <p className="text-gray-500 text-sm">
                    {leetcodeQuestion.user.email}
                  </p>
                </div>
              </div>
            </div>

            {user?._id === leetcodeQuestion.user._id && (
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
        text={"Are you sure you want to delete this leetcode question?"}
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default LeetcodeQuestionModal;
