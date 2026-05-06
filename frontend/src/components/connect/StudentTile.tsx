import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../../types/User";
import { LuMail, LuBriefcase, LuGraduationCap } from "react-icons/lu";
import StudentProfileModal from "./StudentProfileModal";

interface StudentTileProps {
  data: Student;
}

const StudentTile: React.FC<StudentTileProps> = ({ data }) => {
  const navigate = useNavigate();
  const [studentProfileOpen, setStudentProfileOpen] = useState(false);

  const onStudentClicked = () => {
    setStudentProfileOpen(true);
  };

  const onStudentProfileClose = () => {
    setStudentProfileOpen(false);
  };

  return (
    <>
      <div 
        onClick={() => navigate(`/student/${data._id}`)}
        className="rounded-xl overflow-hidden h-auto transition-all cursor-pointer border hover:-translate-y-1"
        style={{
          background: 'linear-gradient(145deg, #1e2433, #1a1f2e)',
          borderColor: '#2d3748',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#5b8ef4';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(91,142,244,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#2d3748';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        }}
      >
        {/* Card header with avatar and name */}
        <div 
          className="p-4 flex items-center border-b"
          style={{
            background: '#1a1f2e',
            borderColor: '#2d3748',
          }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden mr-3 border-2"
            style={{
              background: data.profilePicture ? 'transparent' : 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
              borderColor: '#5b8ef4',
            }}
          >
            {data.profilePicture ? (
              <img
                src={data.profilePicture}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">{data.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#e8eaed]">{data.name}</h3>
          </div>
        </div>

        {/* Card body with user details */}
        <div className="p-4 space-y-3">
          <div className="flex items-start">
            <LuMail className="w-5 h-5 text-[#5b8ef4] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#9ca3af] break-words flex-1">
              <a
                href={`mailto:${data.email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[#5b8ef4] hover:text-[#7c3aed] transition-colors"
              >
                {data.email}
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <LuBriefcase className="w-5 h-5 text-[#5b8ef4] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#e8eaed] break-words flex-1">
              {data.major ? (
                data.major
              ) : (
                <span className="text-[#6b7280] italic">Major not specified</span>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <LuGraduationCap className="w-5 h-5 text-[#5b8ef4] mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#e8eaed] break-words flex-1">
              {data.classLevel ? (
                data.classLevel.charAt(0).toUpperCase() +
                data.classLevel.slice(1).toLowerCase()
              ) : (
                <span className="text-[#6b7280] italic">Class Level not specified</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-2">
            <button
              className="w-full px-4 py-2 rounded-lg font-semibold text-white text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
                boxShadow: '0 2px 8px rgba(91,142,244,0.3)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStudentClicked();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(91,142,244,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(91,142,244,0.3)';
              }}
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      <StudentProfileModal
        isOpen={studentProfileOpen}
        onClose={onStudentProfileClose}
        student={data}
      />
    </>
  );
};

export default StudentTile;