import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getCompanyById } from "../api/companies";
import { APIResult } from "../api/requests";
import { Company, ExpandedCardData } from "../types/Company";
import {
  getDifficultyLabel,
  getEmployeesLabel,
  getIndustryLabel,
} from "../utils/valuesToLabels";
import { getLeetcodeQuestionsByCompanyId } from "../api/leetcodeQuestions";
import { Difficulty, LeetcodeQuestion } from "../types/LeetcodeQuestion";
import LeetcodeQuestionModal from "../components/LeetcodeQuestionModal";
import NewLeetcodeQuestionModal from "../components/NewLeetcodeQuestionModal";
import { UserType } from "../types/User";
import { Tip } from "../types/Tip";
import NewTipModal from "../components/NewTipModal";
import TipModal from "../components/TipModal";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";

const defaultLogo = "/assets/defaultLogo.png";

type ModalType =
  | "LEETCODE"
  | "NEW_LEETCODE"
  | "INTERVIEW"
  | "NEW_INTERVIEW"
  | "TIP"
  | "NEW_TIP";

const sampleInterview: ExpandedCardData[] = [
  {
    title: "Tell me about a time you overcame a challenge",
    postedDate: "2 weeks ago",
  },
  {
    title: "Explain how you handle conflict on a team",
    postedDate: "1 week ago",
  },
  { title: "Describe your leadership style", postedDate: "3 weeks ago" },
];
const sampleAlumni: Tip[] = [
  {
    _id: "",
    user: {
      _id: "",
      name: "Kevin",
      email: "abc@gmail.com",
      type: UserType.Alumni,
      profilePicture: "",
    },
    company: {
      _id: "",
      name: "",
    },
    text: "Bad WLB, very hard interview process. ",
  },
  {
    _id: "",
    user: {
      _id: "",
      name: "Tom",
      email: "abc@gmail.com",
      type: UserType.Alumni,
      profilePicture: "",
    },
    company: {
      _id: "",
      name: "",
    },
    text: "Great benefits and collaboration.",
  },
];

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
        className="flex space-x-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth pb-4"
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

const getDifficultyBadgeClasses = (difficulty?: string) => {
  if (!difficulty) return "bg-gray-100 text-gray-800";
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState<Company | null>(null);

  const [leetcodeQuestions, setLeetcodeQuestions] = useState<
    LeetcodeQuestion[]
  >([]);
  const [interviewQuestions, setInterviewQuestions] = useState<
    ExpandedCardData[]
  >([]);
  const [tips, setTips] = useState<Tip[]>([]);

  const [modalType, setModalType] = useState<ModalType>();
  const [selectedLeetcodeQuestion, setSelectedLeetcodeQuestion] =
    useState<LeetcodeQuestion>({
      _id: "",
      company: { _id: "", name: "" },
      user: {
        _id: "",
        name: "",
        email: "",
        type: UserType.Alumni,
        profilePicture: "",
      },
      title: "",
      difficulty: Difficulty.Easy,
      url: "",
    });
  const [selectedTip, setSelectedTip] = useState<Tip>({
    _id: "",
    company: { _id: "", name: "" },
    user: {
      _id: "",
      name: "",
      email: "",
      type: UserType.Alumni,
      profilePicture: "",
    },
    text: "",
  });

  const [leetcodeQuestionsLoading, setLeetcodeQuestionsLoading] =
    useState(true);
  const [interviewQuestionsLoading, setInterviewQuestionsLoading] =
    useState(true);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchLeetcodeQuestions = useCallback(() => {
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
            detail: "Failed to create tip: " + (error as Error).message,
          });
        });
    }
  }, [company]);

  const fetchInterviewQuestions = useCallback(() => {
    if (company) {
      // TODO: Connect to backend
      setInterviewQuestions(sampleInterview);
      setInterviewQuestionsLoading(false);
    }
  }, [company]);

  const fetchTips = useCallback(() => {
    if (company) {
      // TODO: Connect to backend
      setTips(sampleAlumni);
      setTipsLoading(false);
    }
  }, [company]);

  // fetch company
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCompanyById(id)
      .then((result: APIResult<Company>) => {
        if (result.success) {
          setCompany(result.data);
          setError(null);
        } else {
          setError(result.error);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchLeetcodeQuestions();
  }, [id, company, fetchLeetcodeQuestions]);

  useEffect(() => {
    if (!id) return;
    fetchInterviewQuestions();
  }, [id, company, fetchInterviewQuestions]);

  useEffect(() => {
    if (!id) return;
    fetchTips();
  }, [id, company, fetchTips]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ProgressSpinner className="h-16 w-16" strokeWidth="3" />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  if (!company)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Company not found.
      </div>
    );

  const onModalClose = () => {
    setModalType(undefined);
    setSelectedLeetcodeQuestion({
      _id: "",
      company: { _id: "", name: "" },
      user: {
        _id: "",
        name: "",
        email: "",
        type: UserType.Alumni,
        profilePicture: "",
      },
      title: "",
      difficulty: Difficulty.Easy,
      url: "",
    });
    setSelectedTip({
      _id: "",
      company: { _id: "", name: "" },
      user: {
        _id: "",
        name: "",
        email: "",
        type: UserType.Alumni,
        profilePicture: "",
      },
      text: "",
    });
  };

  return (
    <div>
      <div className="bg-white h-screen overflow-auto text-gray-800 relative">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Company Info */}
          <div className="bg-white border rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14">
                <img
                  src={company.logo?.trim() ? company.logo : defaultLogo}
                  alt={`${company.name} logo`}
                  className="object-contain w-full h-full rounded-md"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {company.name}
                </h1>
                <p className="text-sm text-gray-500">
                  {getIndustryLabel(company.industry || "")} • {company.city},{" "}
                  {company.state}
                </p>
                <p className="text-sm text-gray-500">
                  {getEmployeesLabel(company.employees ?? "")}
                </p>
              </div>
            </div>
            {company.url && (
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 flex items-center space-x-1 mt-4 sm:mt-0"
              >
                <span>Company website</span>
                <FaExternalLinkAlt className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* LeetCode Questions */}
          <div className="mb-8 group/leetcode">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">LeetCode Questions</h2>
              <div className="flex items-center space-x-2">
                {!leetcodeQuestionsLoading && (
                  <button
                    onClick={() => setModalType("NEW_LEETCODE")}
                    className="py-1.5 px-3 mr-4 opacity-0 group-hover/leetcode:opacity-100 transition-all text-white bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() =>
                    document
                      .getElementById("leetcode-carousel")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("leetcode-carousel")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            {!leetcodeQuestionsLoading ? (
              leetcodeQuestions.length > 0 ? (
                <CardCarousel id="leetcode-carousel">
                  {leetcodeQuestions.map((item, i) => (
                    <div
                      key={i}
                      className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                      onClick={() => {
                        setSelectedLeetcodeQuestion(item);
                        setModalType("LEETCODE");
                      }}
                    >
                      <h3 className="font-semibold line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {item.date?.toLocaleDateString()}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded inline-block mt-1 ${getDifficultyBadgeClasses(
                          item.difficulty,
                        )}`}
                      >
                        {getDifficultyLabel(item.difficulty)}
                      </span>
                    </div>
                  ))}
                </CardCarousel>
              ) : (
                <div className="text-gray-500 italic py-8 text-center">
                  No LeetCode questions found.
                </div>
              )
            ) : (
              <div className="py-8 flex justify-center items-center">
                <ProgressSpinner className="h-10 w-10" strokeWidth="3" />
              </div>
            )}
          </div>

          {/* Interview Questions */}
          <div className="mb-8 group/interview">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Interview Questions</h2>
              <div className="flex items-center space-x-2">
                {!interviewQuestionsLoading && (
                  <button
                    onClick={() => setModalType("NEW_INTERVIEW")}
                    className="py-1.5 px-3 mr-4 opacity-0 group-hover/interview:opacity-100 transition-all text-white bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() =>
                    document
                      .getElementById("interview-carousel")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("interview-carousel")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            {!interviewQuestionsLoading ? (
              interviewQuestions.length > 0 ? (
                <CardCarousel id="interview-carousel">
                  {interviewQuestions.map((item, i) => (
                    <div
                      key={i}
                      className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                      onClick={() => {
                        setModalType("INTERVIEW");
                      }}
                    >
                      <h3 className="font-semibold line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {item.postedDate}
                      </p>
                    </div>
                  ))}
                </CardCarousel>
              ) : (
                <div className="text-gray-500 italic py-8 text-center">
                  No interview questions found.
                </div>
              )
            ) : (
              <div className="py-8 flex justify-center items-center">
                <ProgressSpinner className="h-10 w-10" strokeWidth="3" />
              </div>
            )}
          </div>

          {/* Alumni Insights */}
          <div className="mb-8 group/tip">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Alumni Insights</h2>
              <div className="flex items-center space-x-2">
                {!tipsLoading && (
                  <button
                    onClick={() => setModalType("NEW_TIP")}
                    className="py-1.5 px-3 mr-4 opacity-0 group-hover/tip:opacity-100 transition-all text-white bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    Add
                  </button>
                )}
                <button
                  onClick={() =>
                    document
                      .getElementById("alumni-carousel")
                      ?.scrollBy({ left: -300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("alumni-carousel")
                      ?.scrollBy({ left: 300, behavior: "smooth" })
                  }
                  className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            {!tipsLoading ? (
              tips.length > 0 ? (
                <CardCarousel id="alumni-carousel">
                  {tips.map((tip, i) => (
                    <div
                      key={i}
                      className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                      onClick={() => {
                        setModalType("TIP");
                        setSelectedTip(tip);
                      }}
                    >
                      <div className="flex flex-row gap-2">
                        <img
                          src={tip.user.profilePicture}
                          alt={tip.user.name}
                          className="w-7 h-7 rounded-full"
                        />
                        <p className="font-medium">{tip.user.name}</p>
                      </div>
                      <div
                        className="text-sm line-clamp-4 mt-2"
                        dangerouslySetInnerHTML={{ __html: tip.text }}
                      ></div>
                    </div>
                  ))}
                </CardCarousel>
              ) : (
                <div className="text-gray-500 italic py-8 text-center">
                  No alumni tips found.
                </div>
              )
            ) : (
              <div className="py-8 flex justify-center items-center">
                <ProgressSpinner className="h-10 w-10" strokeWidth="3" />
              </div>
            )}
          </div>
        </div>
      </div>

      <LeetcodeQuestionModal
        leetcodeQuestion={selectedLeetcodeQuestion}
        isOpen={modalType === "LEETCODE"}
        onClose={onModalClose}
        setLeetcodeQuestion={setSelectedLeetcodeQuestion}
        onUpdateLeetcodeQuestion={() => fetchLeetcodeQuestions()}
      />

      <NewLeetcodeQuestionModal
        isOpen={modalType === "NEW_LEETCODE"}
        onClose={onModalClose}
        company={company}
        onNewLeetcodeQuestion={() => fetchLeetcodeQuestions()}
      />

      <TipModal
        tip={selectedTip}
        isOpen={modalType === "TIP"}
        onClose={onModalClose}
        setTip={setSelectedTip}
        onUpdateTip={() => fetchTips()}
      />

      <NewTipModal
        isOpen={modalType === "NEW_TIP"}
        onClose={onModalClose}
        company={company}
        onNewTip={() => fetchTips()}
      />

      <Toast ref={toast} />
    </div>
  );
};

export default CompanyProfile;
