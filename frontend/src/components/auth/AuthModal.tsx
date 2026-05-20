import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import Modal from "../public/Modal";
import {ClassLevel, CreateUserRequest, UserType, MajorType } from "../../types/User";
import { ProgressBar } from "primereact/progressbar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { FaLinkedin } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaCheck, FaXmark } from "react-icons/fa6";
import "../../styles/Dropdown.css";
import ProfileCompletion from "./ProfileCompletion";
import CompanyDropdown from "../company/CompanyDropdown";
import { parseErrorResponse } from "../../utils/errorHandler";

const AuthModal = () => {
  const {
    isProfileComplete,
    setIsProfileComplete,
    error,
    clearAuthError,
    createUser,
    user,
  } = useAuth();

  const [stage, setStage] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState<boolean>(true);
  const [isValidLinkedIn, setIsValidLinkedIn] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    _id: "",
    email: "",
    name: "",
    profilePicture: "",
    type: UserType.Student,

  });
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [skillsText, setSkillsText] = useState(
    newUser.skills?.join(", ") ?? ""
  );
  const [companiesOfInterestText, setCompaniesOfInterestText] = useState(
    newUser.companiesOfInterest?.join(", ") ?? ""
  );
  const [alumniCompaniesText, setAlumniCompaniesText] = useState(
    newUser.organizations?.join(", ") ?? ""
  );
  const [organizationsText, setOrganizationsText] = useState(
    newUser.organizations?.join(", ") ?? ""
  );
  const [hobbiesText, setHobbiesText] = useState(
    newUser.hobbies?.join(", ") ?? ""
  ); 

  const toast = useRef<Toast>(null);

  const classLevelOptions = Object.keys(ClassLevel).map((key) => ({
    label: key,
    value: ClassLevel[key as keyof typeof ClassLevel],
  })); 

  const majorOptions = Object.keys(MajorType).map((key) => ({
    label: MajorType[key as keyof typeof MajorType],
    value: MajorType[key as keyof typeof MajorType],
  })); 

  useEffect(() => {
    if (user) {
      setNewUser((prevUser) => ({
        ...prevUser,
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      }));
    }
  }, [user]);

  const totalStages = 5;

  useEffect(() => {
    if (toast && error !== "") {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: parseErrorResponse(error),
        life: 3000,
      });
      setTimeout(() => clearAuthError(), 3000);
    }
  }, [toast, error, clearAuthError]);

  useEffect(() => {
    setCanProceed(
      (stage === 0 && selectedType !== null) ||
        (stage === 1 && isValidLinkedIn && isValidPhoneNumber) ||
        stage >= 2,
    );
  }, [stage, selectedType, isValidLinkedIn, isValidPhoneNumber]);

  const onSelectType = (type: UserType) => {
    setSelectedType(type);

    setNewUser(prev => ({
      ...prev,
      type,
      ...(type === UserType.Student
        ? { organizations: [], specializations: []}
        : {}),
      ...(type === UserType.Alumni
        ? { fieldOfInterest: [], projects: [], companiesOfInterest: [] }
        : {}),
    }));
  };


  const onLinkedInChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (input === "") {
      setNewUser((prev) => ({ ...prev, linkedIn: undefined }));
      setIsValidLinkedIn(true);
      return;
    }

    try {
      new URL(input);
      setIsValidLinkedIn(true);
    } catch {
      setIsValidLinkedIn(false);
    }

    setNewUser((prev) => ({ ...prev, linkedIn: input }));
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
      setNewUser((prev) => ({
        ...prev,
        phoneNumber: formattedNumber,
      }));
    } else {
      setNewUser((prev) => ({
        ...prev,
        phoneNumber: undefined,
      }));
    }

    setIsValidPhoneNumber(
      !(cleanedInput.length > 0 && cleanedInput.length < 10),
    );
  };

  const handleNewUserChange = (
    field: keyof CreateUserRequest,
    value: unknown,
  ) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };



  return (
    <div>
      <Modal
        isOpen={!isProfileComplete}
        disableClose={true}
        useOverlay={true}
        className="w-[70vh] h-[70vh] rounded-xl flex flex-col px-8 py-4 border"
        style={{ 
          background: '#1a1f2e',
          borderColor: '#2d3748'
        }}
      >
        {/* Complete Profile */}
        {stage !== totalStages && (
          <div className="w-full h-full flex flex-col">
            {/* Top gradient accent bar */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
              style={{
                background: 'linear-gradient(90deg, #5b8ef4, #7c3aed, #ec4899)',
              }}
            />

            <h1 className="text-2xl font-bold text-[#e8eaed] mt-2">Complete your profile</h1>

            {/* Progress Bar */}
            <div className="mt-5 mx-1">
              <ProgressBar
                className="h-3 border shadow-sm rounded-full overflow-hidden"
                style={{
                  background: '#141920',
                  borderColor: '#2d3748'
                }}
                value={((stage + 1) * 100) / totalStages}
                showValue={false}
                pt={{
                  value: {
                    style: {
                      background: 'linear-gradient(90deg, #5b8ef4, #7c3aed)',
                    }
                  }
                }}
              />
            </div>

            <div className="w-full h-[80%] flex items-center justify-center">
              {/* Type Selection */}
              {stage === 0 && (
                <div className="w-full flex items-center justify-center flex-col flex-1">
                  <h2 className="text-xl font-semibold mb-6 text-[#e8eaed]">
                    Are you a student or Alumni?
                  </h2>
                  <div className="flex gap-6 w-full mb-auto">
                    <button
                      onClick={() => onSelectType(UserType.Student)}
                      className={`flex-1 border-2 rounded-xl px-6 py-14 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Student
                          ? "bg-[#5b8ef4]/10 shadow-lg"
                          : "hover:bg-[#5b8ef4]/5"
                      }`}
                      style={{
                        borderColor: selectedType === UserType.Student ? '#5b8ef4' : '#2d3748',
                        boxShadow: selectedType === UserType.Student ? '0 4px 20px rgba(91,142,244,0.3)' : 'none'
                      }}
                    >
                      <img
                        src="/assets/studentLogo.png"
                        alt="Student"
                        className="w-16 h-16 mb-4"
                      />
                      <div className="font-medium text-lg text-[#e8eaed]">Student</div>
                    </button>

                    <button
                      onClick={() => onSelectType(UserType.Alumni)}
                      className={`flex-1 border-2 rounded-xl px-6 py-14 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Alumni
                          ? "bg-[#7c3aed]/10 shadow-lg"
                          : "hover:bg-[#7c3aed]/5"
                      }`}
                      style={{
                        borderColor: selectedType === UserType.Alumni ? '#7c3aed' : '#2d3748',
                        boxShadow: selectedType === UserType.Alumni ? '0 4px 20px rgba(124,58,237,0.3)' : 'none'
                      }}
                    >
                      <img
                        src="/assets/alumniLogo.png"
                        alt="Alumni"
                        className="w-16 h-16 mb-4"
                      />
                      <div className="font-medium text-lg text-[#e8eaed]">Alumni</div>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Contact Info */}
              {stage === 1 && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    {"Let's add your contact information!"}
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="linkedIn"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        LinkedIn URL (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FaLinkedin
                            size={22}
                            className={`${
                              newUser.linkedIn
                                ? "text-[#0077B5]"
                                : "text-[#4b5563]"
                            }`}
                          />
                        </div>
                        <input
                          type="url"
                          id="linkedIn"
                          className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                            isValidLinkedIn
                              ? "focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20"
                              : "border-[#f87171]"
                          }`}
                          style={{
                            background: '#141920',
                            borderColor: isValidLinkedIn ? '#2d3748' : '#f87171'
                          }}
                          placeholder="Add LinkedIn profile"
                          value={newUser.linkedIn || ""}
                          onChange={onLinkedInChanged}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiPhone
                            size={22}
                            className={`${
                              newUser.phoneNumber
                                ? "text-[#10b981]"
                                : "text-[#4b5563]"
                            }`}
                          />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          className={`block w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none text-[#e8eaed] placeholder-[#6b7280] transition-all ${
                            isValidPhoneNumber
                              ? "focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20"
                              : "border-[#f87171]"
                          }`}
                          style={{
                            background: '#141920',
                            borderColor: isValidPhoneNumber ? '#2d3748' : '#f87171'
                          }}
                          placeholder="Add phone number"
                          value={newUser.phoneNumber || ""}
                          onChange={onPhoneNumberChanged}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Info (Student) */}
              {stage === 2 && newUser.type === UserType.Student && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    Tell us about your education!
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="major"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Major (Optional)
                      </label>
                      <Dropdown
                        id="major"
                        value={newUser.major}
                        options={majorOptions}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            major: e.value,
                          }))
                        }
                        placeholder="Select your major"
                        className="w-full border-2 p-[2px] rounded-lg"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        panelClassName="dark-dropdown-panel"
                        filter
                        filterPlaceholder="Search majors..."
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="year"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Year (Optional)
                      </label>
                      <Dropdown
                        id="year"
                        value={newUser.classLevel}
                        options={classLevelOptions}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            classLevel: e.value,
                          }))
                        }
                        placeholder="Select a year"
                        className="w-full border-2 p-[2px] rounded-lg"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        panelClassName="dark-dropdown-panel"
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Select the year that best represents your current status
                      </p>
                    </div>

                    {/* Specialization*/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="specialization"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Specialization (Optional)
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. AI/ML, Systems, Product..."
                        value={newUser.fieldOfInterest?.[0] ?? ""}
                        onChange={(e) =>
                          handleNewUserChange(
                            "fieldOfInterest",
                            e.target.value ? [e.target.value] : [],
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Summary (Student) */}
              {stage === 3 && newUser.type === UserType.Student && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    Professional summary
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    {/* Skills */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="skills"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Skills (Optional)
                      </label>
                      <textarea
                        id="skills"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. Python, React, Systems Design..."
                        rows={3}
                        value={skillsText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setSkillsText(text);
                          handleNewUserChange(
                            "skills",
                            text
                              ? text.split(",").map(s => s.trim()).filter(Boolean)
                              : []
                          )
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate skills with commas.
                      </p>
                    </div>

                    {/* Companies of Interest */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="companiesOfInterest"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Companies of interest (Optional)
                      </label>
                      <textarea
                        id="companiesOfInterest"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. Google, NVIDIA, Cisco..."
                        rows={2}
                        value={companiesOfInterestText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setCompaniesOfInterestText(text);
                          handleNewUserChange(
                            "companiesOfInterest",
                            e.target.value
                              ? e.target.value.split(",").map(c => c.trim()).filter(Boolean)
                              : []
                          )
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate company names with commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tell us more about yourself (Student) */}
              {stage === 4 && newUser.type === UserType.Student && (
              <div className="flex flex-col items-center w-full flex-1">
                <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                  Tell us more about yourself
                </h2>
                <div className="w-full space-y-6 max-w-md">
                  {/* Organizations */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="organizations"
                      className="text-sm font-medium text-[#9ca3af] mb-2"
                    >
                      Organizations (Optional)
                    </label>
                    <textarea
                      id="organizations"
                      className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                      style={{
                        background: '#141920',
                        borderColor: '#2d3748'
                      }}
                      placeholder="e.g. IEEE, ACM, Robotics Club..."
                      rows={2}
                      value={organizationsText}
                      onChange={(e) => {
                        const text = e.target.value;
                        setOrganizationsText(text);

                        handleNewUserChange(
                          "organizations",
                          text
                            ? text
                                .split(",")
                                .map(o => o.trim())
                                .filter(Boolean)
                            : []
                        );
                      }}
                    />
                    <p className="text-xs text-[#6b7280] mt-2">
                      Separate organization names with commas.
                    </p>
                  </div>

                  {/* Hobbies */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="hobbies"
                      className="text-sm font-medium text-[#9ca3af] mb-2"
                    >
                      Hobbies (Optional)
                    </label>
                    <textarea
                      id="hobbies"
                      className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                      style={{
                        background: '#141920',
                        borderColor: '#2d3748'
                      }}
                      placeholder="e.g. Hiking, Guitar, Chess..."
                      rows={2}
                      value={hobbiesText}
                      onChange={(e) => {
                        const text = e.target.value;
                        setHobbiesText(text);

                        handleNewUserChange(
                          "hobbies",
                          text
                            ? text
                                .split(",")
                                .map(h => h.trim())
                                .filter(Boolean)
                            : []
                        );
                      }}
                    />
                    <p className="text-xs text-[#6b7280] mt-2">
                      Separate hobbies with commas.
                    </p>
                  </div>
                </div>
              </div>
            )}

              {/* Professional Info (Alumni) */}
              {stage === 2 && newUser.type === UserType.Alumni && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    Professional Information
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="company"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Company (Optional)
                      </label>
                      <CompanyDropdown
                        value={newUser.company}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            company: e.value,
                          }))
                        }
                        className="w-full"
                        dropdownClassName="w-full border-2 p-[2px] rounded-lg"
                        buttonClassName="w-12"
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        {
                          "Can't find your company? Add it to Opportune after completing your profile!"
                        }
                      </p>
                    </div>

                    {newUser.company && (
                      <div className="flex flex-col">
                        <label
                          htmlFor="position"
                          className="text-sm font-medium text-[#9ca3af] mb-2"
                        >
                          Position (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="position"
                            className="block w-full pl-3 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all"
                            style={{
                              background: '#141920',
                              borderColor: '#2d3748'
                            }}
                            placeholder="Enter your position"
                            value={newUser.position || ""}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                position: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-[#9ca3af] mb-3">
                        Share your profile with students?
                      </label>
                      <div className="flex gap-4">
                        <button
                          className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center transition-all ${
                            newUser.shareProfile === true
                              ? "bg-[#10b981]/10"
                              : "hover:bg-[#10b981]/5"
                          }`}
                          style={{
                            borderColor: newUser.shareProfile === true ? '#10b981' : '#2d3748',
                            boxShadow: newUser.shareProfile === true ? '0 2px 10px rgba(16,185,129,0.2)' : 'none'
                          }}
                          onClick={() =>
                            setNewUser((prev) => ({
                              ...prev,
                              shareProfile: true,
                            }))
                          }
                          type="button"
                        >
                          <FaCheck className="mr-2.5 text-[#10b981]" />
                          <span className="text-[#e8eaed]">Yes</span>
                        </button>
                        <button
                          className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center transition-all ${
                            newUser.shareProfile === false
                              ? "bg-[#f87171]/10"
                              : "hover:bg-[#f87171]/5"
                          }`}
                          style={{
                            borderColor: newUser.shareProfile === false ? '#f87171' : '#2d3748',
                            boxShadow: newUser.shareProfile === false ? '0 2px 10px rgba(248,113,113,0.2)' : 'none'
                          }}
                          onClick={() =>
                            setNewUser((prev) => ({
                              ...prev,
                              shareProfile: false,
                            }))
                          }
                          type="button"
                        >
                          <FaXmark className="mr-2.5 text-[#f87171]" />
                          <span className="text-[#e8eaed]">No</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#6b7280] mt-2">
                        If yes, students will be able to view your profile and
                        connect with you for mentorship or networking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Summary (Alumni) */}
              {stage === 3 && newUser.type === UserType.Alumni && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    Professional summary
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    {/* Work Experience Companies */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="alumni-companies"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Companies you&apos;ve worked at (Optional)
                      </label>
                      <textarea
                        id="alumni-companies"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. Google, NVIDIA, Cisco..."
                        rows={2}
                        value={alumniCompaniesText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setAlumniCompaniesText(text);
                          handleNewUserChange(
                            "organizations",
                            text
                              ? text.split(",").map(c => c.trim()).filter(Boolean)
                              : []
                          );
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate company names with commas.
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="alumni-skills"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Skills (Optional)
                      </label>
                      <textarea
                        id="alumni-skills"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. Backend, Kubernetes, Leadership..."
                        rows={3}
                        value={skillsText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setSkillsText(text);
                          handleNewUserChange(
                            "skills",
                            text
                              ? text.split(",").map(s => s.trim()).filter(Boolean)
                              : []
                          );
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate skills with commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* More about you (Alumni) */}
              {stage === 4 && newUser.type === UserType.Alumni && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8 text-[#e8eaed]">
                    More about you
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    {/* Organizations */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="alumni-organizations"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Organizations (Optional)
                      </label>
                      <textarea
                        id="alumni-organizations"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. IEEE, ACM, ERG groups, community orgs..."
                        rows={2}
                        value={organizationsText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setOrganizationsText(text);
                          handleNewUserChange(
                            "organizations",
                            text
                              ? text
                                  .split(",")
                                  .map(o => o.trim())
                                  .filter(Boolean)
                              : []
                          );
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate organization names with commas.
                      </p>
                    </div>

                    {/* Hobbies */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="alumni-hobbies"
                        className="text-sm font-medium text-[#9ca3af] mb-2"
                      >
                        Hobbies (Optional)
                      </label>
                      <textarea
                        id="alumni-hobbies"
                        className="block w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#5b8ef4] focus:ring-2 focus:ring-[#5b8ef4]/20 text-[#e8eaed] placeholder-[#6b7280] transition-all resize-none"
                        style={{
                          background: '#141920',
                          borderColor: '#2d3748'
                        }}
                        placeholder="e.g. Hiking, Guitar, Chess..."
                        rows={2}
                        value={hobbiesText}
                        onChange={(e) => {
                          const text = e.target.value;
                          setHobbiesText(text);
                          handleNewUserChange(
                            "hobbies",
                            text
                              ? text
                                  .split(",")
                                  .map(h => h.trim())
                                  .filter(Boolean)
                              : []
                          );
                        }}
                      />
                      <p className="text-xs text-[#6b7280] mt-2">
                        Separate hobbies with commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className={`w-24 px-4 py-2 rounded-md font-medium transition-all ${
                  stage === 0
                    ? "text-[#4b5563] cursor-not-allowed"
                    : "text-[#e8eaed] hover:bg-[#2d3748]"
                }`}
                style={{
                  background: stage === 0 ? '#141920' : '#1e2433',
                  border: '1px solid #2d3748'
                }}
                onClick={() => setStage(stage - 1)}
                disabled={stage === 0}
              >
                Previous
              </button>
              <button
                className={`w-24 px-4 py-2 rounded-md text-white font-medium transition-all ${
                  canProceed ? "hover:-translate-y-0.5" : "cursor-not-allowed opacity-50"
                }`}
                style={{
                  background: canProceed 
                    ? 'linear-gradient(135deg, #5b8ef4, #7c3aed)' 
                    : '#2d3748',
                  boxShadow: canProceed ? '0 4px 14px rgba(91,142,244,0.3)' : 'none'
                }}
                onClick={async () => {
                  if (stage === totalStages - 1) {
                    const response = await createUser(newUser);
                    console.log("create user response", response);  

                    if (response.success) {
                      setStage(totalStages);
                    }
                  } else {
                    setStage(stage + 1);
                  }
                }}
                disabled={!canProceed}
              >
                {stage === totalStages - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {stage === totalStages && (
          <ProfileCompletion
            onConfirm={() => {
              setIsProfileComplete(true);
              setStage(0);
            }}
          />
        )}
      </Modal>
      <Toast ref={toast} />
    </div>
  );
};

export default AuthModal;