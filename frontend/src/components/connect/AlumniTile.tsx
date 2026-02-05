import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alumni } from "../../types/User";
import { LuMail, LuBuilding2, LuBriefcase } from "react-icons/lu";
import AlumniProfileModal from "./AlumniProfileModal";

interface AlumniTileProps {
  data: Alumni;
}

const AlumniTile: React.FC<AlumniTileProps> = ({ data }) => {
  const navigate = useNavigate();
  const [alumniProfileOpen, setAlumniProfileOpen] = useState(false);

  const onAlumniClicked = () => {
    setAlumniProfileOpen(true);
  };

  const onAlumniProfileClose = () => {
    setAlumniProfileOpen(false);
  };

  return (
    <div onClick={() => navigate(`/alumni/${data._id}`)} 
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
          <LuBuilding2 className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 break-words flex-1">
            {data.company ? (
              <a
                href={`/companies/${data.company._id}`}
                className="text-blue-500 underline hover:text-blue-600"
              >
                {data.company.name}
              </a>
            ) : (
              <span className="text-gray-500">Not specified</span>
            )}
          </div>
        </div>

        <div className="mb-2 flex items-start">
          <LuBriefcase className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 break-words flex-1">
            {data.position ? data.position : <span className="text-gray-500">Not specified</span>}
          </div>
        </div>

        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm transition"
            onClick={onAlumniClicked}
          >
            View Profile
          </button>
        </div>
      </div>
      <AlumniProfileModal
        isOpen={alumniProfileOpen}
        onClose={onAlumniProfileClose}
        alumni={data}
      />
    </div>
  );
};

export default AlumniTile;
