import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLinkedin,
  FaRobot
} from "react-icons/fa";
import { LuMail, LuBuilding2, LuBriefcase, LuWand, LuSparkles } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";
import { generateEmail } from "../api/email";
import { useAuth } from "../contexts/useAuth";
import Modal from "../components/public/Modal";
import { getAlumniById, getSimilarities } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { ProgressSpinner } from "primereact/progressspinner";
import { Similarity } from "../types/Similarity";
import {Toast} from "primereact/toast";
import { parseErrorResponse } from "../utils/errorHandler";
import "../styles/Animations.css";

const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const { user } = useAuth();

  const [similarities, setSimilarities] = useState<Similarity[] | null>(null);
  const [similaritySummary, setSimilaritySummary] = useState<string | null>(null);
  const [similarityLoading, setSimilarityLoading] = useState(false);
  const [showSimilarities, setShowSimilarities] = useState(false);

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
      alumniId: id,
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
        detail: parseErrorResponse(result.error),
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

  const handleAlumniUpdate = useCallback(() => {
    if (!id) return;
    setLoading(true);
    getAlumniById(id)
      .then((result: APIResult<Alumni>) => {
        if (result.success) {
          setAlumni(result.data);
        } else {
          toast.current?.clear();
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch alumni: " + parseErrorResponse(result.error),
          });
          console.log(error);
        }
      })
      .catch((error: unknown) => toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to fetch alumni: " + parseErrorResponse(error),
      }))
      .finally(() => setLoading(false));
  }, [id, error]);

  useEffect(() => {
    handleAlumniUpdate();
  }, [handleAlumniUpdate]);

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
      setShowSimilarities(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSimilarityLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
        <ProgressSpinner className="h-16 w-16" strokeWidth="3" style={{ color: "#5b8ef4" }} />
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
        <p className="text-[#9ca3af]">Alumni not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ background: '#1a1f2e', borderColor: '#2d3748' }}>
        <button
          onClick={() => navigate("/connect")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#9ca3af] hover:text-[#e8eaed] transition-all hover:-translate-x-1"
          style={{ background: "rgba(91,142,244,0.08)", border: "1px solid rgba(91,142,244,0.2)" }}
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Connect</span>
        </button>

        <button
          onClick={() => setIsEmailModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
            boxShadow: "0 4px 14px rgba(236,72,153,0.3)",
          }}
        >
          <LuWand className="w-4 h-4" />
          Personalize Email
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Profile Header */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] animate-fadeIn">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#8b5cf6] flex-shrink-0">
              {alumni.profilePicture ? (
                <img
                  src={alumni.profilePicture}
                  alt={alumni.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] text-white text-3xl font-bold">
                  {alumni.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#e8eaed] mb-4">{alumni.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
                    <LuMail size={14} /> Email
                  </div>
                  <p className="text-[#e8eaed]">{alumni.email}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
                    <FiPhone size={14} /> Phone
                  </div>
                  <p className="text-[#e8eaed]">{alumni.phoneNumber || <span className="text-[#6b7280] italic">Not provided</span>}</p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="mt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <FaLinkedin size={14} /> LinkedIn
                </div>
                {alumni.linkedIn ? (
                  <a
                    href={alumni.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#ec4899] hover:text-[#f472b6] font-semibold transition-all hover:gap-3 px-3 py-2 bg-[#151220] rounded-lg border border-[#ec4899] hover:border-[#f472b6]"
                  >
                    View Profile →
                  </a>
                ) : (
                  <div className="text-sm px-3 py-2 bg-[#151220] rounded-lg border border-[#ec4899] inline-block">
                    <span className="text-[#6b7280] italic">Not provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] hover-lift transition-smooth animate-slideInRight delay-100">
          <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded"></div>
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBuilding2 size={14} /> Company
              </div>
              <div className="text-lg text-[#e8eaed] font-medium px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6] hover:bg-[#1a1625] hover:border-[#a78bfa] transition-all">
                {alumni.company?.name || <span className="text-[#6b7280] italic">Not specified</span>}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBriefcase size={14} /> Position
              </div>
              <div className="text-lg text-[#e8eaed] font-medium px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6] hover:bg-[#1a1625] hover:border-[#a78bfa] transition-all">
                {alumni.position || <span className="text-[#6b7280] italic">Not specified</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] hover-lift transition-smooth animate-slideInLeft delay-200">
          <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded"></div>
            Organizations
          </h2>
          {Array.isArray(alumni.organizations) && alumni.organizations.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {alumni.organizations.map((organization, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#151220] border border-[#8b5cf6] rounded-lg text-[#e8eaed] hover:bg-[#8b5cf6] hover:text-white hover:-translate-y-0.5 transition-all cursor-default animate-scaleIn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1))',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {organization.charAt(0).toUpperCase() + organization.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#6b7280] italic px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6]">
              Not specified
            </div>
          )}
        </div>

        {/* Specializations */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] hover-lift transition-smooth animate-slideInRight delay-300">
          <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded"></div>
            Specializations
          </h2>
          {Array.isArray(alumni.specializations) && alumni.specializations.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {alumni.specializations.map((specialization, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#151220] border border-[#a78bfa] rounded-lg text-[#e8eaed] hover:bg-[#a78bfa] hover:text-white hover:-translate-y-0.5 transition-all cursor-default animate-scaleIn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(196, 181, 253, 0.1))',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {specialization.charAt(0).toUpperCase() + specialization.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#6b7280] italic px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6]">
              Not specified
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] hover-lift transition-smooth animate-slideInLeft delay-400">
          <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded"></div>
            Technical Skills
          </h2>
          {Array.isArray(alumni.skills) && alumni.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {alumni.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 text-sm font-semibold font-mono bg-[#151220] border border-[#ec4899] rounded-lg text-[#e8eaed] hover:bg-[#ec4899] hover:text-white hover:-translate-y-0.5 transition-all cursor-default shadow-[0_4px_12px_rgba(236,72,153,0.3)] animate-scaleIn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#6b7280] italic px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6]">
              Not specified
            </div>
          )}
        </div>

        {/* Hobbies */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#8b5cf6] hover-lift transition-smooth animate-slideInRight delay-500">
          <h2 className="text-2xl font-bold text-[#e8eaed] mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded"></div>
            Hobbies & Interests
          </h2>
          {Array.isArray(alumni.hobbies) && alumni.hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {alumni.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="px-5 py-2.5 text-sm font-semibold bg-[#151220] border border-[#06b6d4] rounded-lg text-[#e8eaed] hover:bg-[#06b6d4] hover:text-white hover:-translate-y-0.5 transition-all cursor-default animate-scaleIn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(34, 211, 238, 0.1))',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {hobby.charAt(0).toUpperCase() + hobby.slice(1).toLowerCase()}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-lg text-[#6b7280] italic px-4 py-3 bg-[#151220] rounded-lg border border-[#8b5cf6]">
              Not specified
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#f59e0b] hover-lift transition-smooth animate-scaleIn delay-600">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#e8eaed] flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#f59e0b] to-[#ef4444] rounded"></div>
              AI Insights
            </h2>
            <button
              onClick={fetchSimilarities}
              disabled={similarityLoading}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${similarityLoading
                  ? 'bg-[#151220] text-[#6b7280] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#f59e0b] to-[#ef4444] text-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)]'
                }`}
            >
              {similarityLoading ? (
                <>
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <LuSparkles className="animate-pulse" />
                  <span>Find Match</span>
                </>
              )}
            </button>
          </div>

          {showSimilarities && similarities && (
            <div className="space-y-4 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b]/20 to-[#ef4444]/20 border border-[#f59e0b] rounded-full shimmer-overlay">
                <FaRobot className="text-[#f59e0b] animate-pulse" />
                <span className="text-sm font-semibold text-[#e8eaed]">AI-Generated Insights</span>
              </div>

              <div className="relative p-6 bg-[#151220] rounded-xl border border-[#f59e0b] shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-glowPulse">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#f59e0b]"></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#f59e0b]"></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#f59e0b]"></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#f59e0b]"></div>

                <h3 className="text-lg font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Common Ground
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {similarities.map((sim, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-[#1a1625] rounded-lg border border-[#f59e0b]/30 hover:border-[#f59e0b] transition-all animate-scaleIn"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] flex-shrink-0 animate-pulse"></div>
                      <div>
                        <span className="font-semibold text-[#f59e0b] block mb-1">{sim.category}</span>
                        <span className="text-[#e8eaed] text-sm">{sim.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {similaritySummary && (
                  <div className="pt-6 border-t-2 border-[#2d3748]">
                    <p className="text-[#9ca3af] italic leading-relaxed text-center">
                      &quot;{similaritySummary}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!showSimilarities && !similarityLoading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#f59e0b]/20 to-[#ef4444]/20 flex items-center justify-center">
                <LuSparkles className="text-3xl text-[#f59e0b] animate-pulse" />
              </div>
              <p className="text-[#9ca3af]">
                Click &quot;Find Match&quot; to discover what you have in common with this alumni
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Generation Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        className="w-full max-w-2xl p-6 rounded-xl bg-[#1e2433] border border-[#2d3748]"
        useOverlay
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-[#e8eaed] flex items-center gap-2">
            <LuWand className="text-[#ec4899]" />
            Personalize Email
          </h2>
          <p className="text-[#9ca3af]">
            Generate a personalized outreach email to {alumni?.name} based on your shared interests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-2 bg-[#141920] border border-[#2d3748] rounded-lg text-[#e8eaed] focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] outline-none"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Enthusiastic">Enthusiastic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-1">Purpose (Optional)</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Ask for resume advice"
                className="w-full p-2 bg-[#141920] border border-[#2d3748] rounded-lg text-[#e8eaed] placeholder-[#6b7280] focus:ring-2 focus:ring-[#ec4899] focus:border-[#ec4899] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${generating
                ? "bg-[#2d3748] text-[#6b7280] cursor-not-allowed"
                : "bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] hover:shadow-lg hover:shadow-[#ec4899]/30"
              }`}
          >
            {generating ? "Generating..." : "Generate Draft"}
          </button>

          {generatedEmail && (
            <div className="mt-4 bg-[#141920] p-4 rounded-xl border border-[#2d3748]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wide">Generated Draft</span>
                <button
                  onClick={copyToClipboard}
                  className="text-[#9ca3af] hover:text-[#ec4899] transition"
                  title="Copy to clipboard"
                >
                  <FaRegCopy size={16} />
                </button>
              </div>
              <textarea
                readOnly
                value={generatedEmail}
                className="w-full h-48 bg-[#1a1f2e] p-3 rounded-lg border border-[#2d3748] text-[#e8eaed] text-sm resize-none focus:outline-none"
              />
              {sharedInterests.length > 0 && (
                <div className="mt-3 text-xs text-[#10b981] bg-[#10b981]/10 p-2 rounded-lg border border-[#10b981]/30 flex gap-2 items-start">
                  <span className="font-semibold whitespace-nowrap">Shared Interests found:</span>
                  <span>{sharedInterests.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      <Toast ref={toast} />
    </div>
  );
};

export default AlumniProfile;