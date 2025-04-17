import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CompanyPage } from "../types/Company";

const defaultLogo = "/assets/defaultLogo.png";

interface CardCarouselProps {
  children: React.ReactNode[];
}

const CardCarousel: React.FC<CardCarouselProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Left scroll button */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <FaChevronLeft size={16} />
      </button>
      {/* Right scroll button */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
      >
        <FaChevronRight size={16} />
      </button>

      {/* Left gradient fade */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />

      {/* Scrolling container */}
      <div
        ref={containerRef}
        onWheel={(e) => {
          if (containerRef.current) {
            e.preventDefault();
            containerRef.current.scrollBy({ left: e.deltaY, behavior: "smooth" });
          }
        }}
        className="flex space-x-4 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth px-8 pb-4"
      >
        {children.map((child, idx) => (
          <div key={idx} className="snap-start flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Right gradient fade */}
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
};

// Helper for badge styling based on difficulty.
const getDifficultyBadgeClasses = (difficulty: string) => {
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

// This interface holds data for any type of expanded card.
interface ExpandedCardData {
  title?: string;
  postedDate?: string;
  difficulty?: string;
  name?: string;
  role?: string;
  text?: string;
}

const CompanyProfile: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<{ data: ExpandedCardData; type: string } | null>(null);

  const [questionModal, setQuestionModal] = useState<{
    data: ExpandedCardData;
    type: "leetcode" | "interview";
  } | null>(null);

  const { id } = useParams<{ id: string }>();

  // Simulated sample data; in production, you would fetch this.
  const sampleCompanies: CompanyPage[] = [
    {
      _id: "4",
      name: "Amazon",
      city: "Seattle",
      state: "WA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      employees: "1.5M+",
      industry: "E-commerce",
      url: "https://www.amazon.com",
    },
  ];

  // Find the company by id.
  const company = sampleCompanies.find((c) => c._id === id) || null;
  if (!company) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-800">
        Company not found.
      </div>
    );
  }

  // Sample data for Leetcode Questions.
  const leetcodeQuestions = [
    { title: "Two Sum", postedDate: "1 month ago", difficulty: "Easy" },
    { title: "Reverse Linked List", postedDate: "3 weeks ago", difficulty: "Medium" },
    { title: "Binary Tree Level Order", postedDate: "2 months ago", difficulty: "Hard" },
    { title: "Valid Parentheses", postedDate: "1 week ago", difficulty: "Easy" },
    { title: "Longest Substring Without Repeating this will cut off because it is too large", postedDate: "3 weeks ago", difficulty: "Medium" },
    { title: "Merge Intervals", postedDate: "2 months ago", difficulty: "Hard" },
  ];

  // Sample data for Interview Questions.
  const interviewQuestions = [
    { title: "Tell me about a time you overcame a challenge", postedDate: "2 weeks ago" },
    { title: "Explain how you handle conflict on a team", postedDate: "1 week ago" },
    { title: "Describe your leadership style", postedDate: "3 weeks ago" },
    { title: "How do you handle tight deadlines?", postedDate: "2 weeks ago" },
    { title: "Where do you see yourself in 5 years?", postedDate: "1 month ago" },
    { title: "What's your biggest strength/weakness?", postedDate: "3 weeks ago" },
  ];

  const alumniInsights = [
    {
      name: "Jane Doe",
      role: "Software Engineer",
      text: "The culture here is fast-paced but incredibly rewarding! It pushes you to innovate and excel every day, even when things get challenging."
    },
    {
      name: "John Smith",
      role: "Product Manager",
      text: "Great benefits and supportive coworkers made all the difference. The collaborative environment lets you thrive and learn continuously."
    },
    {
      name: "Alice Johnson",
      role: "UX Designer",
      text: "Innovation and creativity are at the core of this company. Every project is a chance to push boundaries and create awesome user experiences."
    },
    {
      name: "Michael Brown",
      role: "Data Scientist",
      text: "You're encouraged to experiment and grow your skills every day. The balance between data rigor and creative thinking is unmatched."
    },
    {
      name: "Emily Davis",
      role: "Software Engineer II",
      text: "Collaboration across teams is seamless and supportive. Despite tight deadlines, the friendly atmosphere always helps to keep morale high."
    },
  ];

  // Handler for Alumni Insights modal.
  const handleExpand = (data: ExpandedCardData, type: string) => {
    setExpandedCard({ data, type });
  };

  const closeAlumniModal = () => {
    setExpandedCard(null);
  };

  // Handler for question modals (Leetcode and Interview).
  const handleQuestionClick = (
    e: React.MouseEvent<HTMLDivElement>,
    data: ExpandedCardData,
    type: "leetcode" | "interview"
  ) => {
    setQuestionModal({ data, type });
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 relative">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Company Info */}
        <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14">
              <img
                src={company.logo && company.logo.trim() !== "" ? company.logo : defaultLogo}
                alt={`${company.name} logo`}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-500">
                {company.industry} &bull; {company.city}, {company.state}
              </p>
              <p className="text-sm text-gray-500">{company.employees} employees</p>
            </div>
          </div>
          {company.url && (
            <a
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 transition-colors flex items-center space-x-1 mt-4 sm:mt-0"
            >
              <span>Company website</span>
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Leetcode Questions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Leetcode Questions</h2>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
              Add a new question
            </button>
          </div>
          <CardCarousel>
            {leetcodeQuestions.map((item, idx) => (
              <div
                key={idx}
                className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg transition flex flex-col relative cursor-pointer"
                onClick={(e) => handleQuestionClick(e, item, "leetcode")}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.postedDate}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded inline-block mt-1 ${getDifficultyBadgeClasses(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </CardCarousel>
        </div>

        {/* Interview Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Interview Questions</h2>
          <CardCarousel>
            {interviewQuestions.map((item, idx) => (
              <div
                key={idx}
                className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg transition flex flex-col relative cursor-pointer"
                onClick={(e) => handleQuestionClick(e, item, "interview")}
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{item.postedDate}</p>
                </div>
              </div>
            ))}
          </CardCarousel>
        </div>

        {/* Alumni Insights */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Alumni Insights</h2>
          <CardCarousel>
            {alumniInsights.map((insight, idx) => (
              <div
                key={idx}
                className="w-60 h-40 bg-white border border-gray-200 rounded-md p-4 shadow hover:shadow-lg transition flex flex-col group relative"
              >
                <div className="flex-grow overflow-hidden">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium text-gray-900">{insight.name}</span> ({insight.role}):
                  </p>
                  <p className="text-gray-700 mt-1 line-clamp-3">{insight.text}</p>
                </div>
                <button onClick={() => handleExpand(insight, "alumni")} className="text-blue-600 hover:underline text-sm self-end mt-2">
                  View More
                </button>
              </div>
            ))}
          </CardCarousel>
        </div>
      </div>

      {/* Modal for Leetcode and Interview Questions */}
      {questionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-60 max-h-60 overflow-y-auto relative">
            <button onClick={() => setQuestionModal(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl leading-none">
              &times;
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{questionModal.data.title}</h3>
              {questionModal.data.postedDate && (
                <p className="text-sm text-gray-600">{questionModal.data.postedDate}</p>
              )}
              {questionModal.type === "leetcode" &&
                questionModal.data.difficulty && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded inline-block mt-1 ${getDifficultyBadgeClasses(
                    questionModal.data.difficulty
                  )}`}>
                    {questionModal.data.difficulty}
                  </span>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Alumni Insights */}
      {expandedCard && expandedCard.type === "alumni" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-72 h-72 overflow-y-auto relative">
            <button onClick={closeAlumniModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl leading-none">
              &times;
            </button>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{expandedCard.data.name}</span> ({expandedCard.data.role})
              </p>
              <p className="text-gray-700 mt-1">{expandedCard.data.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
