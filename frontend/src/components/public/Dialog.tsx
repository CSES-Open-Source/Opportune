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
      className="rounded-2xl px-16 py-12 flex flex-col bg-[#1e2433] border border-[#2d3748]"
    >
      <div className="h-full flex flex-col justify-center items-center gap-6">
        {type === "confirmation" && (
          <RxQuestionMarkCircled size={100} className="text-[#5b8ef4]" />
        )}
        {(type === "error" || type === "warning") && (
          <RxExclamationTriangle size={100} className="text-[#f87171]" />
        )}
        <div className="text-lg text-center max-w-[80%] font-medium text-[#e8eaed] mb-2">
          {text}
        </div>
        {type === "confirmation" && (
          <div className="w-full flex justify-center items-center gap-4 mt-2">
            <button
              className="px-8 py-2.5 rounded-xl font-semibold text-[#9ca3af] bg-[#141920] border border-[#2d3748] hover:border-[#6b7280] transition-all"
              onClick={onDialogClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] hover:shadow-lg hover:shadow-[#5b8ef4]/30 transition-all"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        )}
        {type === "error" && (
          <div className="w-full flex justify-center items-center mt-2">
            <button
              className="px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f87171] to-[#ef4444] hover:shadow-lg hover:shadow-[#f87171]/30 transition-all"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        )}
        {type === "warning" && (
          <div className="w-full flex justify-center items-center gap-4 mt-2">
            <button
              className="px-8 py-2.5 rounded-xl font-semibold text-[#9ca3af] bg-[#141920] border border-[#2d3748] hover:border-[#6b7280] transition-all"
              onClick={onDialogClose}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#f87171] to-[#ef4444] hover:shadow-lg hover:shadow-[#f87171]/30 transition-all"
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