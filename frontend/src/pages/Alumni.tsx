import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLinkedin
} from "react-icons/fa";
import { LuMail, LuBuilding2, LuBriefcase } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { getAlumniById } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAlumniUpdate = useCallback(() => {
      if (!id) return;
      setLoading(true);
      getAlumniById(id)
        .then((result: APIResult<Alumni>) => {
          if (result.success) {
            setAlumni(result.data);
            setError(null);
          } else {
            setError(result.error);
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch alumni: " + result.error,
            });
          }
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
        .finally(() => setLoading(false));
    }, [id]);

  // Initial company fetch
  useEffect(() => { handleAlumniUpdate(); }, [handleAlumniUpdate]);
  
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  if (!alumni)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Alumni not found.
      </div>
    );

  return (
  <div>
      {/* Display Spinner While Loading */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <ProgressSpinner className="h-16 w-16" strokeWidth="3" />
        </div>
      )}
      {/* When Finished Loading */}
      {!loading && (
        <div className="bg-transparent h-screen overflow-auto text-gray-800 relative">
          <div className="flex items-center justify-between px-4 pt-4">
            {/* Back Button to Exit Profile */}
            <button
              onClick={() => navigate("/connect")}
              className="inline-flex items-center text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition"
              aria-label="Back to Connect"
              title="Back to Connect"
            >
              <FaArrowLeft className="mr-1" />
              <span className="hidden sm:inline">Back to Connect</span>
            </button>
          </div>
          <div className="w-full items-center my-10">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto border">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column - Profile Image */}
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
                        {alumni.profilePicture ? (
                          <img
                            src={alumni.profilePicture}
                            alt={alumni.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-semibold">
                            {alumni.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
          
                    {/* Right Column - User Information */}
                    <div className="flex-1">
                      {/* Basic Information */}
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                          Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Full Name
                            </label>
                            <p className="text-gray-800">{alumni.name}</p>
                          </div>     
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              <div className="flex items-center gap-2">
                                <LuMail size={16} />
                                <span>Email</span>
                              </div>
                            </label>
                            <p className="text-gray-800">{alumni.email}</p>
                          </div>
          
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              <div className="flex items-center gap-2">
                                <FiPhone size={16} />
                                <span>Phone Number</span>
                              </div>
                            </label>
                            <p className="text-gray-800">
                                {alumni.phoneNumber || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
          
                      {/* LinkedIn */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          <div className="flex items-center gap-2">
                            <FaLinkedin size={16} />
                            <span>LinkedIn</span>
                          </div>
                        </label>
                        {alumni.linkedIn ? (
                          <a
                            href={alumni.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {alumni.linkedIn}
                          </a>
                        ) : (
                          <p className="text-gray-600">Not provided</p>
                        )}
                      </div>
          
          
                      {/* Alumni-specific Information */}
                        <div>
                          <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Professional Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                  <div className="flex items-center gap-2">
                                    <LuBuilding2 size={16} />
                                    <span>Company</span>
                                  </div>
                                </label>
                                <p className="text-gray-800">
                                  {alumni.company?.name || "Not specified"}
                                </p>
                              </div>
          
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                  <div className="flex items-center gap-2">
                                    <LuBriefcase size={16} />
                                    <span>Position</span>
                                  </div>
                                </label>
                                <p className="text-gray-800">
                                  {alumni.position || "Not specified"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Organizations</span>
                              </label>
                              {Array.isArray(alumni.organizations) && alumni.organizations.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {alumni.organizations.map((organization, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                >
                                  {organization.charAt(0).toUpperCase() + organization.slice(1).toLowerCase()}
                                </span>
                              ))}
                              </div>
                            ) : (
                            <p className="text-gray-800">Not specified</p>
                            )}
                          </div>
          
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Specializations</span>
                              </label>
                              {Array.isArray(alumni.specializations) && alumni.specializations.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {alumni.specializations.map((specialization, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                >
                                  {specialization.charAt(0).toUpperCase() + specialization.slice(1).toLowerCase()}
                                </span>
                              ))}
                              </div>
                            ) : (
                            <p className="text-gray-800">Not specified</p>
                            )}
                          </div>
          
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Hobbies</span>
                              </label>
                              {Array.isArray(alumni.hobbies) && alumni.hobbies.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {alumni.hobbies.map((hobby, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                >
                                  {hobby.charAt(0).toUpperCase() + hobby.slice(1).toLowerCase()}
                                </span>
                              ))}
                              </div>
                            ) : (
                            <p className="text-gray-800">Not specified</p>
                            )}
                          </div>
          
                          <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Skills</span>
                              </label>
                              {Array.isArray(alumni.skills) && alumni.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {alumni.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                >
                                  {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                                </span>
                              ))}
                              </div>
                            ) : (
                            <p className="text-gray-800">Not specified</p>
                            )}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      )}
      <Toast ref={toast} />
    </div>
  );
};

export default AlumniProfile;
