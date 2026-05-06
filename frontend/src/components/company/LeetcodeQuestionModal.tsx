import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Difficulty,
  LeetcodeQuestion,
  UpdateLeetcodeQuestionRequest,
} from "../../types/LeetcodeQuestion";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { getDifficultyLabel } from "../../utils/valuesToLabels";
import { Toast } from "primereact/toast";
import {
  deleteLeetcodeQuestion,
  updateLeetcodeQuestion,
} from "../../api/leetcodeQuestions";
import Dialog from "../public/Dialog";
import { parseErrorResponse } from "../../utils/errorHandler";
import { LuExternalLink, LuCalendar, LuPencil, LuTrash2, LuSave, LuCode } from "react-icons/lu";

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
            detail: "Failed to delete leetcode question: " + parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update leetcode question: " + parseErrorResponse(error),
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
            detail: "Failed to update leetcode question: " + parseErrorResponse(response.error),
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update leetcode question: " + parseErrorResponse(error),
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
        return "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30";
      case "medium":
        return "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30";
      case "hard":
        return "bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/30";
      default:
        return "bg-[#6b7280]/15 text-[#6b7280] border border-[#6b7280]/30";
    }
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
          {isEditing ? (
            // Edit mode
            <div className="flex flex-col">
              {/* Icon badge header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl flex items-center justify-center" 
                  style={{ background: "linear-gradient(135deg, #10b981, #34d399)", boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }}>
                  <LuCode className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#e8eaed]">Edit LeetCode Question</h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Add question title"
                  className={`w-full px-3 py-2.5 bg-[#141920] border-2 rounded-xl text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                    newTitle === ""
                      ? "border-red-500 focus:border-red-400"
                      : "border-[#2d3748] focus:border-[#10b981]"
                  } focus:outline-none`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Link <span className="text-red-400">*</span>
                </label>
                <input
                  value={newUrl}
                  onChange={(e) => onLinkChange(e.target.value)}
                  placeholder="Add link to question here"
                  className={`w-full px-3 py-2.5 bg-[#141920] border-2 rounded-xl text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                    newUrl !== "" && !isUrlValid
                      ? "border-red-500 focus:border-red-400"
                      : "border-[#2d3748] focus:border-[#10b981]"
                  } focus:outline-none`}
                />
              </div>

              <div className="mb-6 w-full">
                <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                  Difficulty
                </label>
                <div className="flex gap-3">
                  {Object.values(Difficulty).map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                        newDifficulty === level
                          ? level === Difficulty.Easy
                            ? "bg-[#10b981] text-white shadow-lg"
                            : level === Difficulty.Medium
                            ? "bg-[#f59e0b] text-white shadow-lg"
                            : "bg-[#f87171] text-white shadow-lg"
                          : "bg-[#141920] text-[#9ca3af] border border-[#2d3748] hover:border-[#10b981]"
                      }`}
                      onClick={() => setNewDifficulty(level)}
                    >
                      {getDifficultyLabel(level)}
                    </button>
                  ))}
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
                      ? "bg-gradient-to-r from-[#10b981] to-[#34d399] hover:shadow-lg hover:shadow-[#10b981]/30"
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
              <h2 className="text-2xl font-bold text-[#e8eaed] mb-6">{leetcodeQuestion.title}</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-[#6b7280] text-sm mb-2">Difficulty</p>
                  <span className={`inline-block px-3 py-1.5 rounded-lg font-medium text-sm ${getDifficultyColor(leetcodeQuestion.difficulty)}`}>
                    {getDifficultyLabel(leetcodeQuestion.difficulty)}
                  </span>
                </div>

                <div>
                  <p className="text-[#6b7280] text-sm mb-2 flex items-center gap-1.5">
                    <LuCalendar className="w-3.5 h-3.5" />
                    Date Added
                  </p>
                  <p className="text-[#e8eaed]">
                    {leetcodeQuestion.date?.toLocaleDateString() || "Not Specified"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[#6b7280] text-sm mb-2">Link</p>
                <a
                  href={leetcodeQuestion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#10b981] hover:text-[#34d399] transition-colors break-all"
                >
                  <span>{leetcodeQuestion.url}</span>
                  <LuExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>

              <div className="pt-6 border-t border-[#2d3748]">
                <p className="text-[#6b7280] text-sm mb-3">Added by:</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#141920] border border-[#2d3748]">
                    <img
                      src={leetcodeQuestion.user.profilePicture}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#e8eaed]">{leetcodeQuestion.user.name}</p>
                    <p className="text-[#6b7280] text-sm">{leetcodeQuestion.user.email}</p>
                  </div>
                </div>
              </div>

              {user?._id === leetcodeQuestion.user._id && (
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
        text={"Are you sure you want to delete this leetcode question?"}
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default LeetcodeQuestionModal;