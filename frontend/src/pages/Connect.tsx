import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import AlumniTile from "../components/connect/AlumniTile";
import { getAlumni, getBatchSimilarityScores } from "../api/users";
import { Alumni } from "../types/User";
import { IndustryType } from "../types/Company";
import { LuUsers, LuSearch } from "react-icons/lu";
import { useAuth } from "../contexts/useAuth";
import "../styles/Animations.css";

interface AlumniWithScore extends Alumni {
  similarityScore?: number;
}

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  industry: string[];
}

const Connect = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    industry: [],
  });
  const [similarityScores, setSimilarityScores] = useState<Record<string, number>>({});
  const [loadingScores, setLoadingScores] = useState(false);
  const [hasFetchedScores, setHasFetchedScores] = useState(false);

  const fetchSimilarityScores = useCallback(
    async (alumni: Alumni[]) => {
      if (!user?.type || user.type !== "STUDENT") return;
      if (!user._id) return;

      setLoadingScores(true); //Load the state for the scores allow for skeleton page at a later date
      const scores: Record<string, number> = {};

      try {
        const alumniToScore = alumni.slice(0, 20);
        const alumniIds = alumniToScore.map(a => a._id);
        
        const res = await getBatchSimilarityScores(user._id!, alumniIds);
        if (res.success) {
          res.data.scores.forEach(score => {
            scores[score.alumniId] = score.similarityScore;
          });
        }
        setSimilarityScores(scores);
        setHasFetchedScores(true);
      } catch (error) {
        console.error("Error fetching similarity scores:", error);
      } finally {
        setLoadingScores(false);
      }
    },
    [user]
  );

  const getPaginatedOpenAlumni = useCallback(
    async (page: number, perPage: number) => {
      const res = await getAlumni({
        page,
        perPage,
        query: search.query || undefined,
        industry: search.industry,
      });

      return res.success ? res.data : { page: 0, perPage: 0, total: 0, data: [] };
    },
    [search]
  );


  useEffect(() => {
    const loadFirstPageWithScores = async () => {
      if (hasFetchedScores || !user?.type || user.type !== "STUDENT" || !user._id) {
        return;
      }

      try {
        const res = await getAlumni({
          page: 0,
          perPage: 20,
          query: search.query || undefined,
          industry: search.industry,
        });

        if (res.success && res.data.data.length > 0) {
          await fetchSimilarityScores(res.data.data);
        }
      } catch (error) {
        console.error("Error loading first page with scores:", error);
      }
    };

    loadFirstPageWithScores();
  }, [user, hasFetchedScores, search, fetchSimilarityScores]);

  const fetchAndSortAlumni = useCallback(
    async (page: number, perPage: number) => {
      const res = await getPaginatedOpenAlumni(page, perPage);

      if (res.data && res.data.length > 0 && similarityScores) {
        const sortedAlumni = [...res.data].sort((a, b) => {
          const scoreA = similarityScores[a._id] ?? -Infinity;
          const scoreB = similarityScores[b._id] ?? -Infinity;
          if (scoreB !== scoreA) {
            return scoreB - scoreA; 
          }
          return a.name.localeCompare(b.name); 
        });

        return {
          ...res,
          data: sortedAlumni,
        };
      }

      return res;
    },
    [getPaginatedOpenAlumni, similarityScores]
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

            <DataList<AlumniWithScore>
              pageType="connect"
              key={`${search.query}_${search.industry.join(",")}`}
              fetchData={fetchAndSortAlumni}
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
                <div className="transition-smooth hover-lift hover-glow animate-scaleIn relative">
                  {props.data.similarityScore !== undefined && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#5b8ef4] to-[#7c3aed] rounded-lg px-3 py-1 text-white text-xs font-semibold z-20">
                      {(props.data.similarityScore * 100).toFixed(0)}% match
                    </div>
                  )}
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
