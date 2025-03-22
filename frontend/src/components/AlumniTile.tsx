import React from "react";
// mport { useNavigate } from "react-router-dom";
import { Alumni } from "../types/User";
import { FaExternalLinkAlt } from "react-icons/fa";

const defaultLogo = "/assets/defaultLogo.png";

interface AlumniTileProps {
  data: Alumni;
}

const AlumniTile: React.FC<AlumniTileProps> = ({ data }) => {
  // const navigate = useNavigate();

  const handleTileClick = () => {
    // navigate(`/users/alumni/${data.}`);
  };

  return (
    <div
      onClick={handleTileClick}
      className="bg-white border border-gray-300 rounded-md ps-10 pe-8 py-4 mt-4 mx-2 shadow-sm hover:bg-primary hover:bg-opacity-[0.02] hover:shadow-md transition cursor-pointer"
    >
      <div className="flex sm:items-start items-center space-x-4 w-full">
        {/* Left: logo and company info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full gap-3">
          <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0">
            <img
              src={
                data.profilePicture && data.profilePicture.trim() !== ""
                  ? data.profilePicture
                  : defaultLogo
              }
              alt={`${data.name} logo`}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">{data.name}</h2>
            <p className="text-sm text-gray-500">{"placeholder"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.email && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {data.email}
                </span>
              )}
              {data.phoneNumber && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {data.phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* right: visit website link */}
        {data.linkedIn && (
          <a
            href={data.linkedIn}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AlumniTile;
