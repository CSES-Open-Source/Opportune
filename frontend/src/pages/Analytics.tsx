import React, { useState, useEffect, useRef } from "react";
import { FiTrendingUp, FiCalendar, FiTarget, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";
import { ApplicationStats, MonthlyData, SankeyNode, SankeyTooltipEntry, SankeyData, ApplicationTimeline} from "../types/Application";
import { Toast } from "primereact/toast";
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { getApplicationDetails } from "../api/applications";
import { parseErrorResponse } from "../utils/errorHandler";
import { LuActivity, LuTrendingUp, LuLightbulb, LuSparkles } from "react-icons/lu";
import "../styles/Animations.css";

function buildSankeyFromTimelines(applicationTimelines: ApplicationTimeline[]): SankeyData {
  const fillings = [
    { name: 'APPLIED', color: '#5b8ef4' },
    { name: 'REJECTED', color: '#f87171' },
    { name: 'GHOSTED', color: '#f87171' },
    { name: 'OA', color: '#f59e0b' },
    { name: 'PHONE', color: '#f59e0b' },
    { name: 'FINAL', color: '#f59e0b' },
    { name: 'OFFER', color: '#10b981' },
  ];

  const fillingMap: { [name: string]: string } = {};
  for (const f of fillings) {
    fillingMap[f.name.toUpperCase()] = f.color;
  }

  const pairCounts: { [pair: string]: number } = {};
  const nodesSet = new Set<string>();

  for (let i = 0; i < applicationTimelines.length; i++) {
    const tl = applicationTimelines[i].timeline;
    if (tl.length > 1) {
      for (let j = 0; j < tl.length - 1; j++) {
        const src = String(tl[j].status).toUpperCase();
        const tgt = String(tl[j + 1].status).toUpperCase();
        const key = src + "|||" + tgt;
        pairCounts[key] = (pairCounts[key] || 0) + 1;
        nodesSet.add(src);
        nodesSet.add(tgt);
      }
    } else {
      const s = String(tl[0].status).toUpperCase();
      if (s === "APPLIED") {
        const key = "APPLIED|||OA";
        pairCounts[key] = (pairCounts[key] || 0) + 1;
        nodesSet.add("APPLIED");
        nodesSet.add("OA");
      }
    }
  }

  const nodes = Array.from(nodesSet).map(name => ({
    name,
    color: fillingMap[name.toUpperCase()],
  }));

  const indexMap: { [name: string]: number } = {};
  for (let i = 0; i < nodes.length; i++) indexMap[nodes[i].name] = i;

  const links = Object.keys(pairCounts).map(k => {
    const [src, tgt] = k.split("|||");
    return {
      source: indexMap[src],
      target: indexMap[tgt],
      value: pairCounts[k],
    };
  });

  return { nodes, links };
}

const Analytics: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [sankeyData, setSankeyData] = useState<SankeyData>({ nodes: [], links: [] });
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    phone: 0,
    oa: 0,
    final: 0,
    offer: 0,
    rejected: 0,
    ghosted: 0,
    interviews: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const resolveUserId = (): string | null => {
        if (user) {
          return user._id ?? null;
        }
        return null;
      };

      const fetchAnalytics = async () => {
        try {
          const userId = resolveUserId();
          if (!userId) {
            console.error("UserId not found:", { isAuthenticated, user });
            return;
          }

          const res = await getApplicationDetails(userId);

          if (!res.success) {
            throw new Error("Failed to fetch application data");
          }

          setStats({
            total: res.data.totalApplications,
            offer: res.data.offersReceived,
            oa: res.data.oa,
            phone: res.data.phone,
            final: res.data.final,
            rejected: res.data.rejected,
            ghosted: res.data.ghosted,
            interviews: res.data.interviews,
          });

          const sankey = buildSankeyFromTimelines(res.data.applicationTimelines);
          setSankeyData(sankey);
          const monthDataFromAPI = res.data.applicationsByMonth;

          const filteredMonthlyArray = Object.entries(monthDataFromAPI)
            .filter(([, count]) => count > 0)
            .map(([month, count]) => ({ month, applications: count }));

          setMonthlyData(filteredMonthlyArray);

        } catch (err) {
          const error = err as Error;
          console.error("Error fetching analytics:", error.message);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to update analytics: " + parseErrorResponse(error),
          });
        }
      };

      const initialTimer = setTimeout(() => {
        fetchAnalytics();
        setLoading(false);
      }, 1000);

      const handleApplicationsChanged = () => {
        fetchAnalytics();
      };
      window.addEventListener("applications:changed", handleApplicationsChanged);

      return () => {
        clearTimeout(initialTimer);
        window.removeEventListener("applications:changed", handleApplicationsChanged);
      };
    }
  }, [isAuthenticated, user]);

  interface CustomNodeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: { name: string; value: number };
    containerWidth?: number;
    index?: number;
  }

  const CustomNode: React.FC<CustomNodeProps> = ({ x = 0, y = 0, width = 0, height = 0, payload = {}, containerWidth = 0, index = 0 }) => {
    const fillings = [
      { name: 'APPLIED', color: '#5b8ef4' },
      { name: 'REJECTED', color: '#f87171' },
      { name: 'GHOSTED', color: '#f87171' },
      { name: 'OA', color: '#f59e0b' },
      { name: 'PHONE', color: '#f59e0b' },
      { name: 'FINAL', color: '#f59e0b' },
      { name: 'OFFER', color: '#10b981' },
    ];

    const findFilling = fillings.findIndex(f => f.name === payload.name);
    const filling = findFilling >= 0 ? fillings[findFilling].color : '#5b8ef4';

    if (index === 0) {
      return (
        <g>
          <rect x={x} y={y} width={width + 10} height={height} fill={filling} stroke="none" rx={4} />
          <text
            x={x + width + 15}
            y={y + height / 2 - 25}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={26}
            fontWeight="bold"
            fill="#e8eaed"
          >
            {payload.value}
          </text>
          <text
            x={x + width + 15}
            y={y + height / 2}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={16}
            fontWeight="bold"
            fill="#9ca3af"
          >
            {payload.name}
          </text>
        </g>
      );
    }

    const isLeft = x < containerWidth / 2;
    const textX = isLeft ? x + width + 6 : x - 6;
    const textAnchor = isLeft ? "start" : "end";

    return (
      <g>
        <rect x={x} y={y} width={width + 10} height={height} fill={filling} stroke="none" rx={4} />
        <text
          x={textX}
          y={y + height / 2 - 25}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={26}
          fontWeight="bold"
          fill="#e8eaed"
        >
          {payload.value}
        </text>
        <text
          x={textX}
          y={y + height / 2}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fontSize={16}
          fontWeight="bold"
          fill="#9ca3af"
        >
          {payload.name}
        </text>
      </g>
    );
  }

  interface CustomLinkProps {
    linkWidth?: number;
    payload: {
      source: SankeyNode;
      target: SankeyNode;
      value?: number;
    };
    sourceX?: number;
    sourceY?: number;
    targetX?: number;
    targetY?: number;
    index?: number;
  }

  const CustomLink: React.FC<CustomLinkProps> = (props) => {
    const [hovered, setHovered] = useState(false);

    const strokeWidth = props.linkWidth ?? 1;
    const strokeColor = props.payload.target.color;

    const sx = props.sourceX ?? 0;
    const sy = props.sourceY ?? 0;
    const tx = props.targetX ?? 0;
    const ty = props.targetY ?? 0;

    const curvature = 0.5;
    const cx1 = sx + (tx - sx) * curvature;
    const cy1 = sy;
    const cx2 = tx - (tx - sx) * curvature;
    const cy2 = ty;
    const curvedPath = `M${sx},${sy} C${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`;

    return (
      <path
        d={curvedPath}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={hovered ? 0.9 : 0.5}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        fill="none"
      />
    );
  };

  const CustomTooltip: React.FC<{ payload?: unknown }> = ({ payload }) => {
    const entries = Array.isArray(payload) ? payload : [];

    return (
      <div
        className="rounded-lg border p-2"
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          borderColor: "#2d3748",
          color: "#e8eaed",
          fontSize: "12px",
          minWidth: 0,
          maxWidth: 120,
          lineHeight: 1.4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        {entries.map((entry: SankeyTooltipEntry, idx: number) => (
          <div key={idx} style={{ marginBottom: idx < entries.length - 1 ? 4 : 0 }}>
            <span className="font-semibold">{entry.name}</span>
            <span className="text-[#6b7280]">: </span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e8eaed] mb-4">Please sign in to view analytics</h1>
          <p className="text-[#6b7280]">You need to be logged in to see your application analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2d3748] border-t-[#5b8ef4] mx-auto mb-4"></div>
          <p className="text-[#6b7280]">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  const successRate = stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;
  const interviewRate = stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    <div
      className="min-h-screen overflow-auto"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* Stat card stagger */
        @keyframes statCardFade {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .stat-card-0 { animation: statCardFade 0.4s ease-out 0.0s both; }
        .stat-card-1 { animation: statCardFade 0.4s ease-out 0.1s both; }
        .stat-card-2 { animation: statCardFade 0.4s ease-out 0.2s both; }
        .stat-card-3 { animation: statCardFade 0.4s ease-out 0.3s both; }

        /* Number count up */
        @keyframes countUp {
          from { opacity:0; transform:scale(0.5); }
          to   { opacity:1; transform:scale(1); }
        }
        .count-up { animation: countUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        /* Progress bar fill */
        @keyframes barFill {
          from { width: 0; }
        }
        .bar-fill { animation: barFill 1s ease-out 0.5s both; }

        /* Sankey glow */
        @keyframes sankeyGlow {
          0%,100% { box-shadow: 0 0 20px rgba(91,142,244,0.1), inset 0 0 20px rgba(91,142,244,0.05); }
          50%      { box-shadow: 0 0 30px rgba(91,142,244,0.2), inset 0 0 30px rgba(91,142,244,0.08); }
        }
        .sankey-glow { animation: sankeyGlow 4s ease-in-out infinite; }
      `}} />

      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* ── Header ── */}
        <div className="mb-10 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                boxShadow: "0 4px 14px rgba(91,142,244,0.3)",
              }}
            >
              <LuActivity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#e8eaed]">Application Analytics</h1>
          </div>
          <p className="text-[#9ca3af]">Track your internship application progress and success rates</p>
        </div>

        {/* ── Sankey Chart Section ── */}
        <div className="mb-10 animate-slideUp">
          <div
            className="sankey-glow rounded-2xl border p-6"
            style={{
              background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
              borderColor: "#2d3748",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "rgba(91,142,244,0.12)",
                  border: "1px solid rgba(91,142,244,0.25)",
                }}
              >
                <LuTrendingUp className="w-5 h-5 text-[#5b8ef4]" />
              </div>
              <h2 className="text-2xl font-bold text-[#e8eaed]">Application Flow</h2>
            </div>

            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <Sankey
                  data={sankeyData}
                  node={<CustomNode />}
                  link={(props) => <CustomLink {...props} />}
                  linkCurvature={0.8}
                  nodePadding={30}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <Tooltip content={props => <CustomTooltip {...props} />} />
                </Sankey>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { icon: FiTarget, label: "Total Applications", value: stats.total, color: "#5b8ef4", bg: "rgba(91,142,244,0.12)", border: "rgba(91,142,244,0.25)", index: 0 },
            { icon: FiCheckCircle, label: "Success Rate", value: `${successRate}%`, color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", index: 1 },
            { icon: FiTrendingUp, label: "Interview Rate", value: `${interviewRate}%`, color: "#a78bfa", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.25)", index: 2 },
            { icon: FiCalendar, label: "Offers Received", value: stats.offer, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", index: 3 },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`stat-card-${stat.index} rounded-2xl border p-6 transition-all hover:-translate-y-1`}
              style={{
                background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
                borderColor: "#2d3748",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)")}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <p className="count-up text-3xl font-bold text-[#e8eaed]">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Application Status */}
          <div
            className="rounded-2xl border p-6 animate-slideUp delay-100"
            style={{
              background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
              borderColor: "#2d3748",
            }}
          >
            <h3 className="text-xl font-bold text-[#e8eaed] mb-6">Application Status</h3>
            <div className="space-y-4">
              {[
                { label: "Applied", value: stats.total, color: "#5b8ef4" },
                { label: "Interview", value: stats.interviews, color: "#f59e0b" },
                { label: "Offer", value: stats.offer, color: "#10b981" },
                { label: "Rejected", value: stats.rejected, color: "#f87171" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ background: item.color }} />
                    <span className="text-sm text-[#9ca3af]">{item.label}</span>
                  </div>
                  <span className="font-bold text-[#e8eaed]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Applications */}
          <div
            className="rounded-2xl border p-6 animate-slideUp delay-200"
            style={{
              background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
              borderColor: "#2d3748",
            }}
          >
            <h3 className="text-xl font-bold text-[#e8eaed] mb-6">Applications This Year</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-[#6b7280] font-medium">{data.month}</div>
                  <div className="flex-1">
                    <div className="rounded-full h-2.5" style={{ background: "#2d3748" }}>
                      <div
                        className="bar-fill h-2.5 rounded-full"
                        style={{
                          width: `${Math.min((data.applications / 50) * 100, 100)}%`,
                          background: "linear-gradient(90deg, #5b8ef4, #7c3aed)",
                          boxShadow: "0 0 8px rgba(91,142,244,0.5)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-sm font-bold text-[#e8eaed] text-right">{data.applications}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Insights Section ── */}
        <div
          className="rounded-2xl border p-6 animate-slideUp delay-300"
          style={{
            background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
            borderColor: "#2d3748",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "rgba(255,205,0,0.12)",
                border: "1px solid rgba(255,205,0,0.25)",
              }}
            >
              <LuLightbulb className="w-5 h-5 text-[#FFCD00]" />
            </div>
            <h3 className="text-xl font-bold text-[#e8eaed]">Insights & Recommendations</h3>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-xl border p-4"
              style={{
                background: "rgba(91,142,244,0.08)",
                borderColor: "rgba(91,142,244,0.25)",
              }}
            >
              <div className="flex items-start gap-3">
                <LuSparkles className="w-5 h-5 text-[#5b8ef4] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#9ca3af]">
                  <strong className="text-[#5b8ef4]">Great progress!</strong> You&apos;ve applied to {stats.total} companies.{" "}
                  {interviewRate >= 50 && (
                    <>Your {interviewRate}% interview rate is excellent — you&apos;re doing amazing!</>
                  )}
                  {interviewRate >= 25 && interviewRate < 50 && (
                    <>Your {interviewRate}% interview rate is solid — keep applying strategically.</>
                  )}
                  {interviewRate > 0 && interviewRate < 25 && (
                    <>Your {interviewRate}% interview rate is below average — consider refining your resume or targeting different roles.</>
                  )}
                  {interviewRate === 0 && (
                    <>You haven&apos;t received interviews yet — time to adjust your resume or application strategy.</>
                  )}
                </p>
              </div>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                background: "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.25)",
              }}
            >
              <div className="flex items-start gap-3">
                <LuSparkles className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#9ca3af]">
                  <strong className="text-[#10b981]">Success tip:</strong> Focus on companies where you&apos;ve received interviews.
                  Your conversion rate from interview to offer is {stats.interviews > 0 ? Math.round((stats.offer / stats.interviews) * 100) : 0}%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Analytics;