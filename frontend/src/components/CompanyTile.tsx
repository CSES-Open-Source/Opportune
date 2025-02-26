import React from "react";
import { useNavigate } from "react-router-dom";
import { CompanyPage } from "../types/Company"
import { FaExternalLinkAlt } from "react-icons/fa";


interface CompanyTileProps {
  data: CompanyPage;
}

const CompanyTile: React.FC<CompanyTileProps> = ({ data }) => {
  const defaultLogo =
    "/images/linkedin-icon-logo.svg";
  const navigate = useNavigate();

  const handleTileClick = () => {
    navigate(`/companies/${data._id}`);
  };

  const location =
    data.city && data.state ? `${data.city}, ${data.state}` : "Location not specified";

  return (
    <div
      onClick={handleTileClick}
      className="bg-white border border-gray-300 rounded-md px-6 py-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex sm:items-start items-center space-x-4 w-full">
        {/* Left: logo and company info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0">
            <img
              src={data.logo && data.logo.trim() !== "" ? data.logo : defaultLogo}
              alt={`${data.name} logo`}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">{data.name}</h2>
            <p className="text-sm text-gray-500">{location}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.industry && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {data.industry}
                </span>
              )}
              {data.employees && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {data.employees} employees
                </span>
              )}
            </div>
          </div>
        </div>
        {/* right: visit website link */}
        {data.url && (
          <a
            href={data.url}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default CompanyTile;
