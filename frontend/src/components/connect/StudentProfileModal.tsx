import React from "react";
import Modal from "../public/Modal";
import { Student } from "../../types/User";
import {
  LuMail,
  LuGraduationCap,
  LuPhone,
  LuX,
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
      className="w-[600px] rounded-xl p-0 overflow-hidden border border-[#2d3748]"
      style={{ background: '#1a1f2e' }}
      useOverlay
    >
      {/* Header with gradient and profile image */}
      <div 
        className="text-white p-6 relative"
        style={{
          background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
        }}
      >
        {/* Top gradient bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, #5b8ef4, #7c3aed, #ec4899)',
          }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-all"
        >
          <LuX size={20} />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div 
            className="w-24 h-24 rounded-full p-1 shadow-lg border-4"
            style={{
              background: '#fff',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={`${student.name}'s profile`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
                }}
              >
                <span className="text-3xl text-white font-bold">
                  {student.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold mb-1">{student.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white/90">
              <LuGraduationCap className="w-4 h-4" />
              <span>{student.major || "Major not specified"}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white/80 text-sm mt-1">
              <span>{student.classLevel ? 
                student.classLevel.charAt(0).toUpperCase() + student.classLevel.slice(1).toLowerCase() 
                : "Class Level not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" style={{ background: '#1a1f2e' }}>
        <div className="space-y-4">
          {/* Contact Information */}
          <section className="space-y-4">
            <h2 
              className="font-semibold pb-2 border-b text-[#e8eaed] flex items-center gap-2"
              style={{ borderColor: '#2d3748' }}
            >
              <div 
                className="w-1 h-5 rounded"
                style={{ background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)' }}
              />
              Contact Information
            </h2>

            <div 
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{
                background: '#141920',
                borderColor: '#2d3748',
              }}
            >
              <LuMail className="w-5 h-5 text-[#5b8ef4] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#6b7280] mb-1 font-medium uppercase tracking-wider">Email</div>
                <a
                  href={`mailto:${student.email}`}
                  className="text-[#5b8ef4] hover:text-[#7c3aed] transition-colors text-sm"
                >
                  <div className="truncate overflow-hidden whitespace-nowrap text-ellipsis">
                    {student.email}
                  </div>
                </a>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{
                background: '#141920',
                borderColor: '#2d3748',
              }}
            >
              <LuPhone className="w-5 h-5 text-[#5b8ef4] mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-[#6b7280] mb-1 font-medium uppercase tracking-wider">Phone</div>
                <div className="text-[#e8eaed] text-sm">{student.phoneNumber || <span className="text-[#6b7280] italic">Not specified</span>}</div>
              </div>
            </div>

            <div 
              className="flex items-start gap-3 p-3 rounded-lg border"
              style={{
                background: '#141920',
                borderColor: '#2d3748',
              }}
            >
              <BsLinkedin className="w-5 h-5 text-[#5b8ef4] mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[#6b7280] mb-1 font-medium uppercase tracking-wider">LinkedIn</div>
                {student.linkedIn ? (
                  <a
                    href={student.linkedIn}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5b8ef4] hover:text-[#7c3aed] transition-colors text-sm break-all"
                  >
                    {formatLinkedInUrl(student.linkedIn)}
                  </a>
                ) : (
                  <div className="text-[#6b7280] italic text-sm">Not specified</div>
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