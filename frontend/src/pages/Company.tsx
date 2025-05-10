import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CompanyPage } from "../types/Company";
import { getCompanyById } from "../api/companies";
import { APIResult } from "../api/requests";
import { Company, ExpandedCardData } from "../types/Company";
import {InterviewAPIItem} from "../types/Interview"
import {LCAPIItem} from "../types/Leetcode"
import {getEmployeesLabel, getIndustryLabel} from "../utils/valueToLabels"


const defaultLogo = "/assets/defaultLogo.png";
const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const USE_SAMPLE_DATA = true;


const sampleLeetcode: ExpandedCardData[] = [
  { title: "Two Sum", postedDate: "1 month ago", difficulty: "Easy" },
  { title: "Reverse Linked List", postedDate: "3 weeks ago", difficulty: "Medium" },
  { title: "Binary Tree Level Order while doing it in a created event using c++", postedDate: "2 months ago", difficulty: "Hard" },
  { title: "Valid Parentheses", postedDate: "1 week ago", difficulty: "Easy" },
];
const sampleInterview: ExpandedCardData[] = [
  { title: "Tell me about a time you overcame a challenge", postedDate: "2 weeks ago" },
  { title: "Explain how you handle conflict on a team", postedDate: "1 week ago" },
  { title: "Describe your leadership style", postedDate: "3 weeks ago" },
];
const sampleAlumni: ExpandedCardData[] = [
  { 
    name: "Jane Doe", 
    role: "Software Engineer", 
    text: "was more that there wasn't enough there that anyone wanted to take the time to understand him. This was a shame as Kevin had many of the answers to the important questions most people who knew him had. It was even more of a shame that they'd refuse to listen even if Kevin offered to give them the answers. So, Kevin remained silent, misunderstood, and kept those important answers to life to himself." 
  },
  { name: "John Smith", role: "Product Manager", text: "Great benefits and collaboration." },
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
    case "easy":   return "bg-green-100 text-green-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "hard":   return "bg-red-100 text-red-800";
    default:       return "bg-gray-100 text-gray-800";
  }
};

const CompanyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyPage | null>(null);
  const [leetcodeQuestions, setLeetcodeQuestions] = useState<ExpandedCardData[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<ExpandedCardData[]>([]);
  const alumniInsights = sampleAlumni;

  const [expandedCard, setExpandedCard] = useState<{ data: ExpandedCardData; type: string } | null>(null);
  const [questionModal, setQuestionModal] = useState<{ data: ExpandedCardData; type: "leetcode" | "interview" } | null>(null);

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
      .catch(e => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, [id]);

  // fetch leetcode questions
  useEffect(() => {
    if (!id) return;
    if (USE_SAMPLE_DATA) {
      setLeetcodeQuestions(sampleLeetcode);
      return;
    }
    fetch(`${API_BASE_URL}/api/questions/leetcode?company=${id}`, { headers: { Accept: "application/json" } })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`);
        if (!(res.headers.get("content-type") || "").includes("application/json"))
          throw new Error("Expected JSON");
        return res.json();
      })
      .then((qs: LCAPIItem[]) =>
        setLeetcodeQuestions(qs.map(q => ({
          title: q.title,
          postedDate: new Date(q.date).toLocaleDateString(),
          difficulty: q.difficulty,
        })))
      )
      .catch(() => setLeetcodeQuestions([]));
  }, [id]);


  // fetch interview questions
  useEffect(() => {
    if (!id) return;
    if (USE_SAMPLE_DATA) {
      setInterviewQuestions(sampleInterview);
      return;
    }
    fetch(`${API_BASE_URL}/api/questions/interview?company=${id}`, { headers: { Accept: "application/json" } })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`);
        if (!(res.headers.get("content-type") || "").includes("application/json"))
          throw new Error("Expected JSON");
        return res.json();
      })
      .then((qs: InterviewAPIItem[]) =>
        setInterviewQuestions(qs.map(q => ({
          title: q.question,
          postedDate: new Date(q.date).toLocaleDateString(),
        })))
      )
      .catch(() => setInterviewQuestions([]));
  }, [id]);

  if (loading)   return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error)     return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  if (!company) return <div className="min-h-screen flex items-center justify-center">Company not found.</div>;

  const handleExpand = (data: ExpandedCardData, type: string) => setExpandedCard({ data, type });
  const closeAlumniModal = () => setExpandedCard(null);
  const handleQuestionClick = (e: React.MouseEvent, data: ExpandedCardData, type: "leetcode" | "interview") =>
    setQuestionModal({ data, type });

  return (
    <div className="bg-white min-h-screen text-gray-800 relative">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Company Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14">
              <img
                src={company.logo?.trim() ? company.logo : defaultLogo}
                alt={`${company.name} logo`}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
              <p className="text-sm text-gray-500">
                {getIndustryLabel(company.industry || "")} • {company.city}, {company.state}
              </p>
              <p className="text-sm text-gray-500">{ getEmployeesLabel(company.employees ?? "")}</p>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">LeetCode Questions</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  document.getElementById("leetcode-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  document.getElementById("leetcode-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {leetcodeQuestions.length > 0 ? (
            <CardCarousel id="leetcode-carousel">
              {leetcodeQuestions.map((item, i) => (
                <div
                  key={i}
                  className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                  onClick={e => handleQuestionClick(e, item, "leetcode")}
                >
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.postedDate}</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded inline-block mt-1 ${getDifficultyBadgeClasses(
                      item.difficulty
                    )}`}
                  >
                    {item.difficulty}
                  </span>
                </div>
              ))}
            </CardCarousel>
          ) : (
            <div className="text-gray-500 italic py-8 text-center">No LeetCode questions found.</div>
          )}
        </div>

        {/* Interview Questions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Interview Questions</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  document.getElementById("interview-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  document.getElementById("interview-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {interviewQuestions.length > 0 ? (
            <CardCarousel id="interview-carousel">
              {interviewQuestions.map((item, i) => (
                <div
                  key={i}
                  className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                  onClick={e => handleQuestionClick(e, item, "interview")}
                >
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.postedDate}</p>
                </div>
              ))}
            </CardCarousel>
          ) : (
            <div className="text-gray-500 italic py-8 text-center">No interview questions found.</div>
          )}
        </div>

        {/* Alumni Insights */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Alumni Insights</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  document.getElementById("alumni-carousel")?.scrollBy({ left: -300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  document.getElementById("alumni-carousel")?.scrollBy({ left: 300, behavior: "smooth" })
                }
                className="p-2 bg-transparent rounded-full hover:bg-gray-100 shadow-none"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
          {alumniInsights.length > 0 ? (
            <CardCarousel id="alumni-carousel">
              {alumniInsights.map((insight, i) => (
                <div
                  key={i}
                  className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg cursor-pointer"
                  onClick={() => handleExpand(insight, "alumni")}
                >
                  <p className="font-medium">
                    {insight.name} ({insight.role})
                  </p>
                  <p className="text-sm line-clamp-3 mt-2">{insight.text}</p>
                </div>
              ))}
            </CardCarousel>
          ) : (
            <div className="text-gray-500 italic py-8 text-center">No alumni insights found.</div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {questionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-60 max-h-60 overflow-y-auto relative">
            <button
              onClick={() => setQuestionModal(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold">{questionModal.data.title}</h3>
            {questionModal.data.postedDate && (
              <p className="text-sm text-gray-600">{questionModal.data.postedDate}</p>
            )}
            {questionModal.type === "leetcode" && questionModal.data.difficulty && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded inline-block mt-1 ${getDifficultyBadgeClasses(
                  questionModal.data.difficulty
                )}`}
              >
                {questionModal.data.difficulty}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Alumni Modal */}
      {expandedCard && expandedCard.type === "alumni" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-72 h-72 overflow-y-auto relative">
            <button
              onClick={closeAlumniModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <p className="font-medium text-gray-900">
              {expandedCard.data.name} ({expandedCard.data.role})
            </p>
            <p className="mt-2 text-gray-700">{expandedCard.data.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;