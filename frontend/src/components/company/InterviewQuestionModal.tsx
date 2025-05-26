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
            detail: "Interview question was successfully deleteed",
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
          detail:
            "Failed to update interview question: " + (error as Error).message,
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
            detail: "Interview question was updated successfully",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update interview question: " + response.error,
          });
        }
      })
      .catch((error: unknown) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Failed to update interview question: " + (error as Error).message,
        });
      });
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
            <h2 className="text-2xl font-bold mb-4">Edit Interview Question</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <textarea
                value={newQuestion}
                onChange={(event) => setNewQuestion(event.target.value)}
                placeholder="Add question"
                className={`w-full p-2 border-2 rounded-md ${
                  newQuestion !== ""
                    ? "focus:outline-blue-600"
                    : "outline-red-600 border-red-600"
                }`}
              />
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
              <h2 className="text-2xl font-bold">
                {interviewQuestion.question}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">Date Added</p>
                <p>
                  {interviewQuestion.date?.toLocaleDateString() ||
                    "Not Specified"}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-gray-500 text-sm mb-2">Added by:</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={interviewQuestion.user.profilePicture}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{interviewQuestion.user.name}</p>
                  <p className="text-gray-500 text-sm">
                    {interviewQuestion.user.email}
                  </p>
                </div>
              </div>
            </div>

            {user?._id === interviewQuestion.user._id && (
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
        text={"Are you sure you want to delete this interview question?"}
        type="warning"
      />
      <Toast ref={toast} />
    </div>
  );
};

export default InterviewQuestionModal;
