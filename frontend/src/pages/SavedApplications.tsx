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

const defaultLogo = "/assets/defaultLogo.png";

const savedApplicationColumns: ColumnDef<SavedApplication>[] = [
  {
    header: "Company",
    cell: (row) => (
      <div className="flex flex-row items-center">
        <img
          src={row.company.logo || defaultLogo}
          alt="Company Logo"
          className="w-8 h-8 mr-2 p-1 rounded-md flex-shrink-0 object-contain"
        />
        <span className="min-w-0 flex-1 pr-2">{row.company.name}</span>
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
    sortBy: ["createdAt_desc"], // Default sort by newest
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
        // Map frontend sort options to backend sort field names
        if (sortOption === "Deadline") sortByValue = "deadline";
        else if (sortOption === "Date Saved (Newest)")
          sortByValue = "createdAt_desc"; // Assuming backend supports _desc
        else if (sortOption === "Date Saved (Oldest)")
          sortByValue = "createdAt_asc"; // Assuming backend supports _asc
        else if (sortOption === "Company") sortByValue = "company.name";
        // Requires backend to support nested sort
        else if (sortOption === "Position") sortByValue = "position";
        else sortByValue = sortOption; // Default if no mapping
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
    <div className="flex flex-col gap-5 px-6 py-4">
      <h1 className="text-3xl font-bold">Saved Applications</h1>
      <SearchBar<SearchBarData>
        selections={[
          {
            label: "Filter",
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
      <DataTable<SavedApplication>
        pageType = "saved"
        tableStyle={{ width: "100%", height: "72vh" }}
        useServerPagination
        paginatorContent={{ setPerPage: true, goToPage: true }}
        columns={savedApplicationColumns}
        fetchData={getPaginatedSavedApplications}
        onRowClick={onSavedApplicationClicked}
      />
      <button
        onClick={onNewSavedApplicationClicked}
        className="px-4 py-3 absolute right-10 bottom-6 bg-accent-pink text-white rounded-md hover:opacity-90 font-medium transition"
      >
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
