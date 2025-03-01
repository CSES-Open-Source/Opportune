import { useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";

interface BaseModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  disableClose?: boolean;
  useOverlay?: boolean;
  children?: React.ReactNode;
  backdropOpacity?: number;

  // passed to the modal container within the backdrop
  className?: string;
}

interface enableCloseModalProps extends BaseModalProps {
  disableClose?: false;
  onClose: () => void;
}

interface disableCloseModalProps extends BaseModalProps {
  disableClose: true;
}

type ModalProps = enableCloseModalProps | disableCloseModalProps;

/**
 * A modal component that can be used to display content on top of the current page, backdrop has an opacity of 50%.
 *
 * `className` and all additional props will be passed to the modal container (the white box on top of the backdrop).
 *
 * @param {boolean} props.isOpen - boolean to indicate if the modal should be open
 * @param {boolean} props.disableClose - disable the close button and close by esc
 * @param {() => void} props.onClose - callback function called when close button is pressed, backdrop is clicked, or escape key is pressed
 * @param {boolean} props.useOverlay - boolean to indicate if backdrop should be visible and if clicking outside the modal should close the modal
 * @param {number} props.backdropOpacity - opacity of the backdrop in percentage, default is 50
 * @param {React.ReactNode} props.children - children to be rendered inside the modal
 *
 * @returns {React.JSX.Element} The rendered modal component.
 */
const Modal = (props: ModalProps): React.JSX.Element => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const {
    isOpen,
    disableClose,
    useOverlay = true,
    backdropOpacity = 50,
    className,
    children,
  } = props;

  useEffect(() => {
    // Close modal when escape key is pressed
    if (!disableClose) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };

      // Close modal when clicking outside the modal
      const handleClickOutside = (e: MouseEvent) => {
        if (backdropRef.current === e.target) {
          props.onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      // add backdrop click listener if useOverlay is true
      if (useOverlay) {
        document.addEventListener("mousedown", handleClickOutside);
        // "click" event has weird behavior where if you drag a click from inside the modal to outside, it will trigger the click event
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);

        if (useOverlay) {
          document.removeEventListener("mousedown", handleClickOutside);
        }
      };
    }
  }, [useOverlay, disableClose, props]);

  if (!isOpen) return <></>;

  return (
    // backdrop
    <div
      className={`absolute left-0 top-0 w-[100vw] h-[100vh] flex justify-center items-center ${
        !disableClose && "hover:cursor-pointer"
      } transition z-50`}
      style={{ backgroundColor: useOverlay ? "#000000" + backdropOpacity : "" }}
      ref={backdropRef}
    >
      {/* modal container */}
      <div
        {...props}
        className={`relative bg-white mx-auto w-[50%] p-2 hover:cursor-default ${className}`}
      >
        {!disableClose && (
          <FaXmark
            className="absolute top-2 right-2 hover:text-primary hover:cursor-pointer transition"
            size={20}
            onClick={() => props.onClose()}
          />
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
