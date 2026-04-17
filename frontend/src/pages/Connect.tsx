import { useState, useCallback } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import AlumniTile from "../components/connect/AlumniTile";
import { getAlumni } from "../api/users";
import { Alumni } from "../types/User";
import { IndustryType } from "../types/Company";
import { LuUsers, LuSearch } from "react-icons/lu";
import "../styles/Animations.css";

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  industry: string[];
}

const Connect = () => {
  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    industry: [],
  });

  const getPaginatedOpenAlumni = useCallback(
    async (page: number, perPage: number) => {
      const res = await getAlumni({
        page,
        perPage,
        query: search.query || undefined,
        industry: search.industry,
      });

      return res.success
        ? res.data
        : { page: 0, perPage: 0, total: 0, data: [] };
    },
    [search]
  );

  return (
    <div
      className="min-h-screen px-4 py-8 relative"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(91,142,244,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="p-3 rounded-xl text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #5b8ef4, #7c3aed)",
                boxShadow: "0 4px 15px rgba(91,142,244,0.3)",
              }}
            >
              <LuUsers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#e8eaed] tracking-tight">
                Alumni Directory
              </h1>
              <p className="text-[#9ca3af] mt-1">
                Connect with UCSD alumni at your dream companies
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#2d3748] to-transparent mt-4" />
        </div>

        {/* Search Card */}
        <div className="mb-8 animate-slideUp">
          <div
            className="rounded-2xl border p-6 shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
              borderColor: "#2d3748",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2 rounded-lg border"
                style={{
                  background: "#1a1f2e",
                  borderColor: "#5b8ef4",
                }}
              >
                <LuSearch className="text-[#5b8ef4] w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#e8eaed]">
                Find Your Connection
              </h2>
            </div>
            <div
              className="rounded-xl p-4 border"
              style={{ background: "#1a1f2e", borderColor: "#2d3748" }}
            >
              <SearchBar<SearchBarData>
                selections={[
                  { label: "Industry", options: Object.values(IndustryType) },
                ]}
                placeholder="Search by name, company, or position"
                onSubmitForm={setSearch}
              />
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6 animate-slideUp delay-100">
          <div className="flex items-center gap-3">
            <div
              className="h-6 w-1 rounded-full"
              style={{ background: "linear-gradient(to bottom, #5b8ef4, #7c3aed)" }}
            />
            <h2 className="text-2xl font-bold text-[#e8eaed]">Browse Alumni</h2>
          </div>
          <div
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ background: "#1e2433", borderColor: "#2d3748" }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: "linear-gradient(to right, #5b8ef4, #7c3aed)",
              }}
            />
            <span className="text-[#9ca3af] text-sm">Live Results</span>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="animate-slideUp delay-200">
          <DataList<Alumni>
            pageType="connect"
            key={`${search.query}_${search.industry.join(",")}`}
            fetchData={getPaginatedOpenAlumni}
            useServerPagination
            listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            paginatorContent={{ setPerPage: true, goToPage: true }}
            TileComponent={(props) => (
              <div className="transition-all hover:-translate-y-1 animate-scaleIn">
                <AlumniTile {...props} />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;