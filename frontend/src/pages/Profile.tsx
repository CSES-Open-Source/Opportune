import { useEffect, useState } from "react";
import {
  LuGraduationCap,
  LuBriefcase,
  LuMail,
  LuShare2,
  LuBuilding2,
} from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";
import { AddableCardList } from "../components/profile/AddableCardList";
import {
  Alumni,
  ClassLevel,
  Student,
  UpdateUserRequest,
  UserType,
} from "../types/User";
import { Dropdown } from "primereact/dropdown";
import CompanyDropdown from "../components/company/CompanyDropdown";
import "../styles/Animations.css";

const Profile = () => {
  const classLevelOptions = Object.keys(ClassLevel).map((key) => ({
    label: key,
    value: ClassLevel[key as keyof typeof ClassLevel],
  }));

  const { user, updateUser } = useAuth();

  const [studentProfile, setStudentProfile] = useState<{ _id?: string; userId: string }>({ userId: user?._id ? String(user._id) : "" });
  const [alumniProfile, setAlumniProfile] = useState<{ _id?: string; userId: string }>({ userId: user?._id ? String(user._id) : "" });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UpdateUserRequest>(
    user || { type: UserType.Student },
  );
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean>(true);
  const [isValidLinkedIn, setIsValidLinkedIn] = useState<boolean>(true);
  const [canSave, setCanSave] = useState<boolean>(true);

  useEffect(() => {
    if (!user?._id) return;

    if (user?.type === UserType.Student) {
      fetch(`/api/profile/student/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (!data || data.error) {
            setStudentProfile({ userId: user._id });
          } else {
            setStudentProfile(data);
          }
        });
    }
    if (user?.type === UserType.Alumni) {
      fetch(`/api/profile/alumni/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (!data || data.error) {
            setAlumniProfile({ userId: user._id });
          } else {
            setAlumniProfile(data);
          }
        });
    }
    setCanSave(isValidLinkedIn && isValidPhoneNumber);
  }, [user, isValidLinkedIn, isValidPhoneNumber]);

  const onSave = () => {
    if (!user) {
      return;
    }

    const updates = { ...updatedUser };

    // Prevent updating company when unnecessary because it triggers reupload to AWS
    if (
      user.type === UserType.Alumni &&
      user.company?._id === updatedUser.company?._id
    ) {
      updates.company = undefined;
    }

    updateUser(updates).then((response) => {
      if (response.success) {
        setIsEditing(false);
      }

      if (updatedUser.type === UserType.Student) {
        saveStudentProfile();
      } else if (updatedUser.type === UserType.Alumni) {
        saveAlumniProfile();
      }
    });
  };

  const onEdit = () => {
    if (user) {
      setUpdatedUser(user);
      setIsEditing(true);
    }
  };

  const saveStudentProfile = () => {
    if (!studentProfile) return;
    if (!studentProfile._id) {
      fetch(`/api/profile/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentProfile),
      })
        .then(r => r.json())
        .then((data) => {
          setStudentProfile(data);
          console.log("created student profile", data);
        });
    } else {
      fetch(`/api/profile/student/${user?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentProfile),
      })
        .then(r => r.json())
        .then((data) => {
          setStudentProfile(data);
          console.log("saved student profile", data);
        });
    }
  };

  const saveAlumniProfile = () => {
    if (!alumniProfile) return;
    if (!alumniProfile._id) {
      fetch(`/api/profile/alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumniProfile),
      })
        .then(r => r.json())
        .then((data) => {
          setAlumniProfile(data);
          console.log("created alumni profile", data);
        });
    } else {
      fetch(`/api/profile/alumni/${user?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumniProfile),
      })
        .then(r => r.json())
        .then((data) => {
          setAlumniProfile(data);
          console.log("saved alumni profile", data);
        });
    }
  };

  const handleInputChange = (
    field: keyof Student | keyof Alumni,
    value: unknown,
  ) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onLinkedInChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input === "") {
      handleInputChange("linkedIn", undefined);
      setIsValidLinkedIn(true);
      return;
    }

    try {
      new URL(input);
      setIsValidLinkedIn(true);
    } catch {
      setIsValidLinkedIn(false);
    }

    handleInputChange("linkedIn", input);
  };

  const onPhoneNumberChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanedInput = input.replace(/\D/g, "");

    let formattedNumber = "";

    if (cleanedInput.length > 0) {
      if (cleanedInput.length < 4) {
        formattedNumber = `(${cleanedInput}`;
      } else if (cleanedInput.length < 7) {
        formattedNumber = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(3)}`;
      } else {
        formattedNumber = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6, 10)}`;
      }
      handleInputChange("phoneNumber", formattedNumber);
    } else {
      handleInputChange("phoneNumber", undefined);
    }

    setIsValidPhoneNumber(
      !(cleanedInput.length > 0 && cleanedInput.length < 10),
    );
  };

  if (!user) {
    return <></>;
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pb-6 border-b border-[#2d3748]">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] bg-clip-text text-transparent mb-1">
              Profile
            </h1>
            <p className="text-[#9ca3af] text-sm">Manage your academic and professional presence</p>
          </div>
          {!isEditing && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-[#5b8ef4]/40"
            >
              <FiEdit size={18} />
              <span>Edit Profile</span>
            </button>
          )}
          {isEditing && (
            <button
              onClick={onSave}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] text-white rounded-lg font-semibold hover:-translate-y-0.5 transition-all shadow-lg ${
                canSave ? 'hover:shadow-[#5b8ef4]/40' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!canSave}
            >
              <FiEdit size={18} />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 animate-slideUp">
          {/* Left Sidebar - Profile Card */}
          <div className="bg-[#1e2433] rounded-2xl p-10 shadow-2xl border border-[#2d3748] relative overflow-hidden">
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed]"></div>
            
            {/* Profile Image */}
            <div className="relative w-36 h-36 mx-auto mb-8">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-4 border-[#5b8ef4] shadow-[0_0_30px_rgba(91,142,244,0.3)] hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[#5b8ef4] to-[#7c3aed] text-white text-4xl font-bold shadow-[0_0_30px_rgba(91,142,244,0.3)] hover:scale-105 transition-transform">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 bg-[#10b981] rounded-full border-3 border-[#1e2433] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <span>👤</span> Full Name
                </div>
                <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                  {user.name || <span className="text-[#6b7280] italic">Not provided</span>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuMail size={14} /> Email
                </div>
                <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all break-all">
                  {user.email || <span className="text-[#6b7280] italic">Not provided</span>}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <FiPhone size={14} /> Phone Number
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={updatedUser.phoneNumber}
                    placeholder="Add phone number"
                    className={`w-full px-3 py-3 bg-[#1a1f2e] rounded-lg border-2 text-[#e8eaed] focus:outline-none transition-all ${
                      isValidPhoneNumber
                        ? "border-[#2d3748] focus:border-[#5b8ef4]"
                        : "border-red-500"
                    }`}
                    onChange={onPhoneNumberChanged}
                  />
                ) : (
                  <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                    {user.phoneNumber || <span className="text-[#6b7280] italic">Not provided</span>}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <span>👔</span> User Type
                </div>
                {isEditing ? (
                  <div className="flex gap-4 px-3 py-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        checked={updatedUser.type === UserType.Student}
                        onChange={(e) =>
                          handleInputChange(
                            "type",
                            e.target.checked ? UserType.Student : UserType.Alumni,
                          )
                        }
                        className="w-4 h-4 text-[#5b8ef4] border-[#2d3748] focus:ring-[#5b8ef4] focus:ring-2"
                      />
                      <span className="ml-2 text-[#e8eaed]">Student</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        checked={updatedUser.type === UserType.Alumni}
                        onChange={(e) =>
                          handleInputChange(
                            "type",
                            e.target.checked ? UserType.Alumni : UserType.Student,
                          )
                        }
                        className="w-4 h-4 text-[#5b8ef4] border-[#2d3748] focus:ring-[#5b8ef4] focus:ring-2"
                      />
                      <span className="ml-2 text-[#e8eaed]">Alumni</span>
                    </label>
                  </div>
                ) : (
                  <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                    {user.type === UserType.Student ? "Student" : "Alumni"}
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-[#2d3748]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <FaLinkedin size={14} /> LinkedIn
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={updatedUser.linkedIn}
                    placeholder="Add LinkedIn profile"
                    className={`w-full px-3 py-3 bg-[#1a1f2e] rounded-lg border-2 text-[#e8eaed] focus:outline-none transition-all ${
                      isValidLinkedIn
                        ? "border-[#2d3748] focus:border-[#5b8ef4]"
                        : "border-red-500"
                    }`}
                    onChange={onLinkedInChanged}
                  />
                ) : user.linkedIn ? (
                  <a
                    href={user.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#5b8ef4] hover:text-[#7c3aed] font-semibold transition-all hover:gap-3"
                  >
                    View Profile →
                  </a>
                ) : (
                  <span className="text-[#6b7280] italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="space-y-8">
            {/* Student-specific Information */}
            {user.type === UserType.Student && !isEditing && (
              <>
                {/* Academic Information */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Academic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuGraduationCap size={14} /> Major
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.major || <span className="text-[#6b7280] italic">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <span>📅</span> Year
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.classLevel
                          ? user.classLevel.charAt(0).toUpperCase() + user.classLevel.slice(1).toLowerCase()
                          : <span className="text-[#6b7280] italic">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <span>🏫</span> School
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.school
                          ? user.school.charAt(0).toUpperCase() + user.school.slice(1).toLowerCase()
                          : <span className="text-[#6b7280] italic">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <span>🔬</span> Field of Interest
                      </div>
                      {Array.isArray(user.fieldOfInterest) && user.fieldOfInterest.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.fieldOfInterest.map((field, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#5b8ef4] rounded-full text-[#e8eaed] hover:bg-[#5b8ef4] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                              style={{ background: 'linear-gradient(135deg, rgba(91, 142, 244, 0.1), rgba(124, 58, 237, 0.1))' }}
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                          Not specified
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Projects
                  </h2>
                  {Array.isArray(user.projects) && user.projects.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.projects.map((project, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#5b8ef4] rounded-full text-[#e8eaed] hover:bg-[#5b8ef4] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(91, 142, 244, 0.1), rgba(124, 58, 237, 0.1))' }}
                        >
                          {project}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      No projects listed
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Technical Skills
                  </h2>
                  {Array.isArray(user.skills) && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold font-mono bg-[#1a1f2e] border border-[#5b8ef4] rounded-full text-[#e8eaed] hover:bg-[#5b8ef4] hover:text-white hover:-translate-y-0.5 transition-all cursor-default shadow-[0_4px_12px_rgba(91,142,244,0.3)]"
                          style={{ background: 'linear-gradient(135deg, rgba(91, 142, 244, 0.1), rgba(124, 58, 237, 0.1))' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>

                {/* Hobbies */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Hobbies & Interests
                  </h2>
                  {Array.isArray(user.hobbies) && user.hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#10b981] rounded-full text-[#e8eaed] hover:bg-[#10b981] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))' }}
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>

                {/* Companies of Interest */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Companies of Interest
                  </h2>
                  {Array.isArray(user.companiesOfInterest) && user.companiesOfInterest.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.companiesOfInterest.map((company, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#f59e0b] rounded-full text-[#e8eaed] hover:bg-[#f59e0b] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(239, 68, 68, 0.1))' }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Student Editing Mode */}
            {updatedUser.type === UserType.Student && isEditing && (
              <>
                {/* Academic Information - Edit Mode */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Academic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuGraduationCap size={14} /> Major
                      </label>
                      <input
                        type="text"
                        value={updatedUser.major}
                        placeholder="Enter your major"
                        onChange={(e) => handleInputChange("major", e.target.value)}
                        className="w-full px-3 py-3 bg-[#1a1f2e] rounded-lg border-2 border-[#2d3748] text-[#e8eaed] focus:outline-none focus:border-[#5b8ef4] transition-all"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <span>📅</span> Year
                      </label>
                      <Dropdown
                        id="year"
                        value={updatedUser.classLevel}
                        options={classLevelOptions}
                        placeholder="Select a year"
                        onChange={(e) => handleInputChange("classLevel", e.target.value)}
                        className="w-full border-2 border-[#2d3748] rounded-lg bg-[#1a1f2e] text-[#e8eaed] focus:border-[#5b8ef4]"
                        panelClassName="bg-[#1a1f2e] border-[#2d3748]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <span>🏫</span> School
                      </label>
                      <input
                        type="text"
                        value={updatedUser.school}
                        placeholder="Enter your school"
                        onChange={(e) => handleInputChange("school", e.target.value)}
                        className="w-full px-3 py-3 bg-[#1a1f2e] rounded-lg border-2 border-[#2d3748] text-[#e8eaed] focus:outline-none focus:border-[#5b8ef4] transition-all"
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Field Of Interest"
                        values={updatedUser.fieldOfInterest || []}
                        placeholder="Add a field of interest"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, fieldOfInterest: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Projects"
                        values={updatedUser.projects || []}
                        placeholder="Add a project"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, projects: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Skills"
                        values={updatedUser.skills || []}
                        placeholder="Add a skill"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, skills: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Hobbies"
                        values={updatedUser.hobbies || []}
                        placeholder="Add a hobby"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, hobbies: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Companies of Interest"
                        values={updatedUser.companiesOfInterest || []}
                        placeholder="Add a company of interest"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, companiesOfInterest: value }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Alumni-specific Information */}
            {user.type === UserType.Alumni && !isEditing && (
              <>
                {/* Professional Information */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Professional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuBuilding2 size={14} /> Company
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.company?.name || <span className="text-[#6b7280] italic">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuBriefcase size={14} /> Position
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.position || <span className="text-[#6b7280] italic">Not specified</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuShare2 size={14} /> Share Profile
                      </div>
                      <div className="text-lg text-[#e8eaed] font-medium px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748] hover:bg-[#252d3f] hover:border-[#5b8ef4] transition-all">
                        {user.shareProfile ? "Visible to students" : "Not shared with students"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizations */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Organizations
                  </h2>
                  {Array.isArray(user.organizations) && user.organizations.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.organizations.map((organization, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#f59e0b] rounded-full text-[#e8eaed] hover:bg-[#f59e0b] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(239, 68, 68, 0.1))' }}
                        >
                          {organization}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>

                {/* Specializations */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Specializations
                  </h2>
                  {Array.isArray(user.specializations) && user.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.specializations.map((specialization, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#7c3aed] rounded-full text-[#e8eaed] hover:bg-[#7c3aed] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(167, 139, 250, 0.1))' }}
                        >
                          {specialization}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Technical Skills
                  </h2>
                  {Array.isArray(user.skills) && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold font-mono bg-[#1a1f2e] border border-[#5b8ef4] rounded-full text-[#e8eaed] hover:bg-[#5b8ef4] hover:text-white hover:-translate-y-0.5 transition-all cursor-default shadow-[0_4px_12px_rgba(91,142,244,0.3)]"
                          style={{ background: 'linear-gradient(135deg, rgba(91, 142, 244, 0.1), rgba(124, 58, 237, 0.1))' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>

                {/* Hobbies */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748] hover:-translate-y-0.5 transition-all hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Hobbies & Interests
                  </h2>
                  {Array.isArray(user.hobbies) && user.hobbies.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {user.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-[#1a1f2e] border border-[#10b981] rounded-full text-[#e8eaed] hover:bg-[#10b981] hover:text-white hover:-translate-y-0.5 transition-all cursor-default"
                          style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))' }}
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg text-[#6b7280] italic px-3 py-3 bg-[#1a1f2e] rounded-lg border border-[#2d3748]">
                      Not specified
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Alumni Editing Mode */}
            {updatedUser.type === UserType.Alumni && isEditing && (
              <>
                {/* Professional Information - Edit Mode */}
                <div className="bg-[#1e2433] rounded-2xl p-8 shadow-2xl border border-[#2d3748]">
                  <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#5b8ef4] to-[#7c3aed] rounded"></div>
                    Professional Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuBuilding2 size={14} /> Company
                      </label>
                      <CompanyDropdown
                        value={updatedUser.company}
                        onChange={(e) =>
                          setUpdatedUser((prev) => {
                            return { ...prev, company: e.target.value };
                          })
                        }
                        className="w-full"
                        dropdownClassName="border-2 border-[#2d3748] rounded-lg bg-[#1a1f2e] text-[#e8eaed] focus:border-[#5b8ef4]"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuBriefcase size={14} /> Position
                      </label>
                      <input
                        type="text"
                        value={updatedUser.position}
                        placeholder="Enter your position"
                        onChange={(e) => handleInputChange("position", e.target.value)}
                        className="w-full px-3 py-3 bg-[#1a1f2e] rounded-lg border-2 border-[#2d3748] text-[#e8eaed] focus:outline-none focus:border-[#5b8ef4] transition-all"
                      />
                    </div>

                    <div className="col-span-full">
                      <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuShare2 size={14} /> Share Profile
                      </label>
                      <div className="flex items-center mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={updatedUser.shareProfile}
                            className="w-5 h-5 text-[#5b8ef4] border-[#2d3748] rounded focus:ring-[#5b8ef4] focus:ring-2"
                            onChange={(e) =>
                              handleInputChange("shareProfile", e.target.checked)
                            }
                          />
                          <span className="ml-3 text-[#e8eaed]">
                            Make my profile visible to students
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Organizations"
                        values={updatedUser.organizations || []}
                        placeholder="Add an organization"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, organizations: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Specializations"
                        values={updatedUser.specializations || []}
                        placeholder="Add a specialization"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, specializations: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Skills"
                        values={updatedUser.skills || []}
                        placeholder="Add a skill"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, skills: value }))}
                      />
                    </div>

                    <div className="col-span-full">
                      <AddableCardList
                        label="Hobbies"
                        values={updatedUser.hobbies || []}
                        placeholder="Add a hobby"
                        maxItems={5}
                        onChange={(value) => setUpdatedUser(prev => ({ ...prev, hobbies: value }))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border-2 border-[#2d3748] text-[#e8eaed] rounded-lg hover:bg-[#252d3f] transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className={`px-6 py-3 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] text-white rounded-lg font-semibold transition-all ${
                    canSave
                      ? "hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(91,142,244,0.4)]"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!canSave}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;