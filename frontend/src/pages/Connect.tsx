import { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import DataGrid from "../components/DataGrid";
import AlumniTile from "../components/AlumniTile";
import { getAlumni } from "../api/users";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { IndustryType } from "../types/Company";

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  industry: string[];
}

const Connect = () => {
  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    industry: [],
  });

  // fetch paginated alumni whenever search options change
  const getPaginatedOpenAlumni = useCallback(
    async (page: number, perPage: number) => {
      const res = await getAlumni({
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        industry: search.industry,
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
    [search],
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl h-screen mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Alumni Directory</h1>
        </div>
        <div className="bg-white border border-gray-300 shadow-sm rounded-lg px-8 py-5 mb-6">
          <h1 className="text-2xl font-bold mb-6">Find Alumni</h1>
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
        {/* Temporary Solution until we make the sidebar sticky */}
        <div className="overflow-y-auto h-[70%]">
          <DataGrid<Alumni>
            TileComponent={AlumniTile}
            cols={3}
            maxRows={5}
            useServerPagination
            fetchData={getPaginatedOpenAlumni}
            className="p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Connect;
