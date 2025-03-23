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

  // Profile - Name
  //          Class

  // Company + Details

  // Position
  // Email
  // Number

  return (
    <div
      onClick={handleTileClick}
      className="bg-white border border-gray-300 rounded-md mt-4 mx-2 shadow-sm hover:bg-primary hover:bg-opacity-[0.02] hover:shadow-md transition cursor-pointer"
    >
      <div className="flex sm:items-start items-center space-x-4 w-full bg-slate-100">
        {/* Left: logo and alumni info */}
        <div className="flex flex-col sm:flex-row p-5 items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full gap-3">
          <div className="w-16 h-16 overflow-hidden rounded-full flex-shrink-0 border-2 border-white shadow-lg">
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
            <p className="text-sm text-gray-500">{"position will go here"}</p>
          </div>
        </div>
        {/* right: visit website link */}
        <div className="p-8">
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
      <div>
        <div className="flex">
          {data.company?.logo && (
            <div className="w-16 h-16 overflow-hidden rounded-full flex-shrink-0 border-2 border-white shadow-lg">
              <img
                src={data.company.logo}
                alt={`${data.company.name} logo`}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <div className="">
            {data.company?.name && (
              <div className="text-lg font-bold">{data.company.name}</div>
            )}
            <div className="">alumni position</div>
            {data.company?.city && <div>{data.company.city}</div>}
            {data.company?.employees && (
              <div>{data.company.employees} employees</div>
            )}
          </div>
        </div>
        <div>
          {data.email && (
            <a
              href={"mailto::" + data.email}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              {data.email}
            </a>
          )}
        </div>
        <div>{data.phoneNumber && <p>{data.phoneNumber}</p>}</div>
      </div>
    </div>
  );
};

export default AlumniTile;
