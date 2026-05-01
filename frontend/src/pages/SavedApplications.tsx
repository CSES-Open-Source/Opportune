import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { getSavedApplicationsByUserID } from "../api/savedApplications";
import DataTable from "../components/public/DataTable";
import SearchBar from "../components/public/SearchBar";
import { SavedApplication } from "../types/SavedApplication";
import { ColumnDef } from "../types/ColumnDef";
import { PaginatedData } from "../types/PaginatedData";
import { useAuth } from "../contexts/useAuth";
import NewSavedApplicationModal from "../components/savedApplication/NewSavedApplicationModal";
import SavedApplicationModal from "../components/savedApplication/SavedApplicationModal";
import { LuBookmark, LuPlus, LuSearch } from "react-icons/lu";
import "../styles/Animations.css";

const defaultLogo = "/assets/defaultLogo.png";

const savedApplicationColumns: ColumnDef<SavedApplication>[] = [
  {
    header: "Company",
    cell: (row) => (
      <div className="flex flex-row items-center gap-3 px-3 py-2">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-[#1a1f2e] border border-[#2d3748] flex items-center justify-center flex-shrink-0">
          <img
            src={row.company.logo || defaultLogo}
            alt="Company Logo"
            className="w-5 h-5 object-contain rounded"
          />
        </div>
        <span className="min-w-0 flex-1 text-[#e8eaed] font-medium truncate pr-2">
          {row.company.name}
        </span>
      </div>
    ),
  },
  {
    header: "Position",
    key: "position",
  },
  {
    header: "Location",
    key: "location",
  },
  {
    header: "Deadline",
    accessor: (row) =>
      row.deadline ? new Date(row.deadline).toLocaleDateString() : "",
  },
  {
    header: "Link",
    key: "link",
    width: "100px",
  },
  {
    header: "Materials Needed",
    accessor: (row) => {
      if (row.materialsNeeded && row.materialsNeeded.length > 0) {
        if (row.materialsNeeded.length > 3) {
          return row.materialsNeeded.slice(0, 3).join(", ") + "...";
        }
        return row.materialsNeeded.join(", ");
      }
      return "";
    },
  },
  {
    header: "Date Saved",
    accessor: (row) =>
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
  },
];

interface SearchBarData extends Record<string, string | string[]> {
  query: string;
  sortBy: string[];
}

const SavedApplications: React.FC = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState<SearchBarData>({
    query: "",
    sortBy: ["createdAt_desc"],
  });

  const [newSavedApplicationOpen, setNewSavedApplicationOpen] = useState(false);
  const [selectedSavedApplication, setSelectedSavedApplication] =
    useState<SavedApplication | null>(null);
  const [savedApplicationModalOpen, setSavedApplicationModalOpen] =
    useState(false);

  const getPaginatedSavedApplications = useCallback(
    async (page: number, perPage: number) => {
      if (!user) {
        return {
          page: 0,
          perPage: 0,
          total: 0,
          data: [],
        } as PaginatedData<SavedApplication>;
      }

      let sortByValue: string | undefined = undefined;
      if (search.sortBy.length > 0) {
        const sortOption = search.sortBy[0];
        if (sortOption === "Deadline") sortByValue = "deadline";
        else if (sortOption === "Date Saved (Newest)")
          sortByValue = "createdAt_desc";
        else if (sortOption === "Date Saved (Oldest)")
          sortByValue = "createdAt_asc";
        else if (sortOption === "Company") sortByValue = "company.name";
        else if (sortOption === "Position") sortByValue = "position";
        else sortByValue = sortOption;
      }

      const res = await getSavedApplicationsByUserID(user._id, {
        page: page,
        perPage: perPage,
        query: search.query.length >= 1 ? search.query : undefined,
        sortBy: sortByValue,
      });

      if (res.success) {
        return res.data;
      } else {
        console.error("Error fetching saved applications:", res.error);
        return {
          page: 0,
          perPage: 0,
          total: 0,
          data: [],
        } as PaginatedData<SavedApplication>;
      }
    },
    [search, user],
  );

  const handleSearchSubmit = (newSearchData: SearchBarData) => {
    setSearch(newSearchData);
  };

  const onSavedApplicationClicked = (application: SavedApplication) => {
    setSelectedSavedApplication(application);
    setSavedApplicationModalOpen(true);
  };

  const onSavedApplicationModalClosed = () => {
    setSavedApplicationModalOpen(false);
    setSelectedSavedApplication(null);
  };

  const onNewSavedApplicationClicked = () => {
    setNewSavedApplicationOpen(true);
  };

  const refreshApplications = () => {
    setSearch((prevSearch) => ({ ...prevSearch }));
  };

  return (
    <div
      className="min-h-screen px-6 py-8 relative"
      style={{ background: "linear-gradient(135deg, #0f1419 0%, #1a1d2e 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="animate-fadeIn">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="p-3 rounded-xl text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #ec4899, #a78bfa)",
                boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
              }}
            >
              <LuBookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#e8eaed] tracking-tight">
                Saved Applications
              </h1>
              <p className="text-[#9ca3af] mt-1">
                Applications you`&apos;`re working on
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#2d3748] to-transparent mt-4" />
        </div>

        {/* Search Bar Card */}
        <div className="animate-slideUp">
          <div className="bg-[#1e2433] rounded-2xl border border-[#2d3748] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#1a1f2e] rounded-lg border border-[#ec4899]">
                <LuSearch className="text-[#ec4899] w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-[#e8eaed]">
                Search & Sort
              </h2>
            </div>
            <div className="bg-[#1a1f2e] rounded-xl p-4 border border-[#2d3748]">
              <SearchBar<SearchBarData>
                selections={[
                  {
                    label: "Sort By",
                    options: [
                      "Date Saved (Newest)",
                      "Date Saved (Oldest)",
                      "Deadline",
                      "Company",
                      "Position",
                    ],
                    single: true,
                  },
                ]}
                onSubmitForm={handleSearchSubmit}
                placeholder="Search by company, position, or location..."
              />
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between animate-slideUp delay-100">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-gradient-to-b from-[#ec4899] to-[#a78bfa] rounded-full" />
            <h2 className="text-2xl font-bold text-[#e8eaed]">Your Saved Applications</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1e2433] rounded-lg border border-[#2d3748]">
            <div className="w-2 h-2 bg-gradient-to-r from-[#ec4899] to-[#a78bfa] rounded-full animate-pulse" />
            <span className="text-[#9ca3af] text-sm">Live Results</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="animate-slideUp delay-200">
          <DataTable<SavedApplication>
            pageType="saved"
            tableStyle={{
              width: "100%",
              height: "72vh",
            }}
            useServerPagination
            paginatorContent={{ setPerPage: true, goToPage: true }}
            columns={savedApplicationColumns}
            fetchData={getPaginatedSavedApplications}
            onRowClick={onSavedApplicationClicked}
          />
        </div>
      </div>

      {/* Floating New Saved Application Button */}
      <button
        onClick={onNewSavedApplicationClicked}
        className="fixed right-10 bottom-8 inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white shadow-2xl transition-all hover:-translate-y-0.5 z-20"
        style={{
          background: "linear-gradient(135deg, #ec4899, #a78bfa)",
          boxShadow: "0 4px 25px rgba(236,72,153,0.4)",
        }}
      >
        <LuPlus className="w-5 h-5" />
        New Saved Application
      </button>

      <NewSavedApplicationModal
        isOpen={newSavedApplicationOpen}
        onClose={() => setNewSavedApplicationOpen(false)}
        onNewSavedApplication={refreshApplications}
      />
      {selectedSavedApplication && (
        <SavedApplicationModal
          isOpen={savedApplicationModalOpen}
          onClose={onSavedApplicationModalClosed}
          savedApplication={selectedSavedApplication}
          setSavedApplication={
            setSelectedSavedApplication as Dispatch<
              SetStateAction<SavedApplication>
            >
          }
          onSaveApplication={refreshApplications}
        />
      )}
    </div>
  );
};

export default SavedApplications;