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
import {
  Alumni,
  ClassLevel,
  Student,
  UpdateUserRequest,
  UserType,
} from "../types/User";
import { Dropdown } from "primereact/dropdown";
import CompanyDropdown from "../components/CompanyDropdown";

const Profile = () => {
  const classLevelOptions = Object.keys(ClassLevel).map((key) => ({
    label: key,
    value: ClassLevel[key as keyof typeof ClassLevel],
  }));

  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UpdateUserRequest>(
    user || { type: UserType.Student },
  );
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean>(true);
  const [isValidLinkedIn, setIsValidLinkedIn] = useState<boolean>(true);
  const [canSave, setCanSave] = useState<boolean>(true);

  useEffect(() => {
    setCanSave(isValidLinkedIn && isValidPhoneNumber);
  }, [isValidLinkedIn, isValidPhoneNumber]);

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
    });
  };

  const onEdit = () => {
    if (user) {
      setUpdatedUser(user);
      setIsEditing(true);
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
    const cleanedInput = input.replace(/\D/g, ""); // Remove non-digits

    let formattedNumber = "";

    if (cleanedInput.length > 0) {
      if (cleanedInput.length < 4) {
        formattedNumber = `(${cleanedInput}`;
      } else if (cleanedInput.length < 7) {
        formattedNumber = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(
          3,
        )}`;
      } else {
        formattedNumber = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(
          3,
          6,
        )}-${cleanedInput.slice(6, 10)}`;
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
    <div className="w-full h-full items-center pt-28">
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto border">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          {!isEditing && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <FiEdit size={18} />
              <span>Edit Profile</span>
            </button>
          )}
          {isEditing && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              disabled={!canSave}
            >
              <FiEdit size={18} />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-semibold">
                  {user.name
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
                  <p className="text-gray-800">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    User Type
                  </label>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          checked={updatedUser.type === UserType.Student}
                          onChange={(e) =>
                            handleInputChange(
                              "type",
                              e.target.checked
                                ? UserType.Student
                                : UserType.Alumni,
                            )
                          }
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Student</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          checked={updatedUser.type === UserType.Alumni}
                          onChange={(e) =>
                            handleInputChange(
                              "type",
                              e.target.checked
                                ? UserType.Alumni
                                : UserType.Student,
                            )
                          }
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Alumni</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-800">
                      {user.type === UserType.Student ? "Student" : "Alumni"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <div className="flex items-center gap-2">
                      <LuMail size={16} />
                      <span>Email</span>
                    </div>
                  </label>
                  <p className="text-gray-800">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <div className="flex items-center gap-2">
                      <FiPhone size={16} />
                      <span>Phone Number</span>
                    </div>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={updatedUser.phoneNumber}
                      placeholder="Add phone number"
                      className={`w-full p-2 border-2 focus:border-blue-500 focus:outline-none rounded-md ${
                        isValidPhoneNumber
                          ? "border-gray-300"
                          : "border-red-600"
                      }`}
                      onChange={onPhoneNumberChanged}
                    />
                  ) : (
                    <p className="text-gray-800">
                      {user.phoneNumber || "Not provided"}
                    </p>
                  )}
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
              {isEditing ? (
                <input
                  type="url"
                  value={updatedUser.linkedIn}
                  placeholder="Add LinkedIn profile"
                  className={`w-full p-2 border-2 rounded-md focus:border-blue-500 focus:outline-none ${
                    isValidLinkedIn ? "border-gray-300" : "border-red-600"
                  }`}
                  onChange={onLinkedInChanged}
                />
              ) : user.linkedIn ? (
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.linkedIn}
                </a>
              ) : (
                <p className="text-gray-600">Not provided</p>
              )}
            </div>

            {/* Student-specific Information */}
            {user.type === UserType.Student && !isEditing && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <div className="flex items-center gap-2">
                        <LuGraduationCap size={16} />
                        <span>Major</span>
                      </div>
                    </label>
                    <p className="text-gray-800">
                      {user.major || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <span>Year</span>
                    </label>
                    <p className="text-gray-800">
                      {user.classLevel
                        ? user.classLevel.charAt(0).toUpperCase() +
                          user.classLevel.slice(1).toLowerCase()
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {updatedUser.type === UserType.Student && isEditing && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <div className="flex items-center gap-2">
                        <LuGraduationCap size={16} />
                        <span>Major</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={updatedUser.major}
                      placeholder="Enter your major"
                      onChange={(e) =>
                        handleInputChange("major", e.target.value)
                      }
                      className="w-full p-2 border-2 focus:outline-none focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <span>Year</span>
                    </label>
                    <Dropdown
                      id="year"
                      value={updatedUser.classLevel}
                      options={classLevelOptions}
                      placeholder="Select a year"
                      onChange={(e) =>
                        handleInputChange("classLevel", e.target.value)
                      }
                      className="w-full border-2 text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Alumni-specific Information */}
            {user.type === UserType.Alumni && !isEditing && (
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
                        {user.company?.name || "Not specified"}
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
                        {user.position || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-2">
                          <LuShare2 size={16} />
                          <span>Share Profile</span>
                        </div>
                      </label>
                      <p className="text-gray-800">
                        {user.shareProfile
                          ? "Visible to students"
                          : "Not shared with students"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {updatedUser.type === UserType.Alumni && isEditing && (
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
                      <CompanyDropdown
                        value={updatedUser.company}
                        onChange={(e) =>
                          setUpdatedUser((prev) => {
                            return { ...prev, company: e.target.value };
                          })
                        }
                        className="w-full px-1"
                        dropdownClassName="border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        buttonClassName="w-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        <div className="flex items-center gap-2">
                          <LuBriefcase size={16} />
                          <span>Position</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        value={updatedUser.position}
                        placeholder="Enter your position"
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        className="w-full p-2 border-2 focus:outline-none focus:border-blue-500 border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      <div className="flex items-center gap-2">
                        <LuShare2 size={16} />
                        <span>Share Profile</span>
                      </div>
                    </label>
                    <div className="flex items-center mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={updatedUser.shareProfile}
                          className="form-checkbox h-5 w-5 text-blue-600"
                          onChange={(e) =>
                            handleInputChange("shareProfile", e.target.checked)
                          }
                        />
                        <span className="ml-2 text-gray-700">
                          Make my profile visible to students
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className={`px-4 py-2 text-white rounded-md ${
                    canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300"
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
