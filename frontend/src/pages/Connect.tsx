import { useState, useCallback } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import AlumniTile from "../components/connect/AlumniTile";
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
        {/* Alumni List */}
        <div className="overflow-visible">
          <div className="flex flex-col h-[75vh]">
            <DataList<Alumni>
              key={`${search.query}_${search.industry.join(',')}`}
              fetchData={getPaginatedOpenAlumni}
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
