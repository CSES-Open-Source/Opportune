import React from "react";
import { useNavigate } from "react-router-dom";
import { Company, IndustryType } from "../types/Company";
import { getIndustryLabel } from "../utils/valuesToLabels";
import { INDUSTRY_COLOR_MAP } from "../utils/valuesToLabels";

const defaultLogo = "/assets/defaultLogo.png";

const CompanyTile: React.FC<{ data: Company }> = ({ data }) => {
  const navigate = useNavigate();
  const location =
    data.city && data.state
      ? `${data.city}, ${data.state}`
      : "Location not specified";
  const logoSrc = data.logo?.trim() ? data.logo : defaultLogo;
  const colorClasses =
    INDUSTRY_COLOR_MAP[data.industry as IndustryType] ??
    "bg-gray-100 text-gray-900";

  return (
    <div
      onClick={() => navigate(`/companies/${data._id}`)}
      className="
        relative
        flex items-center justify-between
        bg-white border-[1.5px] border-gray-200
        rounded-2xl
        px-4 py-6
        transition-colors cursor-pointer
        hover:bg-gray-50
      "
    >
      {/* 1. Top-right arrow */}
      <a
        href={data.url}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noopener noreferrer"
        className="
          absolute top-3 right-3      /* pin to the top-right */
          text-blue-500
          hover:text-blue-600
        "
      >
        ↗
      </a>

      {/* 2. Logo + text */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-12 h-12">
          <img
            src={logoSrc}
            alt={`${data.name} logo`}
            className="object-contain w-full h-full rounded-md bg-transparent"
          />
        </div>
        <div className="ml-4">
          <div className="text-lg font-semibold text-gray-800">{data.name}</div>
          <div className="text-sm text-gray-500">{location}</div>
          <div className="mt-1">
            <span
              className={`
                inline-flex items-center
                px-2 py-0.5 rounded-full
                text-xs font-medium
                ${colorClasses}
              `}
            >
              {getIndustryLabel(data.industry as IndustryType)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyTile;
