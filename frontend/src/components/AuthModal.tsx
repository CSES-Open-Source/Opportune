import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import Modal from "./Modal";
import { ClassLevel, CreateUserRequest, UserType } from "../types/User";
import { ProgressBar } from "primereact/progressbar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { FaLinkedin } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaCheck, FaXmark } from "react-icons/fa6";
import "../styles/Dropdown.css";
import ProfileCompletion from "./ProfileCompletion";

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
  const totalStages = 3;
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [newUser, setNewUser] = useState<CreateUserRequest>({
    _id: "",
    email: "",
    name: "",
    type: UserType.Student,
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
      }));
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

  const onSelectType = (type: UserType) => {
    setSelectedType(type);
    if (type === UserType.Student) {
      setNewUser({ ...newUser, type, company: undefined, shareProfile: false });
    } else if (type === UserType.Alumni) {
      setNewUser({ ...newUser, type, major: undefined, classLevel: undefined });
    } else {
      setNewUser({ ...newUser, type });
    }
  };

  return (
    <div>
      <Modal
        isOpen={!isProfileComplete}
        disableClose={true}
        useOverlay={true}
        className="w-[75vh] h-[55vh] rounded-xl flex flex-col px-8 py-4"
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

            <div className="w-full h-[70%] flex items-center justify-center">
              {/* Type */}
              {stage === 0 && (
                <div className="w-full flex items-center justify-center flex-col flex-1">
                  <h2 className="text-xl font-semibold mb-6">
                    Are you a student or Alumni?
                  </h2>
                  <div className="flex gap-6 w-full mb-auto">
                    <button
                      onClick={() => onSelectType(UserType.Student)}
                      className={`flex-1 border-2 rounded-lg px-6 py-10 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Student
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="text-3xl mb-4">📓</div>
                      <div className="font-medium text-lg">Student</div>
                    </button>
                    <button
                      onClick={() => onSelectType(UserType.Alumni)}
                      className={`flex-1 border-2 rounded-lg px-6 py-10 flex flex-col items-center justify-center transition-all ${
                        selectedType === UserType.Alumni
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="text-3xl mb-4">🎓</div>
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
                          className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={newUser.linkedIn || ""}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              linkedIn: e.target.value,
                            }))
                          }
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
                          className="block w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="(555) 123-4567"
                          value={newUser.phoneNumber || ""}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
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
                      <Dropdown
                        id="company"
                        value={newUser.company}
                        options={[]}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            company: e.value,
                          }))
                        }
                        placeholder="Select your company"
                        className="border-2 p-[2px] border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        filter
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
                            placeholder="Software Engineer"
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
                  selectedType !== null
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300"
                }`}
                onClick={() => {
                  if (stage === totalStages - 1) {
                    createUser(newUser).then((response) => {
                      if (response.success) {
                        setStage(totalStages);
                      }
                    });
                  } else {
                    setStage(stage + 1);
                  }
                }}
                disabled={selectedType === null}
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
            }}
          />
        )}
      </Modal>
      <Toast ref={toast} />
    </div>
  );
};

export default AuthModal;
