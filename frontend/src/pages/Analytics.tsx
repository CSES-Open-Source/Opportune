import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiCalendar, FiTarget, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../contexts/useAuth";

interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

interface MonthlyData {
  month: string;
  applications: number;
}

const Analytics: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now - replace with real API calls later
  useEffect(() => {
    if (isAuthenticated) {
      // Simulate API call
      setTimeout(() => {
        setStats({
          total: 24,
          applied: 15,
          interview: 6,
          offer: 2,
          rejected: 7,
        });
        
        setMonthlyData([
          { month: "Jan", applications: 3 },
          { month: "Feb", applications: 5 },
          { month: "Mar", applications: 8 },
          { month: "Apr", applications: 6 },
          { month: "May", applications: 2 },
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);

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
  const interviewRate = stats.total > 0 ? Math.round((stats.interview / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Analytics</h1>
          <p className="text-gray-600">Track your internship application progress and success rates</p>
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
                <span className="font-semibold">{stats.applied}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Interview</span>
                </div>
                <span className="font-semibold">{stats.interview}</span>
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
                        style={{ width: `${(data.applications / 10) * 100}%` }}
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
                Your conversion rate from interview to offer is {stats.interview > 0 ? Math.round((stats.offer / stats.interview) * 100) : 0}%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
