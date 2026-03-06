import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import AlumniTile from "../components/connect/AlumniTile";
import { getAlumni, getBatchSimilarityScores } from "../api/users";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
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
        const alumniToScore = alumni.slice(0, 10);
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
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        industry: search.industry,
      });

      return res.success ? res.data : { page: 0, perPage: 0, total: 0, data: [] };
    },
    [search],
  );


  useEffect(() => {
    const loadFirstPageWithScores = async () => {
      if (hasFetchedScores || !user?.type || user.type !== "STUDENT" || !user._id) {
        return;
      }

      setHasFetchedScores(false); 
      setLoadingScores(true);

      try {
        const res = await getAlumni({
          page: 0,
          perPage: 10,
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
  }, [user?._id, search.query, search.industry.join(",")]); 

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

        const sortedAlumniWithScores = sortedAlumni.map(alumnus => ({
          ...alumnus,
          similarityScore: similarityScores[alumnus._id] ?? 0,
        }));

        return {
          ...res,
          data: sortedAlumniWithScores,
        };
      }

      return res;
    },
    [getPaginatedOpenAlumni, similarityScores]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">Connect with UCSD alumni working at your dream companies</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <SearchBar<SearchBarData>
            selections={[
              {
                label: "Industry",
                options: [...Object.values(IndustryType)],
              },
            ]}
            placeholder="Search by name, company, or position"
            onSubmitForm={setSearch}
          />
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
              listStyle={{}}
              listClassName="grid grid-cols-3 gap-4"
              paginatorContent={{ setPerPage: true, goToPage: true }}
              TileComponent={AlumniTile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;