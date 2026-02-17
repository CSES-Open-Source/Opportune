import React, { useCallback, useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import DataList from "../components/public/DataList";
import NewCompanyModal from "../components/company/CompanyModal";
import CompanyTile from "../components/company/CompanyTile";
import { getCompanies as apiGetCompanies } from "../api/companies";
import { APIResult } from "../api/requests";
import { PaginatedData } from "../types/PaginatedData";
import { getEmployeesLabel, getIndustryLabel } from "../utils/valuesToLabels";
import { NumEmployees, IndustryType, Company } from "../types/Company";
import {
  LuBuilding2, LuPlus, LuSlidersHorizontal, LuX,
  LuSearch, LuSparkles,
} from "react-icons/lu";
import "../styles/Animations.css";

const Companies: React.FC = () => {
  const [query, setQuery]                   = useState("");
  const [employeesInput, setEmployeesInput] = useState("");
  const [industryInput, setIndustryInput]   = useState("");
  const [initialized, setInitialized]       = useState(false);
  const [searchFocused, setSearchFocused]   = useState(false);
  const searchCardRef = useRef<HTMLDivElement>(null);
  const [cardSpot, setCardSpot]             = useState({ x: 50, y: 50 });

  const [filters, setFilters] = useState({ query: "", employees: "", industry: "" });

  useEffect(() => {
    if (!initialized) { setInitialized(true); return; }
    const handle = setTimeout(() => setFilters((f) => ({ ...f, query })), 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line
  }, [query]);

  const [showFilters, setShowFilters] = useState(false);
  const applyFilters = () => {
    setFilters({ query, employees: employeesInput, industry: industryInput });
    setShowFilters(false);
  };

  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const refreshFilters = () => setFilters((f) => ({ ...f }));
  const onSaveCompany  = () => { setCompanyModalOpen(false); refreshFilters(); };

  const fetchCompanies = useCallback(
    (page: number, perPage: number) =>
      apiGetCompanies({
        page, perPage,
        query: filters.query,
        employees: filters.employees as NumEmployees,
        industry: filters.industry as IndustryType,
      }).then((res: APIResult<PaginatedData<Company>>) =>
        res.success
          ? { page, perPage, total: res.data.total, data: res.data.data }
          : { page, perPage, total: 0, data: [] },
      ),
    [filters],
  );

  const hasActiveFilters = filters.employees || filters.industry;
  const activeCount      = [filters.employees, filters.industry].filter(Boolean).length;

  /* Mouse-tracking for search card spotlight */
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = searchCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCardSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    });
  };

  return (
    <div
      className="min-h-screen py-8 px-4 md:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Tile shimmer sweep keyframe (used by CompanyTile too) ── */
        @keyframes tileSweep {
          from { left: -60%; opacity: 1; }
          to   { left: 150%; opacity: 0; }
        }

        /* ── Icon glow pulse ── */
        @keyframes iconGlow {
          0%,100% { box-shadow: 0 4px 15px rgba(91,142,244,0.35); }
          50%      { box-shadow: 0 4px 30px rgba(91,142,244,0.65), 0 0 40px rgba(124,58,237,0.22); }
        }
        .icon-glow { animation: iconGlow 3s ease-in-out infinite; }

        /* ── Header title shimmer text ── */
        @keyframes titleShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .title-shimmer {
          background: linear-gradient(90deg, #e8eaed 0%, #ffffff 40%, #a78bfa 60%, #e8eaed 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleShimmer 5s linear infinite;
        }

        /* ── Live dot ── */
        @keyframes liveDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.55); }
        }
        .live-dot { animation: liveDot 1.6s ease-in-out infinite; }

        /* ── Filter badge pop ── */
        @keyframes badgePop {
          0%   { transform: scale(0) rotate(-10deg); }
          70%  { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .badge-pop { animation: badgePop 0.3s cubic-bezier(0.36,0.07,0.19,0.97) both; }

        /* ── Filter pill enter ── */
        @keyframes pillIn {
          from { opacity:0; transform:scale(0.8) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .pill-in { animation: pillIn 0.22s ease-out both; }

        /* ── Staggered header slide-in ── */
        @keyframes headerSlide {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .header-slide-icon { animation: headerSlide 0.5s ease-out 0.0s both; }
        .header-slide-text { animation: headerSlide 0.5s ease-out 0.12s both; }

        /* ── Section header reveal ── */
        @keyframes sectionReveal {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .section-reveal { animation: sectionReveal 0.5s ease-out 0.3s both; }

        /* ── Count up on badge ── */
        @keyframes countPop {
          0%   { transform:scale(0) rotate(-20deg); opacity:0; }
          60%  { transform:scale(1.4) rotate(8deg);  opacity:1; }
          100% { transform:scale(1) rotate(0deg);    opacity:1; }
        }
        .count-pop { animation: countPop 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both; }

        /* ── Divider shimmer ── */
        @keyframes dividerShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .divider-shimmer {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(91,142,244,0.5) 30%,
            rgba(167,139,250,0.7) 50%,
            rgba(91,142,244,0.5) 70%,
            transparent 100%);
          background-size: 200% auto;
          animation: dividerShimmer 4s linear infinite;
          height: 1px;
        }

        /* ── Add button sparkle ── */
        @keyframes sparkle {
          0%,100% { opacity:0; transform:scale(0) rotate(0deg); }
          50%      { opacity:1; transform:scale(1) rotate(180deg); }
        }

        /* ── Orbs float ── */
        @keyframes orbDrift {
          0%,100% { transform:translateY(0) translateX(0); }
          33%      { transform:translateY(-20px) translateX(10px); }
          66%      { transform:translateY(10px) translateX(-8px); }
        }

        /* ── Search pulse when focused ── */
        @keyframes searchPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(91,142,244,0); }
          50%      { box-shadow: 0 0 0 4px rgba(91,142,244,0.12); }
        }
        .search-pulse { animation: searchPulse 2s ease-in-out infinite; }
      `}} />

      {/* ── Ambient orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(91,142,244,0.09) 0%, transparent 70%)", animation: "orbDrift 12s ease-in-out infinite" }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", animation: "orbDrift 16s ease-in-out infinite 3s" }} />
        <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", animation: "orbDrift 10s ease-in-out infinite 6s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,205,0,0.04) 0%, transparent 70%)", animation: "orbDrift 14s ease-in-out infinite 9s" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="p-3 rounded-xl text-white flex-shrink-0 icon-glow header-slide-icon"
              style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)" }}
            >
              <LuBuilding2 className="w-6 h-6" />
            </div>
            <div className="header-slide-text">
              <h1 className="text-4xl font-bold tracking-tight title-shimmer">
                Companies Directory
              </h1>
              <p className="text-[#9ca3af] mt-1">Browse top tech companies and get insider insights</p>
            </div>
          </div>
          <div className="divider-shimmer mt-6 rounded-full" />
        </div>

        {/* ── Search card with mouse-tracking spotlight ── */}
        <div className="mb-8 animate-slideUp">
          <div
            ref={searchCardRef}
            onMouseMove={handleCardMouseMove}
            className="relative rounded-2xl border p-5 shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
              borderColor: searchFocused ? "rgba(91,142,244,0.5)" : "#2d3748",
              boxShadow: searchFocused
                ? "0 0 0 1px rgba(91,142,244,0.2), 0 8px 40px rgba(0,0,0,0.5)"
                : "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Mouse-tracking spotlight on card */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(380px circle at ${cardSpot.x}% ${cardSpot.y}%, rgba(255,255,255,0.04) 0%, transparent 70%)`,
              }}
            />

            {/* Blue glow spotlight when focused */}
            {searchFocused && (
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(300px circle at ${cardSpot.x}% ${cardSpot.y}%, rgba(91,142,244,0.07) 0%, transparent 70%)`,
                }}
              />
            )}

            <div className="relative z-10 flex items-center gap-3">
              {/* Search input */}
              <div
                className="flex items-center gap-3 flex-1 rounded-xl px-4 py-3 border transition-all duration-200"
                style={{
                  background: "#141920",
                  borderColor: searchFocused ? "#5b8ef4" : "#2d3748",
                  boxShadow: searchFocused ? "0 0 0 3px rgba(91,142,244,0.10)" : "none",
                }}
              >
                <FaSearch
                  className="w-4 h-4 flex-shrink-0 transition-all duration-300"
                  style={{
                    color: searchFocused ? "#5b8ef4" : "#6b7280",
                    transform: searchFocused ? "scale(1.1)" : "scale(1)",
                    filter: searchFocused ? "drop-shadow(0 0 4px rgba(91,142,244,0.6))" : "none",
                  }}
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search companies by name or industry..."
                  className="flex-1 bg-transparent text-[#e8eaed] placeholder-[#4b5563] outline-none text-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="w-5 h-5 flex items-center justify-center rounded-full text-[#9ca3af] hover:text-white transition-all hover:rotate-90"
                    style={{ background: "#2d3748" }}
                  >
                    <LuX className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(true)}
                className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: hasActiveFilters ? "rgba(91,142,244,0.14)" : "#141920",
                  borderColor: hasActiveFilters ? "#5b8ef4" : "#2d3748",
                  color: hasActiveFilters ? "#5b8ef4" : "#9ca3af",
                  boxShadow: hasActiveFilters ? "0 4px 14px rgba(91,142,244,0.18)" : "none",
                }}
              >
                <LuSlidersHorizontal
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ transform: showFilters ? "rotate(90deg)" : "rotate(0deg)" }}
                />
                Filter
                {activeCount > 0 && (
                  <span
                    key={activeCount}
                    className="count-pop absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #5b8ef4, #7c3aed)" }}
                  >
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Add company button */}
              <button
                onClick={() => setCompanyModalOpen(true)}
                className="relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                  boxShadow: "0 4px 14px rgba(91,142,244,0.28)",
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 7px 25px rgba(91,142,244,0.5)")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(91,142,244,0.28)")}
              >
                {/* Button shimmer sweep */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    transform: "skewX(-15deg) translateX(-150%)",
                    animation: "tileSweep 2.5s ease-in-out infinite 1s",
                  }}
                />
                <LuPlus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Add Company</span>
              </button>
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="relative z-10 flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2d3748]">
                <span className="text-xs text-[#4b5563] self-center">Active filters:</span>
                {filters.employees && (
                  <span
                    className="pill-in inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(91,142,244,0.10)", borderColor: "rgba(91,142,244,0.3)", color: "#5b8ef4" }}
                  >
                    {getEmployeesLabel(filters.employees as NumEmployees)}
                    <button
                      onClick={() => { setEmployeesInput(""); setFilters((f) => ({ ...f, employees: "" })); }}
                      className="hover:text-white transition-colors"
                    >
                      <LuX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.industry && (
                  <span
                    className="pill-in inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(124,58,237,0.10)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}
                  >
                    {getIndustryLabel(filters.industry as IndustryType)}
                    <button
                      onClick={() => { setIndustryInput(""); setFilters((f) => ({ ...f, industry: "" })); }}
                      className="hover:text-white transition-colors"
                    >
                      <LuX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Section header ── */}
        <div className="section-reveal flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="h-6 w-1 rounded-full"
              style={{
                background: "linear-gradient(to bottom, #5b8ef4, #7c3aed)",
                boxShadow: "0 0 8px rgba(91,142,244,0.5)",
              }}
            />
            <h2 className="text-2xl font-bold text-[#e8eaed]">Browse Companies</h2>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Sparkle icon */}
            <div className="flex items-center gap-1.5 text-[#4b5563] text-xs">
              <LuSparkles className="w-3.5 h-3.5 text-[#FFCD00]/50" />
              <span>Powered by live data</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{ background: "#1e2433", borderColor: "#2d3748" }}
            >
              <div className="w-2 h-2 rounded-full bg-[#10b981] live-dot" />
              <span className="text-[#9ca3af] text-sm">Live Results</span>
            </div>
          </div>
        </div>

        {/* ── Company list ── */}
        <div className="flex flex-col h-[75vh] animate-slideUp delay-200">
          <DataList
            pageType="companies"
            key={`${filters.query}_${filters.employees}_${filters.industry}`}
            fetchData={fetchCompanies}
            useServerPagination
            listStyle={{}}
            listClassName="space-y-2"
            paginatorContent={{ setPerPage: true, goToPage: true }}
            TileComponent={CompanyTile}
          />
        </div>
      </div>

      {/* ── Filter Modal ── */}
      {showFilters && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl border shadow-2xl overflow-hidden animate-scaleIn"
            style={{ background: "linear-gradient(145deg, #1e2433, #1a1f2e)", borderColor: "#2d3748" }}
          >
            {/* Gradient top bar */}
            <div className="h-1" style={{ background: "linear-gradient(90deg, #5b8ef4, #7c3aed)" }} />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: "rgba(91,142,244,0.12)", border: "1px solid rgba(91,142,244,0.25)" }}
                  >
                    <LuSlidersHorizontal className="w-4 h-4 text-[#5b8ef4]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#e8eaed]">Filter Companies</h3>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
                  style={{ background: "#141920", border: "1px solid #2d3748" }}
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Employees", value: employeesInput, onChange: setEmployeesInput, placeholder: "Any size",     options: Object.values(NumEmployees).map(e => ({ value: e, label: getEmployeesLabel(e) })) },
                  { label: "Industry",  value: industryInput,  onChange: setIndustryInput,  placeholder: "Any industry", options: Object.values(IndustryType).map(i => ({ value: i, label: getIndustryLabel(i) })) },
                ].map(({ label, value, onChange, placeholder, options }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                      {label}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full rounded-xl py-2.5 px-3 text-sm text-[#e8eaed] outline-none transition-all"
                      style={{ background: "#141920", border: "1px solid #2d3748" }}
                      onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#5b8ef4"}
                      onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#2d3748"}
                    >
                      <option value="">{placeholder}</option>
                      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setEmployeesInput(""); setIndustryInput("");
                    setFilters({ query, employees: "", industry: "" });
                    setShowFilters(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
                  style={{ background: "#141920", border: "1px solid #2d3748" }}
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                    boxShadow: "0 4px 14px rgba(91,142,244,0.28)",
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <NewCompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onCompanyChanged={onSaveCompany}
        company={null}
      />
    </div>
  );
};

export default Companies;