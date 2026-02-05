import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLinkedin,
  FaRobot
} from "react-icons/fa";
import { LuMail, LuBuilding2, LuBriefcase, LuSparkles } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { getAlumniById, getSimilarities } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../contexts/useAuth";
import { Similarity } from "../types/Similarity";
import "../styles/Animations.css";

const AlumniProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log("route param id: ", id); 
  const navigate = useNavigate();

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user} = useAuth();

  const [similarities, setSimilarities] = useState<Similarity[] | null>(null);
  const [similaritySummary, setSimilaritySummary] = useState<string | null>(null);
  const [similarityLoading, setSimilarityLoading] = useState(false);
  const [showSimilarities, setShowSimilarities] = useState(false);

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
            console.log(error);
          }
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
        .finally(() => setLoading(false));
    }, [id]);

  // Initial company fetch
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

  
  if (!alumni)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
        <p className="text-[#9ca3af]">Alumni not found.</p>
      </div>
    );

  return (
  <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1625 0%, #0d0f1a 100%)' }}>
      {/* Display Spinner While Loading */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <ProgressSpinner className="h-16 w-16" strokeWidth="3" style={{ color: '#ec4899' }} />
        </div>
      )}
      
      {/* When Finished Loading */}
      {!loading && (
        <div className="min-h-screen py-8 px-4">
          {/* Back Button */}
          <div className="max-w-7xl mx-auto mb-6 animate-fadeIn">
            <button
              onClick={() => navigate("/connect")}
              className="inline-flex items-center gap-2 px-4 py-2 text-[#ec4899] hover:text-[#f472b6] transition-all hover:gap-3"
              aria-label="Back to Connect"
              title="Back to Connect"
            >
              <FaArrowLeft />
              <span>Back to Connect</span>
            </button>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            {/* Horizontal Profile Header Card */}
            <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#ec4899] relative overflow-hidden hover-lift transition-smooth animate-slideInLeft">
              {/* Top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6]"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="relative w-32 h-32 flex-shrink-0 animate-scaleIn">
                  {alumni.profilePicture ? (
                    <img
                      src={alumni.profilePicture}
                      alt={alumni.name}
                      className="w-full h-full rounded-full object-cover border-4 border-[#ec4899] shadow-[0_0_30px_rgba(236,72,153,0.4)] hover-scale transition-smooth"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] text-white text-3xl font-bold shadow-[0_0_30px_rgba(236,72,153,0.4)] hover-scale transition-smooth">
                      {alumni.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#10b981] rounded-full border-3 border-[#1f1b2e] shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                </div>

                {/* Name and Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-[#e8eaed] mb-2">{alumni.name}</h1>
                  <p className="text-lg text-[#ec4899] font-semibold mb-6">Alumni</p>
                  
                  {/* Contact Info - Horizontal Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <LuMail size={14} /> Email
                      </div>
                      <div className="text-sm text-[#e8eaed] font-medium px-3 py-2 bg-[#151220] rounded-lg border border-[#ec4899] hover:bg-[#1a1625] hover:border-[#f472b6] transition-all">
                        {alumni.email}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                        <FiPhone size={14} /> Phone
                      </div>
                      <div className="text-sm text-[#e8eaed] font-medium px-3 py-2 bg-[#151220] rounded-lg border border-[#ec4899] hover:bg-[#1a1625] hover:border-[#f472b6] transition-all">
                        {alumni.phoneNumber || <span className="text-[#6b7280] italic">Not provided</span>}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
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
                        <div className="text-sm px-3 py-2 bg-[#151220] rounded-lg border border-[#ec4899]">
                          <span className="text-[#6b7280] italic">Not provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information - Horizontal */}
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

            {/* Organizations - Horizontal */}
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

            {/* Specializations - Horizontal */}
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

            {/* Skills - Horizontal */}
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

            {/* Hobbies - Horizontal */}
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

            {/* AI-Powered Similarities Section - Horizontal */}
            <div className="bg-[#1f1b2e] rounded-2xl p-8 shadow-2xl border border-[#f59e0b] hover-lift transition-smooth animate-scaleIn delay-600">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#e8eaed] flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#f59e0b] to-[#ef4444] rounded"></div>
                  AI Insights
                </h2>
                <button
                  onClick={fetchSimilarities}
                  disabled={similarityLoading}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    similarityLoading
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

              {/* Similarities Display - Horizontal Special AI Box */}
              {showSimilarities && similarities && (
                <div className="space-y-4 animate-fadeIn">
                  {/* AI-Powered Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f59e0b]/20 to-[#ef4444]/20 border border-[#f59e0b] rounded-full shimmer-overlay">
                    <FaRobot className="text-[#f59e0b] animate-pulse" />
                    <span className="text-sm font-semibold text-[#e8eaed]">AI-Generated Insights</span>
                  </div>

                  {/* Similarities List with Special Styling - Horizontal Grid */}
                  <div className="relative p-6 bg-[#151220] rounded-xl border border-[#f59e0b] shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-glowPulse">
                    {/* Corner decorations */}
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
                    
                    {/* Horizontal Grid Layout */}
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

              {/* Empty State */}
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
        </div>
      )}
    </div>
  );
};

export default AlumniProfile;