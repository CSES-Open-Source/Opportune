import Modal from "./Modal";
import { Alumni } from "../types/User";

interface AlumniProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  alumni: Alumni | null;
}

const defaultLogo = "/assets/defaultLogo.png";

const AlumniProfileModal = ({
  isOpen,
  onClose,
  alumni,
}: AlumniProfileModalProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-[75vh] rounded-xl flex flex-col px-8 py-6"
        useOverlay
      >
        <div className="w-full h-full flex flex-col items-center gap-5">
          <h1 className="text-2xl font-bold">
            <div className="flex justify-center">
              <img
                src={alumni?.profilePicture || defaultLogo}
                alt={`${alumni?.name} logo`}
                className="w-20 h-20 rounded-full"
              />
            </div>
            {alumni?.name}
          </h1>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
              Email: {alumni?.email}
            </div>
            <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
              Position: {alumni?.position}
            </div>
            <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
              LinkedIn:{" "}
              {alumni?.linkedIn && (
                <a
                  href={alumni.linkedIn}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  {new URL(alumni.linkedIn).toString()}
                </a>
              )}
            </div>
            <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
              Phone Number: {alumni?.phoneNumber}
            </div>
            <div className="flex flex-col text-sm font-medium text-gray-700 mb-1">
              <div>
                Company: {alumni?.company?.name} - {alumni?.company?.industry} -{" "}
                {alumni?.company?.employees} employees
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AlumniProfileModal;
