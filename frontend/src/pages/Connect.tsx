import { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import DataGrid from "../components/DataGrid";
import AlumniTile from "../components/AlumniTile";
import { getAlumni } from "../api/users";
import { Alumni } from "../types/User";
import { PaginatedData } from "../types/PaginatedData";
import { IndustryType } from "../types/Company";
import AlumniProfileModal from "../components/AlumniProfileModal";

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  company: string[];
  position: string[];
}

const Connect = () => {
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [alumniProfileOpen, setAlumniProfileOpen] = useState(false);

  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    company: [],
    position: [],
  });

  // fetch paginated alumni whenever search options change
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
    [search],
  );

  const onAlumniClicked = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setAlumniProfileOpen(true);
  };

  const onAlumniProfileClose = () => {
    setAlumniProfileOpen(false);
    setSelectedAlumni(null);
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
          <DataGrid<Alumni>
            TileComponent={AlumniTile}
            onTileClicked={onAlumniClicked}
            cols={2}
            maxRows={3}
            useServerPagination
            fetchData={getPaginatedOpenAlumni}
          />
        </div>
      </div>
      <AlumniProfileModal
        isOpen={alumniProfileOpen}
        onClose={onAlumniProfileClose}
        alumni={selectedAlumni}
      />
    </div>
  );
};

export default Connect;
