import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  InterviewQuestion,
  UpdateInterviewQuestionRequest,
} from "../../types/InterviewQuestion";
import Modal from "../public/Modal";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import {
  deleteInterviewQuestion,
  updateInterviewQuestion,
} from "../../api/interviewQuestions";
import Dialog from "../public/Dialog";
import {
  LuMessageSquare,
  LuPencil,
  LuTrash2,
  LuCalendar,
  LuX,
  LuCheck,
  LuUser,
} from "react-icons/lu";

interface InterviewQuestionModalProps {
  interviewQuestion: InterviewQuestion;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInterviewQuestion: () => void;
  setInterviewQuestion:
    | Dispatch<SetStateAction<InterviewQuestion>>
    | Dispatch<SetStateAction<InterviewQuestion | undefined>>;
}

const InterviewQuestionModal = ({
  interviewQuestion,
  isOpen,
  onClose,
  onUpdateInterviewQuestion,
  setInterviewQuestion,
}: InterviewQuestionModalProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState<string>();
  const [isValid, setIsValid] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsValid(newQuestion !== "");
  }, [newQuestion]);

  const resetStates = () => {
    setNewQuestion("");
    setIsValid(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    resetStates();
    onClose();
  };

  const handleEdit = () => {
    setNewQuestion(interviewQuestion.question);
    setIsValid(true);
    setIsEditing(true);
  };

  const onDelete = () => {
    deleteInterviewQuestion(interviewQuestion._id)
      .then((response) => {
        if (response.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Interview question deleted successfully",
          });
          onUpdateInterviewQuestion();
          resetStates();
          onClose();
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to delete interview question: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete: " + (error as Error).message,
        });
      });
  };

  const handleSave = () => {
    const updatedInterviewQuestion: UpdateInterviewQuestionRequest = {
      question: newQuestion,
    };
    updateInterviewQuestion(interviewQuestion._id, updatedInterviewQuestion)
      .then((response) => {
        if (response.success) {
          onUpdateInterviewQuestion();
          setInterviewQuestion(response.data);
          resetStates();
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Interview question updated successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to update: " + (error as Error).message,
        });
      });
  };

  const isOwner = user?._id === interviewQuestion.user._id;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .iq-fade { animation: iqFade 0.22s ease-out both; }
        @keyframes iqFade { from{opacity:0;transform:translateY(6px);} to{opacity:1;transform:translateY(0);} }
        .iq-textarea {
          background: #141920;
          border: 1.5px solid #2d3748;
          color: #e8eaed;
          resize: vertical;
          min-height: 110px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .iq-textarea::placeholder { color: #4b5563; }
        .iq-textarea:focus { outline: none; border-color: #5b8ef4; box-shadow: 0 0 0 3px rgba(91,142,244,0.12); }
        .iq-textarea.invalid { border-color: #f87171; }
      `}} />

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className="w-[60vh] rounded-2xl flex flex-col overflow-hidden p-0"
        useOverlay
      >
        <div style={{ background: "linear-gradient(145deg, #1e2433, #1a1f2e)" }} className="flex flex-col rounded-2xl overflow-hidden">

          {/* Gradient top bar */}
          <div className="h-1 flex-shrink-0" style={{ background: "linear-gradient(90deg, #5b8ef4, #7c3aed)" }} />

          <div className="px-8 py-7 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: "rgba(91,142,244,0.12)", border: "1px solid rgba(91,142,244,0.25)" }}>
                  <LuMessageSquare className="w-4 h-4 text-[#5b8ef4]" />
                </div>
                <h2 className="text-xl font-bold text-[#e8eaed]">
                  {isEditing ? "Edit Question" : "Interview Question"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] transition-all"
                style={{ background: "#141920", border: "1px solid #2d3748" }}
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(91,142,244,0.35), rgba(124,58,237,0.2), transparent)" }} />

            {isEditing ? (
              /* ── Edit Mode ── */
              <div className="flex flex-col gap-4 iq-fade">
                <div>
                  <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                    Question
                  </label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter your interview question..."
                    className={`iq-textarea w-full rounded-xl px-4 py-3 text-sm ${newQuestion === "" ? "invalid" : ""}`}
                  />
                  {newQuestion === "" && (
                    <p className="text-xs text-[#f87171] mt-1.5">Question cannot be empty</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetStates}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                    style={{ background: "#141920", border: "1px solid #2d3748" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!isValid}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{
                      background: isValid ? "linear-gradient(135deg, #5b8ef4, #7c3aed)" : "rgba(91,142,244,0.25)",
                      boxShadow: isValid ? "0 4px 15px rgba(91,142,244,0.25)" : "none",
                      cursor: isValid ? "pointer" : "not-allowed",
                    }}
                  >
                    <LuCheck className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <div className="flex flex-col gap-4 iq-fade">

                {/* Question card */}
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "linear-gradient(135deg, rgba(91,142,244,0.07), rgba(124,58,237,0.04))",
                    borderColor: "rgba(91,142,244,0.15)",
                  }}
                >
                  <p className="text-[#e8eaed] text-base leading-relaxed font-medium">
                    {interviewQuestion.question}
                  </p>
                </div>

                {/* Date row */}
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                  style={{ background: "#141920", border: "1px solid #2d3748" }}
                >
                  <LuCalendar className="w-3.5 h-3.5 text-[#5b8ef4]" />
                  <span className="text-xs text-[#6b7280]">Date Added:</span>
                  <span className="text-xs text-[#9ca3af] font-medium">
                    {interviewQuestion.date?.toLocaleDateString() || "Not Specified"}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: "#2d3748" }} />

                {/* Added by */}
                <div>
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">Added by</p>
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ background: "#141920", borderColor: "#2d3748" }}
                  >
                    {interviewQuestion.user.profilePicture ? (
                      <img
                        src={interviewQuestion.user.profilePicture}
                        alt="User profile"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        style={{ border: "2px solid rgba(91,142,244,0.3)" }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(91,142,244,0.12)", border: "1px solid rgba(91,142,244,0.25)" }}
                      >
                        <LuUser className="w-5 h-5 text-[#5b8ef4]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#e8eaed]">{interviewQuestion.user.name}</p>
                      <p className="text-xs text-[#6b7280]">{interviewQuestion.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Owner actions */}
                {isOwner && (
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                        boxShadow: "0 4px 15px rgba(91,142,244,0.25)",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(91,142,244,0.4)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(91,142,244,0.25)")}
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.25)",
                        color: "#f87171",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(239,68,68,0.18)";
                        el.style.borderColor = "rgba(239,68,68,0.45)";
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(239,68,68,0.10)";
                        el.style.borderColor = "rgba(239,68,68,0.25)";
                      }}
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <Dialog
        isDialogOpen={isDialogOpen}
        onConfirm={() => { onDelete(); setIsDialogOpen(false); }}
        onDialogClose={() => setIsDialogOpen(false)}
        text="Are you sure you want to delete this interview question?"
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default InterviewQuestionModal;