import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import DataGrid from "../components/DataGrid";
import AlumniTile from "../components/AlumniTile";
import { getAlumni } from "../api/users";
import { APIResult } from "../api/requests";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { IndustryType } from "../types/Company";

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  company: string[];
  position: string[];
}

const Connect = () => {
  const [alumni, setAlumni] = useState<PaginatedData<Alumni>>({
    page: 0,
    perPage: 10,
    total: 0,
    data: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      const result: APIResult<PaginatedData<Alumni>> = await getAlumni({
        page: alumni.page,
        perPage: alumni.perPage,
      });
      if (result.success) {
        setAlumni(result.data);
      } else {
        console.error(result.error); // not sure how we want to handle errors
      }
      setLoading(false);
    };

    fetchAlumni();
  }, [alumni.page, alumni.perPage]);

  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    company: [],
    position: [],
  });

  // Fetch paginated alumni whenever search options change
  const getPaginatedOpenAlumni = useCallback(
    async (page: number, perPage: number) => {
      const res = await getAlumni({
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        company: search.query,
        position: search.query,
      });

      if (res.success) {
        return {
          ...res.data,
        };
      } else {
        console.error(res.error);

        return {
          page: 0,
          perPage: 0,
          total: 0,
          data: [],
        } as PaginatedData<Alumni>;
      }
    },
    [search, alumni],
  );

  const onAlumniClicked = (alumni: Alumni) => {
    // TODO: Toggle modal for view alumni details
    console.log(alumni);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>
          <p>Connect with graduates from your university</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8 ">
          <h1 className="text-2xl font-bold mb-6">Find Alumni</h1>
          <SearchBar<SearchBarData>
            selections={[
              {
                label: "Industry",
                options: [...Object.values(IndustryType)],
              },
            ]}
            placeholder="Search by name, company, or industry"
            onSubmitForm={setSearch}
          />
        </div>
        {/* Alumni Grid */}
        {/* Temporary Solution until we make the sidebar sticky */}
        <div className="overflow-y-auto max-h-[500px]">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <DataGrid<Alumni>
              TileComponent={AlumniTile}
              onTileClicked={onAlumniClicked}
              cols={2}
              maxRows={3}
              useServerPagination
              fetchData={getPaginatedOpenAlumni}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Connect;
