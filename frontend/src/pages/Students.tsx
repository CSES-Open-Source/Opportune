import { useState, useCallback } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import StudentTile from "../components/connect/StudentTile";
import { getStudents } from "../api/users";
import { Student } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { MajorType } from "../types/User";

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  major: string[];
}

const Students = () => {
  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    major: [],
  });

  const getPaginatedOpenStudents = useCallback(
    async (page: number, perPage: number) => {
      const res = await getStudents({
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        major: search.major,
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
        } as PaginatedData<Student>;
      }
    },
    [search],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Directory</h1>
          <p className="text-gray-600">Connect with UCSD students on Opportune!</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <SearchBar<SearchBarData>
            selections={[
              {
                label: "Major",
                options: [...Object.values(MajorType)],
              },
            ]}
            placeholder="Search by name, company, or position"
            onSubmitForm={setSearch}
          />
        </div>
        {/* Student List */}
        <div className="overflow-visible">
          <div className="flex flex-col h-[75vh]">
            <DataList<Student>
              pageType="students"
              key={`${search.query}_${search.major.join(',')}`}
              fetchData={getPaginatedOpenStudents}
              useServerPagination
              listStyle={{}}
              listClassName="grid grid-cols-3 gap-4"
              paginatorContent={{ setPerPage: true, goToPage: true }}
              TileComponent={StudentTile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;