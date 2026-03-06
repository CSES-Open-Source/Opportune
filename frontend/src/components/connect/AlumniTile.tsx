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
    <div
      onClick={() => navigate(`/alumni/${data._id}`)}
      className="
        bg-zinc-900/80
        backdrop-blur
        rounded-xl
        overflow-visible
        h-auto
        border
        border-zinc-800
        shadow-lg
        transition
        hover:shadow-indigo-500/10
        hover:border-zinc-700
      "
    >
      {/* Card header */}
      <div className="bg-zinc-900 p-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden mr-3">
            {data.profilePicture ? (
              <img
                src={data.profilePicture}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl text-zinc-300">
                {data.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-zinc-100">
              {data.name}
            </h3>
          </div>
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