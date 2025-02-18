import React from "react";
import { useNavigate } from "react-router-dom";

interface Company {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  logoKey?: string;
  logo?: string;
  employees?: string;
  industry?: string;
  url?: string;
}

interface CompanyTileProps {
  data: Company;
}

const CompanyTile: React.FC<CompanyTileProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/companies/${data._id}`);
  };

  // default logo (Linkedin) if no logo is provided.
  const defaultLogo =
    "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png";

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-center mb-4">
        {/* Logo container */}
        <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded mr-4 overflow-hidden">
          <img
            src={data.logo && data.logo.trim() !== "" ? data.logo : defaultLogo}
            alt={`${data.name} logo`}
            className="object-contain w-full h-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
          <p className="text-gray-500">
            {data.city && data.state ? `${data.city}, ${data.state}` : "Location not specified"}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.industry && <p className="text-gray-600 text-sm">Industry: {data.industry}</p>}
        {data.employees && <p className="text-gray-600 text-sm">Employees: {data.employees}</p>}
        {data.url && (
          <a
            href={data.url}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm hover:underline"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default CompanyTile;
