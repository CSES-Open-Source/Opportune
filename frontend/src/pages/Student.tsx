import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLinkedin
} from "react-icons/fa";
import { LuMail, LuWand, LuGraduationCap } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";
import { generateEmail } from "../api/email";
import { useAuth } from "../contexts/useAuth";
import Modal from "../components/public/Modal";
import { getStudentById, getSimilarities } from "../api/users";
import { APIResult } from "../api/requests";
import { Student } from "../types/User";
import { ProgressSpinner } from "primereact/progressspinner";
import { Similarity } from "../types/Similarity";
import { Toast } from "primereact/toast";

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);
  console.log("route param id: ", id);
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [similarities, setSimilarities] = useState<Similarity[] | null>(null);
  const [similaritySummary, setSimilaritySummary] = useState<string | null>(null);
  const [similarityLoading, setSimilarityLoading] = useState(false);

  // Email Generation State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [purpose, setPurpose] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [sharedInterests, setSharedInterests] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user?._id || !id) return;
    setGenerating(true);
    setGeneratedEmail("");

    const result = await generateEmail({
      studentId: user._id,
      alumniId: id, // In this case, another student
      tone,
      purpose
    });

    if (result.success) {
      setGeneratedEmail(result.data.email);
      setSharedInterests(result.data.sharedInterests);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: result.error || "Failed to generate email"
      });
    }
    setGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.current?.show({
      severity: "success",
      summary: "Copied",
      detail: "Email text copied to clipboard"
    });
  };

  const handleStudentUpdate = useCallback(() => {
    if (!id) return;
    setLoading(true);
    getStudentById(id)
      .then((result: APIResult<Student>) => {
        if (result.success) {
          setStudent(result.data);
        } else {
          toast.current?.clear();
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch student profile: " + result.error,
          });
        }
      })
      .catch(() => toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Unexpected error occurred.",
      }))
      .finally(() => setLoading(false));
  }, [id]);

  // Initial company fetch
  useEffect(() => {
    handleStudentUpdate();
  }, [handleStudentUpdate]);

  const resolveUserId = (): string | null => {
    if (user) {
      return user._id ?? null;
    }
    return null;
  };

  const fetchSimilarities = async () => {
    if (!id) return;

    const userId = resolveUserId();
    if (!userId) {
      return;
    }

    try {
      setSimilarityLoading(true);
      const res = await getSimilarities(userId, id);

      if (!res.success) {
        throw new Error("Failed to fetch similarities");
      }

      setSimilarities(res.data.similarities);
      setSimilaritySummary(res.data.summary);
    } finally {
      setSimilarityLoading(false);
    }
  };


  if (!student)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Student not found.
      </div>
    );

  return (
    <div>
      {!student ? (
        <div className="min-h-screen flex items-center justify-center text-red-800 text-lg">
          Student not found.
        </div>
      ) : (
        <>
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
                        {student.profilePicture ? (
                          <img
                            src={student.profilePicture}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 text-3xl font-semibold">
                            {student.name
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
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Basic Information
                          </h2>
                          <button
                            onClick={() => setIsEmailModalOpen(true)}
                            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition"
                          >
                            <LuWand className="w-3.5 h-3.5" />
                            <span>Personalize Email</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Full Name
                            </label>
                            <p className="text-gray-800">{student.name}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              <div className="flex items-center gap-2">
                                <LuMail size={16} />
                                <span>Email</span>
                              </div>
                            </label>
                            <p className="text-gray-800">{student.email}</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              <div className="flex items-center gap-2">
                                <FiPhone size={16} />
                                <span>Phone Number</span>
                              </div>
                            </label>
                            <p className="text-gray-800">
                              {student.phoneNumber || "Not provided"}
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
                        {student.linkedIn ? (
                          <a
                            href={student.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {student.linkedIn}
                          </a>
                        ) : (
                          <p className="text-gray-600">Not provided</p>
                        )}
                      </div>


                      {/* Student-specific Information */}
                      <div>
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
                                {student.major || "Not specified"}
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Year</span>
                              </label>
                              <p className="text-gray-800">
                                {student.classLevel
                                  ? student.classLevel.charAt(0).toUpperCase() +
                                  student.classLevel.slice(1).toLowerCase()
                                  : "Not specified"}
                              </p>
                            </div>

                            {/* School */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>School</span>
                              </label>
                              <p className="text-gray-800">
                                {student.school
                                  ? student.school.charAt(0).toUpperCase() +
                                  student.school.slice(1).toLowerCase()
                                  : "Not specified"}
                              </p>
                            </div>
                            {/* Field of Interest */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Field of Interest</span>
                              </label>
                              {Array.isArray(student.fieldOfInterest) && student.fieldOfInterest.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {student.fieldOfInterest.map((field, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                    >
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-800">Not specified</p>
                              )}
                            </div>
                            {/* Projects */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Projects</span>
                              </label>
                              {Array.isArray(student.projects) && student.projects.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {student.projects.map((project, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                    >
                                      {project}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-800">Not specified</p>
                              )}
                            </div>
                            {/* These next two are technically user specific but this will be dealt with during the redesign
                            Hobbies */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Hobbies</span>
                              </label>
                              {Array.isArray(student.hobbies) && student.hobbies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {student.hobbies.map((hobby, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                    >
                                      {hobby}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-800">Not specified</p>
                              )}
                            </div>
                            {/* Skills */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Skills</span>
                              </label>
                              {Array.isArray(student.skills) && student.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {student.skills.map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-800">Not specified</p>
                              )}
                            </div>
                            {/* Companies of Interest */}
                            <div>
                              <label className="block text-sm font-medium text-gray-500 mb-1">
                                <span>Companies of Interest</span>
                              </label>
                              {Array.isArray(student.companiesOfInterest) && student.companiesOfInterest.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {student.companiesOfInterest.map((companiesOfInterest, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-md"
                                    >
                                      {companiesOfInterest}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-800">Not specified</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Similarities section */}
                        <div className="mt-6 flex flex-col gap-3">
                          <button
                            onClick={fetchSimilarities}
                            disabled={similarityLoading}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
                          >
                            {similarityLoading ? "Finding similarities..." : "Find similarities"}
                          </button>

                          {similarities && (
                            <div className="mt-4">
                              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                Similarities
                              </h2>
                              <ul className="list-disc list-inside space-y-1">
                                {similarities.map((sim, idx) => (
                                  <li key={idx}>
                                    <span className="font-medium">{sim.category}:</span>{" "}
                                    {sim.description}
                                  </li>
                                ))}
                              </ul>

                              {similaritySummary && (
                                <p className="mt-3 text-gray-700">{similaritySummary}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Email Generation Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        className="w-full max-w-2xl p-6 rounded-xl"
        useOverlay
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LuWand className="text-blue-600" />
            Personalize Email
          </h2>
          <p className="text-gray-600">
            Generate a personalized outreach email to {student?.name} based on your shared interests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Enthusiastic">Enthusiastic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose (Optional)</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Ask for resume advice"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${generating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
          >
            {generating ? "Generating..." : "Generate Draft"}
          </button>

          {generatedEmail && (
            <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Generated Draft</span>
                <button
                  onClick={copyToClipboard}
                  className="text-gray-500 hover:text-blue-600 transition"
                  title="Copy to clipboard"
                >
                  <FaRegCopy size={16} />
                </button>
              </div>
              <textarea
                readOnly
                value={generatedEmail}
                className="w-full h-48 bg-white p-3 rounded-lg border border-gray-200 text-gray-700 text-sm resize-none focus:outline-none"
              />
              {sharedInterests.length > 0 && (
                <div className="mt-3 text-xs text-green-700 bg-green-50 p-2 rounded-lg border border-green-100 flex gap-2 items-start">
                  <span className="font-semibold whitespace-nowrap">Shared Interests found:</span>
                  <span>{sharedInterests.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      <Toast ref={toast} />
    </div >
  );
};

export default StudentProfile;