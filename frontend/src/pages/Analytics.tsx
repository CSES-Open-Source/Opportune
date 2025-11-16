import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiCalendar, FiTarget, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import { getApplicationDetails, ApplicationAnalytics } from "../api/applications";
import { axisBottom } from "d3";
import axios from "axios";

/* 
interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
*/

interface SankeyTooltipEntry {
  name?: string;
  value?: number | string;
  [key: string]: any;
}

interface CustomLinkProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  color?: string;
  [key: string]: any;
}

interface ApplicationStats {
  total: number;
  phone: number;
  oa: number;
  final: number;
  offer: number;
  rejected: number;
  ghosted: number;
  interviews: number;
}

interface MonthlyData {
  month: string;
  applications: number;
}

type TimelineEntry = { status: string; date: string | Date; note?: string | null };
type ApplicationTimeline = { _id: string; company?: string | null; position?: string; timeline: TimelineEntry[] };

function buildSankeyFromTimelines(applicationTimelines: ApplicationTimeline[]): any {

  const fillings = [
    { name: 'APPLIED', color: '#3b82f6' },
    { name: 'REJECTED', color: '#EF4444' },
    { name: 'GHOSTED', color: '#EF4444' },
    { name: 'OA', color: '#EAB308' },
    { name: 'PHONE', color: '#EAB308' },
    { name: 'FINAL', color: '#EAB308' },
    { name: 'OFFER', color: '#22C55E' },
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
  const [analytics, setAnalytics] = useState<ApplicationAnalytics | null>(null);
  const [sankeyData, setSankeyData] = useState<any>({ nodes: [], links: [] });
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


  useEffect(() => {
    if (isAuthenticated) {

      if (!user || !user._id) {
        console.error("User ID is not available.");
        return;
      }

      const fetchAnalytics = async () => {
        setLoading(true);
        const res = await getApplicationDetails(`${user._id}`);
        if (!res.success) {
          console.error("Failed to fetch analytics:", res.error);
          setLoading(false);
          return;
        }
        console.log(res.data.applicationsByMonth);



        setLoading(false);

        setAnalytics(res.data);

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
          .filter(([_, count]) => count > 0)
          .map(([month, count]) => ({ month, applications: count }));

        setMonthlyData(filteredMonthlyArray);

      }

      setLoading(false);

      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const CustomNode = ({ x, y, width, height, payload, containerWidth, index }: any) => {
    const fillings = [
      { name: 'APPLIED', color: '#3b82f6' },
      { name: 'REJECTED', color: '#EF4444' },
      { name: 'GHOSTED', color: '#EF4444' },
      { name: 'OA', color: '#EAB308' },
      { name: 'PHONE', color: '#EAB308' },
      { name: 'FINAL', color: '#EAB308' },
      { name: 'OFFER', color: '#22C55E' },

    ];

    const findFilling = fillings.findIndex(fillings => fillings.name === payload.name);
    const filling = fillings[findFilling].color;

    if (index === 0) {
      return (
        <g>
          <rect x={x} y={y} width={width + 10} height={height} fill={filling} stroke="none" rx={4} />
          <text
            x={x + width + 15}
            y={y + height / 2 - 25}
            textAnchor="start"
            alignmentBaseline="middle"
            fontSize={26}
            fontWeight="bold"
            className="font-semibold text-gray-900"
          >
            {payload.value}
          </text>
          <text
            x={x + width + 15}
            y={y + height / 2}
            textAnchor="start"
            alignmentBaseline="middle"
            fontSize={16}
            fontWeight="bold"
            className="text-lg font-semibold text-gray-900 mb-4"
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
          alignmentBaseline="middle"
          fontSize={26}
          fontWeight="bold"
          className="font-semibold text-gray-900"
        >
          {payload.value}
        </text>
        <text
          x={textX}
          y={y + height / 2}
          textAnchor={textAnchor}
          alignmentBaseline="middle"
          fontSize={16}
          fontWeight="bold"
          className="font-semibold text-gray-900"
        >
          {payload.name}
        </text>
      </g>
    );
  }

  const CustomLink = (props: any): React.ReactElement<React.SVGProps<SVGPathElement>> | null => {

    const [hovered, setHovered] = useState(false);

    const strokeWidth = props.linkWidth;
    const strokeColor = props.payload.target.color;

    const sx = props.sourceX;
    const sy = props.sourceY;
    const tx = props.targetX;
    const ty = props.targetY;


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
        strokeOpacity={hovered ? 0.9 : 0.4}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        fill="none"
      />
    );

  };

  const CustomTooltip = (props: any) => {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: "4px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          padding: "4px 10px",
          color: "#222",
          fontSize: "12px",
          minWidth: 0,
          maxWidth: 120,
          lineHeight: 1.2,
          pointerEvents: "none",
        }}
      >
        {props.payload.map((entry: SankeyTooltipEntry, idx: number) => (
          <div key={idx} style={{ marginBottom: idx }}>
            <b>{entry.name}</b>: {entry.value}
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view analytics</h1>
          <p className="text-gray-600">You need to be logged in to see your application analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  const successRate = stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0;
  const interviewRate = stats.total > 0 ? Math.round((stats.interviews / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Analytics</h1>
          <p className="text-gray-600">Track your internship application progress and success rates</p>
        </div>

        {/* Sankey Chart Section */}
        <div className="mb-8">
          <div
            className="rounded-lg shadow p-6"
            style={{ backgroundColor: "#FDFFFC" }}
          >
            {/* Box Title */}
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Application Flow
            </h2>

            {/* Sankey Chart */}
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <Sankey
                  data={sankeyData}
                  node={<CustomNode />}
                  link={CustomLink as any}
                  linkCurvature={0.8}
                  nodePadding={30}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <Tooltip content={CustomTooltip as any} />
                </Sankey>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiTarget className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interview Rate</p>
                <p className="text-2xl font-bold text-gray-900">{interviewRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiCalendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offers Received</p>
                <p className="text-2xl font-bold text-gray-900">{stats.offer}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Applied</span>
                </div>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Interview</span>
                </div>
                <span className="font-semibold">{stats.interviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Offer</span>
                </div>
                <span className="font-semibold">{stats.offer}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <span className="font-semibold">{stats.rejected}</span>
              </div>
            </div>
          </div>

          {/* Monthly Applications Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications This Year</h3>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(data.applications / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-semibold">{data.applications}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Great progress!</strong> You&apos;ve applied to {stats.total} companies.
                Your {interviewRate}% interview rate is above average for your field.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Success tip:</strong> Focus on companies where you&apos;ve received interviews.
                Your conversion rate from interview to offer is {stats.interviews > 0 ? Math.round((stats.offer / stats.interviews) * 100) : 0}%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
