import React from "react";
import { Alumni } from "../types/User";

const defaultLogo = "/assets/defaultLogo.png";

interface AlumniTileProps {
  data: Alumni;
}

const AlumniTile: React.FC<AlumniTileProps> = ({ data }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-md mt-4 mx-2 shadow-sm hover:bg-primary hover:bg-opacity-[0.02] hover:shadow-md transition cursor-pointer">
      {/* Profile Picture, Name, Position */}
      <div className="flex sm:items-start items-center space-x-4 w-full bg-slate-100">
        {/* Left: logo and alumni info */}
        <div className="flex flex-col sm:flex-row p-5 items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full gap-3 max-h-100">
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
            <p className="text-sm text-gray-500">{"Class of "}</p>
          </div>
        </div>
      </div>
      <div>
        {/* Company */}
        <div className="flex space-x-4 pl-2 pt-4">
          {data.company?.logo && (
            <div className="w-16 h-16 overflow-hidden rounded-full flex-shrink-0 border-2 border-white shadow-lg">
              <img
                src={data.company.logo}
                alt={`${data.company.name} logo`}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <div>
            {data.company?.name && (
              <div className="text-lg font-bold">{data.company.name}</div>
            )}
            <div className="flex text-sm text-gray-500 sm:flex-col md:flex-row">
              {[
                data.company?.industry,
                data.company?.city,
                data.company?.employees &&
                  `${data.company.employees} employees`,
              ]
                .filter(Boolean) // removes values like undefined
                .map((item, index, arr) => (
                  <div key={index}>
                    {item}
                    {index < arr.length - 1 && " •\u00A0"}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* Position, Email, Phone Number */}
        <ul className="pl-10 py-4 list-disc space-y-2">
          {data.position && <li>{data.position}</li>}
          {data.email && (
            <li>
              <a
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                {data.email}
              </a>
            </li>
          )}
          <li>{data.phoneNumber && <p>{data.phoneNumber}</p>}</li>
        </ul>
      </div>
    </div>
  );
};

export default AlumniTile;
