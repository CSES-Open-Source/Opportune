import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Company, IndustryType } from "../../types/Company";
import { getIndustryLabel, INDUSTRY_COLOR_MAP } from "../../utils/valuesToLabels";
import { LuMapPin, LuExternalLink, LuChevronRight, LuBuilding2 } from "react-icons/lu";

const defaultLogo = "/assets/defaultLogo.png";

const DARK_INDUSTRY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string; rgb: string }> = {
  "bg-blue-100 text-blue-900":     { bg: "rgba(91,142,244,0.12)",  text: "#5b8ef4",  border: "rgba(91,142,244,0.35)",  glow: "rgba(91,142,244,0.18)",  rgb: "91,142,244"   },
  "bg-purple-100 text-purple-900": { bg: "rgba(124,58,237,0.12)",  text: "#a78bfa",  border: "rgba(124,58,237,0.35)",  glow: "rgba(124,58,237,0.18)", rgb: "124,58,237"  },
  "bg-green-100 text-green-900":   { bg: "rgba(16,185,129,0.12)",  text: "#10b981",  border: "rgba(16,185,129,0.35)",  glow: "rgba(16,185,129,0.15)",  rgb: "16,185,129"   },
  "bg-orange-100 text-orange-900": { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b",  border: "rgba(245,158,11,0.35)",  glow: "rgba(245,158,11,0.15)",  rgb: "245,158,11"   },
  "bg-pink-100 text-pink-900":     { bg: "rgba(236,72,153,0.12)",  text: "#ec4899",  border: "rgba(236,72,153,0.35)",  glow: "rgba(236,72,153,0.15)",  rgb: "236,72,153"   },
  "bg-red-100 text-red-900":       { bg: "rgba(239,68,68,0.12)",   text: "#f87171",  border: "rgba(239,68,68,0.35)",   glow: "rgba(239,68,68,0.15)",   rgb: "239,68,68"    },
  "bg-yellow-100 text-yellow-900": { bg: "rgba(234,179,8,0.12)",   text: "#facc15",  border: "rgba(234,179,8,0.35)",   glow: "rgba(234,179,8,0.15)",   rgb: "234,179,8"    },
  "bg-cyan-100 text-cyan-900":     { bg: "rgba(6,182,212,0.12)",   text: "#22d3ee",  border: "rgba(6,182,212,0.35)",   glow: "rgba(6,182,212,0.15)",   rgb: "6,182,212"    },
  "bg-indigo-100 text-indigo-900": { bg: "rgba(99,102,241,0.12)",  text: "#818cf8",  border: "rgba(99,102,241,0.35)",  glow: "rgba(99,102,241,0.15)",  rgb: "99,102,241"   },
  "bg-teal-100 text-teal-900":     { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf",  border: "rgba(20,184,166,0.35)",  glow: "rgba(20,184,166,0.15)",  rgb: "20,184,166"   },
};

const FALLBACK = { bg: "rgba(91,142,244,0.08)", text: "#9ca3af", border: "rgba(45,55,72,0.6)", glow: "rgba(91,142,244,0.10)", rgb: "91,142,244" };

const CompanyTile: React.FC<{ data: Company }> = ({ data }) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const lightColorClass = INDUSTRY_COLOR_MAP[data.industry as IndustryType] ?? "bg-gray-100 text-gray-900";
  const c = DARK_INDUSTRY_COLORS[lightColorClass] ?? FALLBACK;

  const location = data.city && data.state ? `${data.city}, ${data.state}` : "Location not specified";
  const logoSrc = data.logo?.trim() ? data.logo : defaultLogo;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/companies/${data._id}`)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer border overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1e2433, #1c2030)",
        borderColor: hovered ? c.border : "#2d3748",
        boxShadow: hovered
          ? `0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px ${c.border}, 0 0 20px rgba(${c.rgb}, 0.08)`
          : "0 1px 6px rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0px)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* ── Mouse-tracking white spotlight ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: hovered
            ? `radial-gradient(280px circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.055) 0%, transparent 70%)`
            : "none",
          transition: "opacity 0.2s ease",
        }}
      />

      {/* ── Industry-colored corner glow ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: hovered
            ? `radial-gradient(120px circle at 0% 50%, rgba(${c.rgb}, 0.10) 0%, transparent 70%)`
            : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* ── White shimmer sweep on enter ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
        style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.1s" }}
      >
        <div
          style={{
            position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            animation: hovered ? "tileSweep 0.55s ease-out forwards" : "none",
          }}
        />
      </div>

      {/* ── Left accent bar ── */}
      <div
        className="absolute left-0 top-3 bottom-3 rounded-r-full"
        style={{
          width: hovered ? "3px" : "0px",
          background: `linear-gradient(to bottom, ${c.text}, transparent)`,
          transition: "width 0.18s ease",
          boxShadow: hovered ? `0 0 8px ${c.glow}` : "none",
        }}
      />

      {/* ── Logo + Info ── */}
      <div className="flex items-center gap-4 relative z-10">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200"
          style={{
            background: hovered ? c.bg : "#141920",
            borderColor: hovered ? c.border : "#2d3748",
            boxShadow: hovered ? `0 0 20px rgba(${c.rgb}, 0.25)` : "none",
          }}
        >
          <img
            src={logoSrc}
            alt={`${data.name} logo`}
            className="object-contain w-8 h-8 rounded transition-all duration-200"
            style={{
              filter: hovered ? "brightness(1.15) saturate(1.1)" : "brightness(0.82)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>

        <div>
          <p
            className="text-base font-semibold transition-colors duration-200"
            style={{ color: hovered ? "#ffffff" : "#e8eaed" }}
          >
            {data.name}
          </p>

          <div className="flex items-center gap-1 mt-0.5">
            <LuMapPin
              className="w-3 h-3 transition-colors duration-200"
              style={{ color: hovered ? c.text : "#4b5563" }}
            />
            <span
              className="text-xs transition-colors duration-200"
              style={{ color: hovered ? "#6b7280" : "#4b5563" }}
            >
              {location}
            </span>
          </div>

          {/* Industry badge */}
          <span
            className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200"
            style={{
              background: hovered ? c.bg : "rgba(45,55,72,0.45)",
              color: hovered ? c.text : "#6b7280",
              borderColor: hovered ? c.border : "transparent",
              boxShadow: hovered ? `0 0 10px rgba(${c.rgb}, 0.2)` : "none",
            }}
          >
            {getIndustryLabel(data.industry as IndustryType)}
          </span>
        </div>
      </div>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0 relative z-10">
        {data.url && (
          <a
            href={data.url}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            title="Visit website"
            className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-200"
            style={{
              background: "#141920",
              borderColor: hovered ? c.border : "transparent",
              color: hovered ? c.text : "#4b5563",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1) translateY(0)" : "scale(0.75) translateY(4px)",
            }}
          >
            <LuExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <LuChevronRight
          className="w-4 h-4 transition-all duration-200"
          style={{
            color: hovered ? c.text : "#2d3748",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            filter: hovered ? `drop-shadow(0 0 4px rgba(${c.rgb}, 0.5))` : "none",
          }}
        />
      </div>
    </div>
  );
};

export default CompanyTile;