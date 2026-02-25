import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../../types/User";
import { LuMail, LuGraduationCap } from "react-icons/lu";
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
    <div onClick={() => navigate(`/student/${data._id}`)}
      className="bg-white rounded-lg overflow-visible h-auto transition border border-gray-300 shadow-sm hover:shadow-md">
      {/* Card header with avatar and name */}
      <div className="bg-gray-50 p-4 flex items-center border-b">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
          {data.profilePicture ? (
            <img
              src={data.profilePicture}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{data.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">{data.name}</h3>
        </div>
      </div>

      {/* Card body with user details */}
      <div className="p-4">
        <div className="mb-3 flex items-start">
          <LuMail className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 break-words flex-1">
            <a
              href={`mailto:${data.email}`}
              className="text-blue-500 underline hover:text-blue-600"
            >
              {data.email}
            </a>
          </div>
        </div>

        <div className="mb-3 flex items-start">
          <LuGraduationCap className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 break-words flex-1">
            {data.major ? (
              data.major
            ) : (
              <span className="text-gray-500">Major not specified</span>
            )}
          </div>
        </div>

        <div className="mb-2 flex items-start">
          <div className="text-sm text-gray-700 break-words flex-1">
            {data.classLevel ? (
              data.classLevel.charAt(0).toUpperCase() +
              data.classLevel.slice(1).toLowerCase()
            ) : (
              <span className="text-gray-500">Class Level not specified</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition"
            onClick={onStudentClicked}
          >
            View Profile
          </button>
        </div>
      </div>
      <StudentProfileModal
        isOpen={studentProfileOpen}
        onClose={onStudentProfileClose}
        student={data}
      />
    </div>
  );
};

export default StudentTile;