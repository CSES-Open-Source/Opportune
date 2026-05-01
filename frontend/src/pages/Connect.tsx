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
    <div className="min-h-screen px-4 py-10 md:px-8 gradient-bg-animated particles-bg">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#5b8ef4] to-[#7c3aed] shadow-neon-blue">
              <LuUsers className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#e8eaed]">
                Alumni Directory
              </h1>
              <p className="text-[#9ca3af] mt-1">
                Connect with UCSD alumni at your dream companies
              </p>
            </div>
          </div>
        </div>

        {/* Search Card */}
        <div className="mb-10 animate-slideUp">
          <div className="glass-effect rounded-2xl p-8 shadow-depth hover-lift transition-smooth relative z-30">
            <div className="flex items-center gap-3 mb-6">
              <LuSearch className="text-[#5b8ef4]" />
              <h2 className="text-xl font-semibold text-[#e8eaed]">
                Find Your Connection
              </h2>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#e5e7eb]">
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

        {/* Alumni Grid */}
        <div className="animate-slideUp delay-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#e8eaed]">
              Browse Alumni
            </h2>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg glass-effect">
              <span className="w-2 h-2 rounded-full bg-[#5b8ef4] animate-pulse"></span>
              <span className="text-sm text-[#9ca3af]">Instant Results</span>
            </div>
          </div>

          {/* Grid wrapper adds shading + hover context */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5b8ef4]/5 to-[#7c3aed]/5 blur-2xl"></div>

            <DataList<Alumni>
              pageType="connect"
              key={`${search.query}_${search.industry.join(",")}`}
              fetchData={getPaginatedOpenAlumni}
              useServerPagination
              listClassName="
                relative z-10
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                gap-8

                [&_.pagination]:text-white
                [&_.pagination_*]:text-white
                [&_select]:text-white
                [&_option]:text-black
              "
              paginatorContent={{ setPerPage: true, goToPage: true }}
              TileComponent={(props) => (
                <div className="transition-smooth hover-lift hover-glow animate-scaleIn">
                  <AlumniTile {...props} />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
