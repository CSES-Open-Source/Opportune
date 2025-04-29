import Modal from "./Modal";
import { RxQuestionMarkCircled, RxExclamationTriangle } from "react-icons/rx";

type DialogType = "confirmation" | "error" | "warning";

interface DialogProps {
  isDialogOpen: boolean;
  onConfirm: () => void;
  onDialogClose: () => void;
  text: string;
  type?: DialogType;
}

const Dialog = ({
  isDialogOpen,
  onConfirm,
  onDialogClose,
  text,
  type = "confirmation",
}: DialogProps) => {
  return (
    <Modal
      useOverlay={true}
      isOpen={isDialogOpen}
      onClose={onDialogClose}
      className="rounded-xl w-[50vh] h-[37vh] flex flex-col"
    >
      <div className="h-full flex flex-col justify-center items-center gap-7">
        {type === "confirmation" && <RxQuestionMarkCircled size={120} />}
        {type === "error" ||
          (type === "warning" && (
            <RxExclamationTriangle size={120} className="text-red-700" />
          ))}
        <div className="text-xl text-center max-w-[70%] font-medium text-gray-700 mb-3">
          {text}
        </div>
        {type === "confirmation" && (
          <div className="w-full flex justify-center items-center gap-10">
            <button
              className="w-28 h-10 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              onClick={onDialogClose}
            >
              Cancel
            </button>
            <button
              className="w-28 h-10 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font font-medium"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        )}
        {type === "error" && (
          <div className="w-full flex justify-center items-center gap-10">
            <button
              className="w-28 h-10 border-2 border-solid rounded-full text-white bg-red-700 hover:bg-opacity-80 hover:transition font font-medium"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        )}
        {type === "warning" && (
          <div className="w-full flex justify-center items-center gap-10">
            <button
              className="w-28 h-10 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              onClick={onDialogClose}
            >
              Cancel
            </button>
            <button
              className="w-28 h-10 rounded-lg text-white bg-red-700 hover:bg-opacity-80 transition font-medium"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Dialog;
