import React from "react";
import Modal from "../public/Modal";
import { Student } from "../../types/User";
import {
  LuMail,
  LuGraduationCap,
  LuPhone,
} from "react-icons/lu";
import { BsLinkedin } from "react-icons/bs";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

const StudentProfileModal = ({
  isOpen,
  onClose,
  student,
}: StudentProfileModalProps) => {
  // Function to format LinkedIn URL for display
  const formatLinkedInUrl = (url: string) => {
    try {
      const linkedInUrl = new URL(url);
      // Display just the path without https://linkedin.com
      return linkedInUrl.pathname.replace(/^\//, "");
    } catch {
      return url;
    }
  };

  if (!student) {
    return <div>Error: Student not found</div>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[600px] rounded-xl p-0 overflow-hidden"
      useOverlay
    >
      {/* Header with background color and profile image */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={`${student.name}'s profile`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-500 font-semibold">
                  {student.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold mb-1">{student.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <LuGraduationCap className="w-4 h-4" />
              <span>{student.major || "Major not specified"}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span>{student.classLevel || "Class Level not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Information */}
          <section className="space-y-3">
            <h2 className="font-semibold text-gray-700 border-b pb-1">
              Contact Information
            </h2>

            <div className="flex items-start gap-3">
              <LuMail className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <a
                  href={`mailto:${student.email}`}
                  className="text-blue-500 underline hover:text-blue-600"
                >
                  <div className="w-[200px] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                    {student.email}
                  </div>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <LuPhone className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div>{student.phoneNumber || "Not specified"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BsLinkedin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-500">LinkedIn</div>
                {student.linkedIn ? (
                  <a
                    href={student.linkedIn}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {formatLinkedInUrl(student.linkedIn)}
                  </a>
                ) : (
                  <div>Not specified</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default StudentProfileModal;
