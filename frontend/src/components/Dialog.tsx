import Modal from "./Modal";
import { RxQuestionMarkCircled } from "react-icons/rx";

interface DialogProps {
  isDialogOpen: boolean;
  onConfirm: () => void;
  onDialogClose: () => void;
  text: string;
}

const Dialog = ({
  isDialogOpen,
  onConfirm,
  onDialogClose,
  text,
}: DialogProps) => {
  return (
    <Modal
      useOverlay={true}
      isOpen={isDialogOpen}
      onClose={onDialogClose}
      className="rounded-xl w-[60vh] h-[40vh] flex flex-col"
    >
      <div className="h-full flex flex-col justify-center items-center gap-10">
        <RxQuestionMarkCircled size={120} />
        <div className="text-xl font-medium text-gray-700">{text}</div>
        <div className="w-full flex justify-center items-center gap-10">
          <button
            className="w-28 h-10 border-2 border-solid rounded-full text-primary font-medium hover:bg-primary hover:bg-opacity-10 hover:transition"
            onClick={onDialogClose}
          >
            Cancel
          </button>
          <button
            className="w-28 h-10 border-2 border-solid rounded-full text-white bg-primary hover:bg-opacity-80 hover:transition font font-medium"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Dialog;
