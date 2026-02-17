import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaArrowLeft,
} from "react-icons/fa";
import { getCompanyById } from "../api/companies";
import { APIResult } from "../api/requests";
import { Company } from "../types/Company";
import {
  getDifficultyLabel,
  getEmployeesLabel,
  getIndustryLabel,
} from "../utils/valuesToLabels";
import { getLeetcodeQuestionsByCompanyId } from "../api/leetcodeQuestions";
import { Difficulty, LeetcodeQuestion } from "../types/LeetcodeQuestion";
import LeetcodeQuestionModal from "../components/company/LeetcodeQuestionModal";
import NewLeetcodeQuestionModal from "../components/company/NewLeetcodeQuestionModal";
import { UserType } from "../types/User";
import { Tip } from "../types/Tip";
import NewTipModal from "../components/company/NewTipModal";
import TipModal from "../components/company/TipModal";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import NewCompanyModal from "../components/company/CompanyModal";
import { getTipsByCompanyId } from "../api/tips";
import { Editor } from "primereact/editor";
import { getInterviewQuestionsByCompanyId } from "../api/interviewQuestions";
import { InterviewQuestion } from "../types/InterviewQuestion";
import NewInterviewQuestionModal from "../components/company/NewInterviewQuestionModal";
import InterviewQuestionModal from "../components/company/InterviewQuestionModal";
import { useAuth } from "../contexts/useAuth";
import {
  LuBuilding2, LuMapPin, LuUsers, LuExternalLink,
  LuPlus, LuPencil, LuArrowLeft, LuCode, LuMessageSquare,
  LuLightbulb,
} from "react-icons/lu";
import "../styles/Animations.css";

const defaultLogo = "/assets/defaultLogo.png";

type ModalType =
  | "LEETCODE"
  | "NEW_LEETCODE"
  | "INTERVIEW"
  | "NEW_INTERVIEW"
  | "TIP"
  | "NEW_TIP";

interface CardCarouselProps {
  children: React.ReactNode[];
  id?: string;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ children, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        id={id}
        ref={containerRef}
        className="flex space-x-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pb-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#2d3748 #1a1f2e",
        }}
      >
        {children.map((child, i) => (
          <div key={i} className="snap-start flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  easy:   { bg: "rgba(16,185,129,0.12)",  text: "#10b981", border: "rgba(16,185,129,0.3)"  },
  medium: { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b", border: "rgba(245,158,11,0.3)"  },
  hard:   { bg: "rgba(239,68,68,0.12)",   text: "#f87171", border: "rgba(239,68,68,0.3)"   },
};

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [leetcodeQuestions, setLeetcodeQuestions] = useState<LeetcodeQuestion[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);

  const [modalType, setModalType] = useState<ModalType>();
  const [selectedLeetcodeQuestion, setSelectedLeetcodeQuestion] = useState<LeetcodeQuestion>({
    _id: "", company: { _id: "", name: "" },
    user: { _id: "", name: "", email: "", type: UserType.Alumni, profilePicture: "" },
    title: "", difficulty: Difficulty.Easy, url: "",
  });
  const [selectedInterviewQuestion, setSelectedInterviewQuestion] = useState<InterviewQuestion>({
    _id: "", company: { _id: "", name: "" },
    user: { _id: "", name: "", email: "", type: UserType.Alumni, profilePicture: "" },
    question: "",
  });
  const [selectedTip, setSelectedTip] = useState<Tip>({
    _id: "", company: { _id: "", name: "" },
    user: { _id: "", name: "", email: "", type: UserType.Alumni, profilePicture: "" },
    text: "",
  });

  const [leetcodeQuestionsLoading, setLeetcodeQuestionsLoading] = useState(true);
  const [interviewQuestionsLoading, setInterviewQuestionsLoading] = useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchLeetcodeQuestions = useCallback(async (company: Company) => {
    if (company) {
      setLeetcodeQuestionsLoading(true);
      getLeetcodeQuestionsByCompanyId(company._id)
        .then((response) => {
          if (response.success) {
            setLeetcodeQuestions(response.data);
            setLeetcodeQuestionsLoading(false);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch leetcode questions: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch leetcode questions: " + (error as Error).message,
          });
        });
    }
  }, []);

  const fetchInterviewQuestions = useCallback(async (company: Company) => {
    if (company) {
      setInterviewQuestionsLoading(true);
      getInterviewQuestionsByCompanyId(company._id)
        .then((response) => {
          if (response.success) {
            setInterviewQuestions(response.data);
            setInterviewQuestionsLoading(false);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch interview questions: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch interview questions: " + (error as Error).message,
          });
        });
    }
  }, []);

  const fetchTips = useCallback(async (company: Company) => {
    if (company) {
      setTipsLoading(true);
      getTipsByCompanyId(company._id)
        .then((response) => {
          if (response.success) {
            setTips(response.data);
            setTipsLoading(false);
          } else {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to fetch tips: " + response.error,
            });
          }
        })
        .catch((error: unknown) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch tips: " + (error as Error).message,
          });
        });
    }
  }, []);

  const handleCompanyUpdate = useCallback(() => {
    if (!id) return;
    setLoading(true);
    getCompanyById(id)
      .then((result: APIResult<Company>) => {
        if (result.success) {
          setCompany(result.data);
          setError(null);
          fetchLeetcodeQuestions(result.data);
          fetchInterviewQuestions(result.data);
          fetchTips(result.data);
        } else {
          setError(result.error);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [id, fetchLeetcodeQuestions, fetchInterviewQuestions, fetchTips]);

  useEffect(() => {
    handleCompanyUpdate();
  }, [handleCompanyUpdate]);

  const onModalClose = () => {
    setModalType(undefined);
    setSelectedLeetcodeQuestion({
      _id: "", company: { _id: "", name: "" },
      user: { _id: "", name: "", email: "", type: UserType.Alumni, profilePicture: "" },
      title: "", difficulty: Difficulty.Easy, url: "",
    });
    setSelectedTip({
      _id: "", company: { _id: "", name: "" },
      user: { _id: "", name: "", email: "", type: UserType.Alumni, profilePicture: "" },
      text: "",
    });
  };

  if (error)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
      >
        <div className="text-[#f87171] text-lg font-semibold mb-2">Error</div>
        <div className="text-[#9ca3af]">{error}</div>
      </div>
    );

  if (!company && !loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center text-[#9ca3af]"
        style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
      >
        Company not found.
      </div>
    );

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Carousel card hover lift */
        .carousel-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .carousel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }

        /* Section stagger fade-in */
        @keyframes sectionFade {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .section-fade { animation: sectionFade 0.5s ease-out both; }
        .section-fade-1 { animation-delay: 0.05s; }
        .section-fade-2 { animation-delay: 0.15s; }
        .section-fade-3 { animation-delay: 0.25s; }

        /* Logo glow pulse */
        @keyframes logoGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(91,142,244,0); }
          50%      { box-shadow: 0 0 0 8px rgba(91,142,244,0.15); }
        }
        .logo-glow { animation: logoGlow 2.5s ease-in-out infinite; }

        /* Add button shimmer */
        @keyframes addShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .add-btn-shimmer {
          background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
          background-size: 200% auto;
          animation: addShimmer 3s linear infinite;
        }

        /* Carousel button hover */
        .carousel-nav-btn {
          transition: all 0.2s ease;
        }
        .carousel-nav-btn:hover {
          background: rgba(91,142,244,0.12) !important;
          border-color: rgba(91,142,244,0.35) !important;
          color: #5b8ef4 !important;
        }

        /* Difficulty badge glow on hover */
        .diff-badge {
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .diff-badge:hover {
          transform: scale(1.05);
        }
      `}} />

      {loading && (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
        >
          <ProgressSpinner className="h-16 w-16" strokeWidth="3" style={{ color: "#5b8ef4" }} />
        </div>
      )}

      {!loading && company && (
        <div
          className="min-h-screen overflow-auto"
          style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
        >
          {/* ── Top bar ── */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b animate-fadeIn"
            style={{ background: "#1a1f2e", borderColor: "#2d3748" }}
          >
            <button
              onClick={() => navigate("/companies")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#9ca3af] hover:text-[#e8eaed] transition-all hover:-translate-x-1"
              style={{ background: "rgba(91,142,244,0.08)", border: "1px solid rgba(91,142,244,0.2)" }}
            >
              <LuArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Companies</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                boxShadow: "0 4px 14px rgba(91,142,244,0.25)",
              }}
            >
              <LuPencil className="w-4 h-4" />
              Edit Company
            </button>
          </div>

          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">

            {/* ── Company header card ── */}
            <div
              className="rounded-2xl border p-6 shadow-2xl mb-8 animate-slideUp"
              style={{
                background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
                borderColor: "#2d3748",
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center border flex-shrink-0 logo-glow"
                    style={{
                      background: "#141920",
                      borderColor: "rgba(91,142,244,0.3)",
                    }}
                  >
                    <img
                      src={company.logo?.trim() ? company.logo : defaultLogo}
                      alt={`${company.name} logo`}
                      className="object-contain w-12 h-12 rounded"
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <h1 className="text-3xl font-bold text-[#e8eaed] mb-1">
                      {company.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#6b7280]">
                      {company.industry && (
                        <span className="inline-flex items-center gap-1">
                          <LuBuilding2 className="w-3.5 h-3.5" />
                          {getIndustryLabel(company.industry)}
                        </span>
                      )}
                      {(company.city || company.state) && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <LuMapPin className="w-3.5 h-3.5" />
                            {company.city}{company.city && company.state && ","} {company.state}
                          </span>
                        </>
                      )}
                    </div>

                    {company.employees && (
                      <div className="flex items-center gap-1 text-xs text-[#4b5563] mt-1">
                        <LuUsers className="w-3.5 h-3.5" />
                        {getEmployeesLabel(company.employees)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Website link */}
                {company.url && (
                  <a
                    href={company.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#5b8ef4] transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(91,142,244,0.10)",
                      border: "1px solid rgba(91,142,244,0.25)",
                    }}
                  >
                    <span>Company Website</span>
                    <LuExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* ── LeetCode Questions ── */}
            <div className="mb-10 group/leetcode section-fade section-fade-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    <LuCode className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#e8eaed]">LeetCode Questions</h2>
                </div>

                <div className="flex items-center gap-2">
                  {!leetcodeQuestionsLoading && isAuthenticated && (
                    <button
                      onClick={() => setModalType("NEW_LEETCODE")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all opacity-0 group-hover/leetcode:opacity-100 add-btn-shimmer"
                    >
                      <LuPlus className="w-4 h-4" />
                      Add
                    </button>
                  )}

                  <button
                    onClick={() =>
                      document.getElementById("leetcode-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("leetcode-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!leetcodeQuestionsLoading ? (
                leetcodeQuestions.length > 0 ? (
                  <CardCarousel id="leetcode-carousel">
                    {leetcodeQuestions.map((item, i) => {
                      const dColor = DIFFICULTY_COLORS[item.difficulty?.toLowerCase() || "easy"] || DIFFICULTY_COLORS.easy;
                      return (
                        <div
                          key={i}
                          className="carousel-card w-64 h-44 rounded-xl p-4 border cursor-pointer"
                          style={{
                            background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
                            borderColor: "#2d3748",
                          }}
                          onClick={() => {
                            setSelectedLeetcodeQuestion(item);
                            setModalType("LEETCODE");
                          }}
                        >
                          <h3 className="font-semibold text-[#e8eaed] line-clamp-2 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[#6b7280] mb-3">
                            {item.date?.toLocaleDateString() || "No date"}
                          </p>
                          <span
                            className="diff-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                            style={{
                              background: dColor.bg,
                              color: dColor.text,
                              borderColor: dColor.border,
                            }}
                          >
                            {getDifficultyLabel(item.difficulty)}
                          </span>
                        </div>
                      );
                    })}
                  </CardCarousel>
                ) : (
                  <div className="py-12 text-center text-[#4b5563] italic">
                    No LeetCode questions found.
                  </div>
                )
              ) : (
                <div className="py-12 flex justify-center">
                  <ProgressSpinner className="h-10 w-10" strokeWidth="3" style={{ color: "#10b981" }} />
                </div>
              )}
            </div>

            {/* ── Interview Questions ── */}
            <div className="mb-10 group/interview section-fade section-fade-2">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.25)",
                    }}
                  >
                    <LuMessageSquare className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#e8eaed]">Interview Questions</h2>
                </div>

                <div className="flex items-center gap-2">
                  {!interviewQuestionsLoading && isAuthenticated && (
                    <button
                      onClick={() => setModalType("NEW_INTERVIEW")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all opacity-0 group-hover/interview:opacity-100 add-btn-shimmer"
                    >
                      <LuPlus className="w-4 h-4" />
                      Add
                    </button>
                  )}

                  <button
                    onClick={() =>
                      document.getElementById("interview-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("interview-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!interviewQuestionsLoading ? (
                interviewQuestions.length > 0 ? (
                  <CardCarousel id="interview-carousel">
                    {interviewQuestions.map((item, i) => (
                      <div
                        key={i}
                        className="carousel-card w-64 h-44 rounded-xl p-4 border cursor-pointer"
                        style={{
                          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
                          borderColor: "#2d3748",
                        }}
                        onClick={() => {
                          setSelectedInterviewQuestion(item);
                          setModalType("INTERVIEW");
                        }}
                      >
                        <h3 className="font-semibold text-[#e8eaed] line-clamp-3 mb-2">
                          {item.question}
                        </h3>
                        <p className="text-xs text-[#6b7280]">
                          {item.date?.toLocaleDateString() || "No date"}
                        </p>
                      </div>
                    ))}
                  </CardCarousel>
                ) : (
                  <div className="py-12 text-center text-[#4b5563] italic">
                    No interview questions found.
                  </div>
                )
              ) : (
                <div className="py-12 flex justify-center">
                  <ProgressSpinner className="h-10 w-10" strokeWidth="3" style={{ color: "#f59e0b" }} />
                </div>
              )}
            </div>

            {/* ── Alumni Insights ── */}
            <div className="mb-10 group/tip section-fade section-fade-3">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(124,58,237,0.25)",
                    }}
                  >
                    <LuLightbulb className="w-5 h-5 text-[#a78bfa]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#e8eaed]">Alumni Insights</h2>
                </div>

                <div className="flex items-center gap-2">
                  {!tipsLoading && isAuthenticated && (
                    <button
                      onClick={() => setModalType("NEW_TIP")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all opacity-0 group-hover/tip:opacity-100 add-btn-shimmer"
                    >
                      <LuPlus className="w-4 h-4" />
                      Add
                    </button>
                  )}

                  <button
                    onClick={() =>
                      document.getElementById("alumni-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      document.getElementById("alumni-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                    }
                    className="carousel-nav-btn w-9 h-9 flex items-center justify-center rounded-lg text-[#6b7280]"
                    style={{ background: "#1e2433", border: "1px solid #2d3748" }}
                  >
                    <FaChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!tipsLoading ? (
                tips.length > 0 ? (
                  <CardCarousel id="alumni-carousel">
                    {tips.map((tip, i) => (
                      <div
                        key={i}
                        className="carousel-card w-64 h-44 rounded-xl p-4 border cursor-pointer"
                        style={{
                          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
                          borderColor: "#2d3748",
                        }}
                        onClick={() => {
                          setModalType("TIP");
                          setSelectedTip(tip);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={tip.user.profilePicture}
                            alt={tip.user.name}
                            className="w-8 h-8 rounded-full border-2"
                            style={{ borderColor: "rgba(124,58,237,0.3)" }}
                          />
                          <p className="font-semibold text-[#e8eaed] text-sm truncate">
                            {tip.user.name}
                          </p>
                        </div>
                        <div className="h-24 overflow-hidden">
                          <Editor
                            className="mt-1"
                            readOnly={true}
                            showHeader={false}
                            value={tip.text}
                            theme="bubble"
                          />
                        </div>
                      </div>
                    ))}
                  </CardCarousel>
                ) : (
                  <div className="py-12 text-center text-[#4b5563] italic">
                    No alumni tips found.
                  </div>
                )
              ) : (
                <div className="py-12 flex justify-center">
                  <ProgressSpinner className="h-10 w-10" strokeWidth="3" style={{ color: "#a78bfa" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <LeetcodeQuestionModal
        leetcodeQuestion={selectedLeetcodeQuestion}
        isOpen={modalType === "LEETCODE"}
        onClose={onModalClose}
        setLeetcodeQuestion={setSelectedLeetcodeQuestion}
        onUpdateLeetcodeQuestion={() => fetchLeetcodeQuestions(company!)}
      />
      <NewLeetcodeQuestionModal
        isOpen={modalType === "NEW_LEETCODE"}
        onClose={onModalClose}
        company={company!}
        onNewLeetcodeQuestion={() => fetchLeetcodeQuestions(company!)}
      />
      <InterviewQuestionModal
        interviewQuestion={selectedInterviewQuestion}
        isOpen={modalType === "INTERVIEW"}
        onClose={onModalClose}
        setInterviewQuestion={setSelectedInterviewQuestion}
        onUpdateInterviewQuestion={() => fetchInterviewQuestions(company!)}
      />
      <NewInterviewQuestionModal
        isOpen={modalType === "NEW_INTERVIEW"}
        onClose={onModalClose}
        company={company!}
        onNewInterviewQuestion={() => fetchInterviewQuestions(company!)}
      />
      <TipModal
        tip={selectedTip}
        isOpen={modalType === "TIP"}
        onClose={onModalClose}
        setTip={setSelectedTip}
        onUpdateTip={() => fetchTips(company!)}
      />
      <NewTipModal
        isOpen={modalType === "NEW_TIP"}
        onClose={onModalClose}
        company={company!}
        onNewTip={() => fetchTips(company!)}
      />
      <NewCompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCompanyChanged={handleCompanyUpdate}
        company={company}
      />
      <Toast ref={toast} />
    </div>
  );
};

export default CompanyProfile;