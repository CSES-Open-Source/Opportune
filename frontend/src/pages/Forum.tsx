import { useEffect, useState } from "react";
import { getAllQuestions, createQuestion, createAnswer, reactToAnswer, getQuestionById } from "../api/Forum";
import { Question, CreateQuestionRequest, FORUM_TAGS, VALID_REACTIONS } from "../types/Forum";
import { useAuth } from "../contexts/useAuth";
import { LuMessageCircle, LuPlus, LuSearch, LuHeart, LuClock, LuArrowLeft, LuUser } from "react-icons/lu";
import "../styles/Animations.css";

const Avatar = ({ userId, size = "sm" }: { userId: string; size?: "sm" | "md" }) => {
  const initials = userId.slice(0, 2).toUpperCase();
  const colors = ["#5b8ef4", "#7c3aed", "#e8590c", "#48bb78", "#ed8936"];
  const color = colors[userId.charCodeAt(0) % colors.length];
  const dim = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
};

const Forum = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<CreateQuestionRequest>({
    questionTitle: "",
    questionContent: "",
    userId: "",
  });

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await getAllQuestions();
    if (res.success) setQuestions(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleQuestionClick = async (q: Question) => {
    const res = await getQuestionById(q._id);
    if (res.success) setSelectedQuestion(res.data);
    else setSelectedQuestion(q);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionContent.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Unanswered") return matchesSearch && q.answers.length === 0;
    if (activeFilter === "Most Answered") return matchesSearch && q.answers.length > 0;
    return matchesSearch;
  });

  const handleAskQuestion = async () => {
    if (!user || !newQuestion.questionTitle || !newQuestion.questionContent) return;
    const res = await createQuestion({ ...newQuestion, userId: user._id });
    if (res.success) {
      setAskModalOpen(false);
      setNewQuestion({ questionTitle: "", questionContent: "", userId: "" });
      fetchQuestions();
    }
  };

  const handlePostAnswer = async () => {
    if (!user || !selectedQuestion || !newAnswerContent.trim()) return;
    const res = await createAnswer(selectedQuestion._id, {
      userId: user._id,
      answerContent: newAnswerContent,
    });
    if (res.success) {
      setNewAnswerContent("");
      const updated = await getQuestionById(selectedQuestion._id);
      if (updated.success) setSelectedQuestion(updated.data);
      fetchQuestions();
    }
  };

  const handleReact = async (answerId: string, emoji: string, currentCount: number) => {
    const delta: 1 | -1 = currentCount > 0 ? -1 : 1;
    const res = await reactToAnswer(answerId, { emoji, delta });
    if (res.success && selectedQuestion) {
      setSelectedQuestion((prev) =>
        prev ? { ...prev, answers: prev.answers.map((a) => (a._id === answerId ? res.data : a)) } : prev,
      );
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // Shared page background
  const pageBg = {
    background: "linear-gradient(135deg, #0f1419 0%, #1a1260 50%, #2a0a4a 100%)",
  };

  // ─── Question Detail View ───────────────────────────────────────────────────
  if (selectedQuestion) {
    return (
      <div className="min-h-screen px-6 py-8 relative" style={pageBg}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(91,142,244,0.12) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-6">

          {/* Back button */}
          <button
            onClick={() => setSelectedQuestion(null)}
            className="flex items-center gap-2 text-sm text-[#a78bfa] hover:text-white transition-colors w-fit"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Forum
          </button>

          {/* Question card — white */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1.5px solid #5b8ef4" }}>
            {/* Blue header strip */}
            <div style={{ background: "linear-gradient(135deg, #1a2a4a, #1e3a6a)" }} className="px-6 py-5">
              <div className="flex items-start gap-4">
                <Avatar userId={selectedQuestion.userId} size="md" />
                <div className="flex-1">
                  <h1
                    className="text-2xl font-bold text-white leading-snug"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {selectedQuestion.questionTitle}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5">
                    <LuUser className="w-3 h-3 text-[#93b4f0]" />
                    <span className="text-xs text-[#93b4f0]">{selectedQuestion.userId}</span>
                    <span className="text-[#4a5568] text-xs">·</span>
                    <LuClock className="w-3 h-3 text-[#4a5568]" />
                    <span className="text-xs text-[#4a5568]">{formatTime(selectedQuestion.createdDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* White content */}
            <div className="bg-white px-6 py-5">
              <p className="text-[#1a1d2e] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedQuestion.questionContent}
              </p>
            </div>
          </div>

          {/* Answers section */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1.5px solid #7c3aed" }}>
            {/* Purple header */}
            <div style={{ background: "linear-gradient(135deg, #2a1060, #1a0a2e)" }} className="px-6 py-4 flex items-center gap-2">
              <LuMessageCircle className="w-4 h-4 text-[#a78bfa]" />
              <span className="text-sm font-semibold text-white">
                {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="h-px" style={{ background: "#4a1a8a" }} />

            {/* White answers body */}
            <div className="bg-white p-5 flex flex-col gap-4">
              {selectedQuestion.answers.length === 0 && (
                <p className="text-center text-[#8892a4] py-6 text-sm">
                  No answers yet — be the first to respond!
                </p>
              )}

              {selectedQuestion.answers.map((a) => (
                <div
                  key={a._id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid #e8590c", background: "#fff" }}
                >
                  {/* Answer author bar */}
                  <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#fff7f3", borderBottom: "1px solid #fde8d8" }}>
                    <Avatar userId={a.userId} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-[#1a1d2e]">{a.userId}</p>
                      <p className="text-xs text-[#8892a4]">{formatTime(a.createdDate)}</p>
                    </div>
                  </div>

                  {/* Answer content */}
                  <div className="px-4 py-4 bg-white">
                    <p className="text-[#1a1d2e] text-sm leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {a.answerContent}
                    </p>
                    <div className="h-px mb-3" style={{ background: "#f0f0f0" }} />
                    {/* Reactions */}
                    <div className="flex gap-2 flex-wrap">
                      {VALID_REACTIONS.map((emoji) => {
                        const count = a.reactions?.[emoji] ?? 0;
                        return (
                          <button
                            key={emoji}
                            onClick={() => handleReact(a._id, emoji, count)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all hover:-translate-y-0.5"
                            style={{
                              background: count > 0 ? "#eff6ff" : "#f8f9fa",
                              border: count > 0 ? "1px solid #5b8ef4" : "1px solid #e2e8f0",
                              color: count > 0 ? "#2563eb" : "#64748b",
                            }}
                          >
                            {emoji}
                            {count > 0 && <span className="text-xs font-medium">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Post answer box */}
              <div className="rounded-xl overflow-hidden mt-2" style={{ border: "1.5px solid #5b8ef4" }}>
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#eff6ff", borderBottom: "1px solid #bfdbfe" }}>
                  {user && <Avatar userId={user._id} size="sm" />}
                  <span className="text-xs font-semibold text-[#1e40af]">Your answer</span>
                </div>
                <div className="p-4 bg-white">
                  <textarea
                    value={newAnswerContent}
                    onChange={(e) => setNewAnswerContent(e.target.value)}
                    placeholder="Write your answer..."
                    rows={4}
                    className="w-full bg-transparent text-sm text-[#1a1d2e] placeholder-[#94a3b8] outline-none resize-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handlePostAnswer}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                      style={{
                        background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                        boxShadow: "0 4px 15px rgba(91,142,244,0.3)",
                      }}
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question List View ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-6 py-8 relative" style={pageBg}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(91,142,244,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">

        {/* Header box — blue */}
        <div className="animate-fadeIn rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1.5px solid #5b8ef4" }}>
          <div style={{ background: "linear-gradient(135deg, #1a2a4a, #1e3a6a)" }} className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)", boxShadow: "0 4px 15px rgba(91,142,244,0.4)" }}
              >
                <LuMessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                  Career Forum
                </h1>
                <p className="text-[#93b4f0] mt-1 text-sm">Ask questions, share advice, get answers from the UCSD community</p>
              </div>
            </div>
            <button
              onClick={() => setAskModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)", boxShadow: "0 4px 15px rgba(91,142,244,0.4)" }}
            >
              <LuPlus className="w-5 h-5" />
              Ask a Question
            </button>
          </div>
          <div className="h-px" style={{ background: "#2d5a9a" }} />
          <div style={{ background: "linear-gradient(135deg, #142240, #182e58)" }} className="flex gap-8 px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-[#93b4f0]">
              <LuMessageCircle className="w-4 h-4 text-[#5b8ef4]" />
              <span className="text-white font-medium">{questions.length}</span> questions
            </div>
            <div className="flex items-center gap-2 text-sm text-[#93b4f0]">
              <LuHeart className="w-4 h-4 text-[#5b8ef4]" />
              <span className="text-white font-medium">{questions.filter((q) => q.answers.length > 0).length}</span> answered
            </div>
            <div className="flex items-center gap-2 text-sm text-[#93b4f0]">
              <LuClock className="w-4 h-4 text-[#5b8ef4]" />
              <span className="text-white font-medium">{questions.filter((q) => q.answers.length === 0).length}</span> unanswered
            </div>
          </div>
        </div>

        {/* Content box — dark gradient */}
        <div
          className="animate-slideUp rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0d1b3e 0%, #1a1260 50%, #2a0a4a 100%)",
            border: "1.5px solid rgba(124,58,237,0.4)",
          }}
        >
          {/* Search + filters */}
          <div className="p-5">
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <LuSearch className="text-[#a78bfa] w-4 h-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-[#6b7280] outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Unanswered", "Most Answered", ...FORUM_TAGS].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className="px-3 py-1.5 rounded-full text-xs border transition-all font-medium"
                  style={
                    activeFilter === tag
                      ? { background: "linear-gradient(135deg, #5b8ef4, #7c3aed)", color: "#fff", borderColor: "transparent" }
                      : { background: "rgba(255,255,255,0.07)", color: "#a78bfa", borderColor: "rgba(167,139,250,0.3)" }
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* Question list */}
          <div className="p-5 flex flex-col gap-3">
            {loading ? (
              <p className="text-center text-[#a78bfa] py-10 text-sm">Loading questions...</p>
            ) : filteredQuestions.length === 0 ? (
              <p className="text-center text-[#a78bfa] py-10 text-sm">No questions found.</p>
            ) : (
              filteredQuestions.map((q) => (
                <div
                  key={q._id}
                  onClick={() => handleQuestionClick(q)}
                  className="rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg overflow-hidden bg-white"
                  style={{ border: "1.5px solid #e8590c", boxShadow: "0 2px 8px rgba(232,89,12,0.08)" }}
                >
                  {/* Card title row */}
                  <div className="flex items-start gap-3 px-4 pt-4 pb-3" style={{ background: "#fff7f3" }}>
                    <Avatar userId={q.userId} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1a1d2e] font-semibold text-sm leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {q.questionTitle}
                      </p>
                      <p className="text-xs text-[#e8590c] mt-0.5 font-medium">{q.userId}</p>
                    </div>
                    {q.answers.length === 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                        Unanswered
                      </span>
                    )}
                    {q.answers.length >= 5 && (
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                        Hot
                      </span>
                    )}
                  </div>

                  <div className="h-px" style={{ background: "#fde8d8" }} />

                  {/* Card body */}
                  <div className="px-4 py-3 bg-white">
                    <p className="text-[#475569] text-xs leading-relaxed mb-3 line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {q.questionContent}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-[#64748b]">
                        <LuMessageCircle className="w-3 h-3" />
                        {q.answers.length} answer{q.answers.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#94a3b8] ml-auto">
                        <LuClock className="w-3 h-3" />
                        {formatTime(q.createdDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ask question modal — white */}
      {askModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10,10,30,0.8)" }}
          onClick={() => setAskModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: "1.5px solid #5b8ef4" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue header */}
            <div style={{ background: "linear-gradient(135deg, #1a2a4a, #1e3a6a)" }} className="px-6 py-4">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>
                Ask a Question
              </h2>
              <p className="text-[#93b4f0] text-xs mt-1">Share your question with the UCSD community</p>
            </div>
            <div className="h-px" style={{ background: "#2d5a9a" }} />

            {/* White body */}
            <div className="p-6 bg-white">
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Question Title</label>
              <input
                type="text"
                placeholder="e.g. How do I prep for system design interviews?"
                value={newQuestion.questionTitle}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, questionTitle: e.target.value }))}
                className="w-full rounded-xl px-4 py-3 text-sm text-[#1a1d2e] placeholder-[#94a3b8] outline-none mb-4"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "'Inter', sans-serif" }}
              />
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Details</label>
              <textarea
                placeholder="Describe your question in detail..."
                value={newQuestion.questionContent}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, questionContent: e.target.value }))}
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm text-[#1a1d2e] placeholder-[#94a3b8] outline-none resize-none mb-5"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "'Inter', sans-serif" }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setAskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#64748b] border border-[#e2e8f0] hover:bg-[#f8fafc] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAskQuestion}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)", boxShadow: "0 4px 15px rgba(91,142,244,0.3)" }}
                >
                  Post Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;