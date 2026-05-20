import { useState, useCallback } from "react";
import SearchBar from "../components/public/SearchBar";
import DataList from "../components/public/DataList";
import StudentTile from "../components/connect/StudentTile";
import { getStudents } from "../api/users";
import { Student } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { MajorType } from "../types/User";
import { LuUsers, LuGraduationCap } from "react-icons/lu";
import "../styles/Animations.css";

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
    <div className="min-h-screen overflow-auto" style={{ background: 'linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-4 mb-3">
            <div 
              className="p-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #5b8ef4, #7c3aed)',
                boxShadow: '0 4px 14px rgba(91,142,244,0.3)',
              }}
            >
              <LuUsers className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#e8eaed] flex items-center gap-3">
                Student Directory
              </h1>
              <div className="flex items-center gap-2 text-[#9ca3af] mt-1">
                <LuGraduationCap className="w-4 h-4" />
                <p>Connect with UCSD students on Opportune!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className="rounded-2xl p-6 mb-8 border shadow-2xl animate-slideUp"
          style={{
            background: 'linear-gradient(145deg, #1e2433, #1a1f2e)',
            borderColor: '#2d3748',
          }}
        >
          <SearchBar<SearchBarData>
            selections={[
              {
                label: "Major",
                options: [...Object.values(MajorType)],
              },
            ]}
            placeholder="Search by name, major, or interests..."
            onSubmitForm={setSearch}
          />
        </div>

        {/* Student List */}
        <div className="overflow-visible animate-slideInLeft delay-200">
          <style dangerouslySetInnerHTML={{ __html: `
            /* Override DataList empty state text color */
            .p-datalist-empty-message {
              color: #e8eaed !important;
            }
            .p-datalist .p-datalist-content {
              background: transparent !important;
            }
          `}} />
          <div className="flex flex-col min-h-[75vh]">
            <DataList<Student>
              pageType="students"
              key={`${search.query}_${search.major.join(',')}`}
              fetchData={getPaginatedOpenStudents}
              useServerPagination
              listStyle={{}}
              listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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