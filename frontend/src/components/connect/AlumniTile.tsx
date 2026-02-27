import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alumni } from "../../types/User";
import { LuMail, LuBuilding2, LuBriefcase } from "react-icons/lu";
import AlumniProfileModal from "./AlumniProfileModal";

interface AlumniTileProps {
  data: Alumni & { similarityScore?: number };
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
        {data.similarityScore !== undefined && (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-bold text-white text-sm">
            {(data.similarityScore * 100).toFixed(0)}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="mb-3 flex items-start">
          <LuMail className="w-5 h-5 text-zinc-500 mr-2 mt-0.5" />
          <div className="text-sm text-zinc-300 break-words flex-1">
            <a
              href={`mailto:${data.email}`}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              {data.email}
            </a>
          </div>
        </div>

        <div className="mb-3 flex items-start">
          <LuBuilding2 className="w-5 h-5 text-zinc-500 mr-2 mt-0.5" />
          <div className="text-sm text-zinc-300 break-words flex-1">
            {data.company ? (
              <a
                href={`/companies/${data.company._id}`}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                {data.company.name}
              </a>
            ) : (
              <span className="text-zinc-500">Not specified</span>
            )}
          </div>
        </div>

        <div className="mb-2 flex items-start">
          <LuBriefcase className="w-5 h-5 text-zinc-500 mr-2 mt-0.5" />
          <div className="text-sm text-zinc-300 break-words flex-1">
            {data.position ? (
              data.position
            ) : (
              <span className="text-zinc-500">Not specified</span>
            )}
          </div>
        </div>

        {/* Animated button */}
        <div className="mt-4">
          <button
            onClick={onAlumniClicked}
            className="
              relative
              px-4
              py-1.5
              text-sm
              font-medium
              text-white
              rounded-md
              bg-gradient-to-r
              from-indigo-500
              to-cyan-500
              transition
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              hover:shadow-cyan-500/30
              active:translate-y-0
            "
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
