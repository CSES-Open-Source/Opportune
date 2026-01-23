import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import Modal from "../public/Modal";
import { Alumni, Student, UpdateUserRequest, ClassLevel, CreateUserRequest, UserType } from "../../types/User";
import { ProgressBar } from "primereact/progressbar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { FaLinkedin } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaCheck, FaXmark } from "react-icons/fa6";
import "../../styles/Dropdown.css";
import ProfileCompletion from "./ProfileCompletion";
import CompanyDropdown from "../company/CompanyDropdown";

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
  const totalStages = 5;
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
  const [organizationsText, setOrganizationsText] = useState(
    newUser.organizations?.join(", ") ?? ""
  );
  const [hobbiesText, setHobbiesText] = useState(
    newUser.hobbies?.join(", ") ?? ""
  ); 

  const [studentProfile, setStudentProfile] = useState<{ userId: string }>({
    userId: "",
  });

  const [alumniProfile, setAlumniProfile] = useState<{ userId: string }>({
    userId: "",
  });

  const toast = useRef<Toast>(null);

  const classLevelOptions = Object.keys(ClassLevel).map((key) => ({
    label: key,
    value: ClassLevel[key as keyof typeof ClassLevel],
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

      setStudentProfile({userId: user._id}); 
      setAlumniProfile({userId: user._id}); 
    }
  }, [user]);

  useEffect(() => {
    if (toast && error !== "") {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error,
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

  const onFinishSignup = async () => {
    if (!selectedType) return;

    const response = await createUser(newUser);
    if (!response?.success || !user?._id) return;

    if (selectedType === UserType.Student) {
      saveStudentProfile();
    }

    if (selectedType === UserType.Alumni) {
      saveAlumniProfile();
    }
  };

  const saveStudentProfile = () => {
    fetch("/api/profile/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentProfile),
    })
      .then(res => res.json())
      .then(data => {
        setStudentProfile(data);
        console.log("created student profile", data);
      });
  };

  const saveAlumniProfile = () => {
    fetch("/api/profile/alumni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumniProfile),
    })
      .then(res => res.json())
      .then(data => {
        setAlumniProfile(data);
        console.log("created alumni profile", data);
      });
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
        className="w-[70vh] h-[70vh] rounded-xl flex flex-col px-8 py-4"
      >
        {/* Complete Profile */}
        {stage !== totalStages && (
          <div className="w-full h-full flex flex-col">
            <h1 className="text-2xl font-bold">Complete your profile</h1>

            {/* Progress Bar */}
            <ProgressBar
              color="#2563eb"
              className="h-3 mt-5 mx-1 border shadow-sm rounded-full"
              value={((stage + 1) * 100) / totalStages}
              showValue={false}
            ></ProgressBar>

            <div className="w-full h-[80%] flex items-center justify-center">
              {/* Type */}
              {stage === 0 && (
                <div className="w-full flex items-center justify-center flex-col flex-1">
                  <h2 className="text-xl font-semibold mb-6">
                    Are you a student or Alumni?
                  </h2>
                  <div className="flex gap-6 w-full mb-auto">
                    <button
                      onClick={() => onSelectType(UserType.Student)}
                      className={`flex-1 border-2 rounded-lg px-6 py-14 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Student
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <img
                        src="/assets/studentLogo.png"
                        alt="Student"
                        className="w-16 h-16 mb-4"
                      />
                      <div className="font-medium text-lg">Student</div>
                    </button>

                    <button
                      onClick={() => onSelectType(UserType.Alumni)}
                      className={`flex-1 border-2 rounded-lg px-6 py-14 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Alumni
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <img
                        src="/assets/alumniLogo.png"
                        alt="Alumni"
                        className="w-16 h-16 mb-4"
                      />
                      <div className="font-medium text-lg">Alumni</div>
                    </button>
                  </div>
                </div>
              )}
              {/* Contact Info */}
              {stage === 1 && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8">
                    {"Let's add your contact information!"}
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="linkedIn"
                        className="text-sm font-medium text-gray-700 mb-1"
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
                                : "text-gray-300"
                            }`}
                          />
                        </div>
                        <input
                          type="url"
                          id="linkedIn"
                          className={`block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none ${
                            isValidLinkedIn
                              ? "focus:border-blue-500"
                              : "border-red-600"
                          }`}
                          placeholder="Add LinkedIn profile"
                          value={newUser.linkedIn || ""}
                          onChange={onLinkedInChanged}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="phoneNumber"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiPhone
                            size={22}
                            className={`${
                              newUser.phoneNumber
                                ? "text-green-600"
                                : "text-gray-300"
                            }`}
                          />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          className={`block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none ${
                            isValidPhoneNumber
                              ? "focus:border-blue-500"
                              : "border-red-600"
                          }`}
                          placeholder="Add phone number"
                          value={newUser.phoneNumber || ""}
                          onChange={onPhoneNumberChanged}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Education Info */}
              {stage === 2 && newUser.type === UserType.Student && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8">
                    Tell us about your education!
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="major"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Major (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="major"
                          className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Computer Science"
                          value={newUser.major || ""}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              major: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="year"
                        className="text-sm font-medium text-gray-700 mb-1"
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
                        className="w-full border-2 p-[2px] border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Select the year that best represents your current status
                      </p>
                    </div>

                    {/* Specialization*/}
                    <div className="flex flex-col">
                      <label
                        htmlFor="specialization"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Specialization (Optional)
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                  <h2 className="text-xl font-semibold mb-8">
                    Professional summary
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    {/* Skills */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="skills"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Skills (Optional)
                      </label>
                      <textarea
                        id="skills"
                        className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                      <p className="text-xs text-gray-500 mt-1">
                        Separate skills with commas.
                      </p>
                    </div>

                    {/* Companies of Interest */}
                    <div className="flex flex-col">
                      <label
                        htmlFor="companiesOfInterest"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        Companies of interest (Optional)
                      </label>
                      <textarea
                        id="companiesOfInterest"
                        className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                      <p className="text-xs text-gray-500 mt-1">
                        Separate company names with commas.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tell us more about yourself (Student) */}
              {stage === 4 && newUser.type === UserType.Student && (
              <div className="flex flex-col items-center w-full flex-1">
                <h2 className="text-xl font-semibold mb-8">
                  Tell us more about yourself
                </h2>
                <div className="w-full space-y-6 max-w-md">
                  {/* Organizations */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="organizations"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      Organizations (Optional)
                    </label>
                    <textarea
                      id="organizations"
                      className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                    <p className="text-xs text-gray-500 mt-1">
                      Separate organization names with commas.
                    </p>
                  </div>

                  {/* Hobbies */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="hobbies"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      Hobbies (Optional)
                    </label>
                    <textarea
                      id="hobbies"
                      className="block w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                    <p className="text-xs text-gray-500 mt-1">
                      Separate hobbies with commas.
                    </p>
                  </div>
                </div>
              </div>
            )}

              {/* Professional Info */}
              {stage === 2 && newUser.type === UserType.Alumni && (
                <div className="flex flex-col items-center w-full flex-1">
                  <h2 className="text-xl font-semibold mb-8">
                    Professional Information
                  </h2>
                  <div className="w-full space-y-6 max-w-md">
                    <div className="flex flex-col">
                      <label
                        htmlFor="company"
                        className="text-sm font-medium text-gray-700 mb-1"
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
                        dropdownClassName="w-full border-2 p-[2px] border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        buttonClassName="w-12"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {
                          "Can't find your company? Add it to Opportune after completing your profile!"
                        }
                      </p>
                    </div>

                    {newUser.company && (
                      <div className="flex flex-col">
                        <label
                          htmlFor="position"
                          className="text-sm font-medium text-gray-700 mb-1"
                        >
                          Position (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="position"
                            className="block w-full pl-3 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                      <label className="text-sm font-medium text-gray-700 mb-3">
                        Share your profile with students?
                      </label>
                      <div className="flex gap-4">
                        <button
                          className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center transition-all ${
                            newUser.shareProfile === true
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                          onClick={() =>
                            setNewUser((prev) => ({
                              ...prev,
                              shareProfile: true,
                            }))
                          }
                          type="button"
                        >
                          <FaCheck className="mr-2.5" />
                          Yes
                        </button>
                        <button
                          className={`flex-1 border-2 rounded-lg p-4 flex items-center justify-center transition-all ${
                            newUser.shareProfile === false
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                          onClick={() =>
                            setNewUser((prev) => ({
                              ...prev,
                              shareProfile: false,
                            }))
                          }
                          type="button"
                        >
                          <FaXmark className="mr-2.5" />
                          No
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        If yes, students will be able to view your profile and
                        connect with you for mentorship or networking.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className={`w-24 px-4 py-2 bg-gray-100 rounded-md ${
                  stage === 0
                    ? "text-gray-200"
                    : "text-gray-600 hover:bg-gray-200"
                } font-medium transition-colors`}
                onClick={() => setStage(stage - 1)}
                disabled={stage === 0}
              >
                Previous
              </button>
              <button
                className={`w-24 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  canProceed ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300"
                }`}
                onClick={async () => {
                  if (stage === totalStages - 1) {
                    const response = await createUser(newUser);
                    console.log("create user response", response);  

                    if (response.success && user?._id) {
                      if (newUser.type === UserType.Student) {
                        setStudentProfile({ ...studentProfile, userId: user._id });
                        await saveStudentProfile();
                      } else if (newUser.type === UserType.Alumni) {
                        setAlumniProfile({ ...alumniProfile, userId: user._id });
                        await saveAlumniProfile();
                      }
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
